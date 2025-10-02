// Admin Portal - Dashboard for managing orders and users
import React, { useState, useEffect } from 'react';
import { db, collection, getDocs, updateDoc, doc, addDoc } from '../services/firebase';

// Status colors
const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  active: 'bg-green-100 text-green-800',
  completed: 'bg-blue-100 text-blue-800',
};

function AdminPortal({ user }) {
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [addAdminMsg, setAddAdminMsg] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState('');
  const [emailSending, setEmailSending] = useState('');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [groups, setGroups] = useState([]);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Add sample data for testing
  const addSampleData = async () => {
    if (!user || !user.isAdmin) return;
    
    try {
      const sampleOrders = [
        {
          name: "John Doe",
          email: "john@example.com",
          phone: "9876543210",
          subscriptionType: "Netflix",
          planType: "Premium 4K + HDR",
          numberOfPeople: "5 people",
          amountPaid: 139,
          amountRemaining: 510,
          totalAmount: 649,
          paymentMethod: "UPI",
          status: "pending",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Jane Smith",
          email: "jane@example.com",
          phone: "9876543211",
          subscriptionType: "Spotify",
          planType: "Premium Family",
          numberOfPeople: "6 people",
          amountPaid: 34,
          amountRemaining: 165,
          totalAmount: 199,
          paymentMethod: "Card",
          status: "active",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      for (const order of sampleOrders) {
        await addDoc(collection(db, 'payments'), order);
      }
      
      showToast('Sample data added successfully', 'success');
      // Refresh orders
      window.location.reload();
    } catch (err) {
      console.error('Error adding sample data:', err);
      showToast('Failed to add sample data', 'error');
    }
  };

  // Fetch orders from Firebase
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        if (!user || !user.isAdmin) {
          throw new Error('Admin access required');
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const querySnapshot = await getDocs(collection(db, 'payments'));
        
        if (querySnapshot.empty) {
          setOrders([]);
          showToast('No orders found in database', 'success');
          return;
        }
        
        const fetchedOrders = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate?.() || new Date(),
            updatedAt: data.updatedAt?.toDate?.() || new Date()
          };
        });
        setOrders(fetchedOrders);
        showToast(`Loaded ${fetchedOrders.length} orders successfully`, 'success');
      } catch (err) {
        console.error('Error fetching orders:', err);
        setOrders([]);
        showToast(`Failed to load orders: ${err.message}`, 'error');
      } finally {
        setLoading(false);
      }
    };
    
    if (user && user.isAdmin) {
      fetchOrders();
    }
  }, [user]);

  // Group orders by planType for group management UI
  useEffect(() => {
    const groupMap = {};
    orders.forEach(order => {
      if (!order.planType) return;
      if (!groupMap[order.planType]) groupMap[order.planType] = [];
      groupMap[order.planType].push(order);
    });
    setGroups(Object.entries(groupMap).map(([planType, members], i) => ({ id: i+1, planType, members })));
  }, [orders]);

  // Change order status (pending/active/completed)
  const handleStatusChange = async (orderId, newStatus) => {
    setStatusUpdating(orderId);
    try {
      console.log(`Updating order ${orderId} to status: ${newStatus}`);
      await updateDoc(doc(db, 'payments', orderId), { 
        status: newStatus,
        updatedAt: new Date()
      });
      setOrders(orders => orders.map(o => o.id === orderId ? { ...o, status: newStatus, updatedAt: new Date() } : o));
      showToast(`Order status updated to ${newStatus}`, 'success');
    } catch (err) {
      console.error('Error updating order status:', err);
      showToast('Failed to update status', 'error');
    } finally {
      setStatusUpdating('');
    }
  };

  // Simulate sending email to user (UI only)
  const handleSendEmail = async (order) => {
    setEmailSending(order.id);
    setTimeout(() => {
      showToast(`Email sent to ${order.email}`);
      setEmailSending('');
    }, 1000);
  };

  // Simulate adding a new admin (UI only)
  const handleAddAdmin = (e) => {
    e.preventDefault();
    setAddAdminMsg(`Admin ${newAdminEmail} added (not really, just UI for now)`);
    setNewAdminEmail('');
    showToast('Admin added (UI only)');
  };

  // Filter orders by search query
  const filteredOrders = orders.filter(order =>
    order.name?.toLowerCase().includes(search.toLowerCase()) ||
    order.email?.toLowerCase().includes(search.toLowerCase()) ||
    order.planType?.toLowerCase().includes(search.toLowerCase())
  );

  // Dropdown for changing order status in modal
  function StatusDropdown({ value, onChange, disabled }) {
    const [open, setOpen] = useState(false);
    const options = [
      { value: 'pending', label: 'Pending' },
      { value: 'active', label: 'Active' },
      { value: 'completed', label: 'Completed' },
    ];
    const selected = options.find(o => o.value === value);
    return (
      <div className="relative inline-block w-32 text-left z-50">
        <button
          type="button"
          className={`w-full px-3 py-2 border rounded bg-white text-left text-sm ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'} focus:outline-none focus:ring-2 focus:ring-blue-400`}
          onClick={() => !disabled && setOpen(o => !o)}
          disabled={disabled}
        >
          {selected?.label || 'Select'}
          <span className="float-right">▼</span>
        </button>
        {open && (
          <div className="absolute left-0 mt-1 w-full bg-white border border-slate-200 rounded shadow-lg z-50">
            {options.map(opt => (
              <div
                key={opt.value}
                className={`px-4 py-2 text-sm hover:bg-blue-50 cursor-pointer ${opt.value === value ? 'font-semibold text-blue-700' : ''}`}
                onClick={() => { onChange(opt.value); setOpen(false); }}
              >
                {opt.label}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Modal for viewing and editing order details
  const OrderModal = ({ order, onClose }) => {
    if (!order) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-2">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full relative animate-fadeInUp p-8">
          <button className="absolute -top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-white border border-slate-200 shadow text-slate-700 hover:bg-slate-100 hover:text-blue-600 focus:outline-none" onClick={onClose} aria-label="Close">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10 8.586l4.95-4.95a1 1 0 111.414 1.414L11.414 10l4.95 4.95a1 1 0 01-1.414 1.414L10 11.414l-4.95 4.95a1 1 0 01-1.414-1.414L8.586 10l-4.95-4.95A1 1 0 115.05 3.636L10 8.586z" clipRule="evenodd" /></svg>
          </button>
          <h2 className="text-xl font-bold mb-2">Order Details</h2>
          <div className="mb-2 text-slate-700"><span className="font-semibold">User:</span> {order.name}</div>
          <div className="mb-2 text-slate-700"><span className="font-semibold">Email:</span> {order.email}</div>
          <div className="mb-2 text-slate-700"><span className="font-semibold">Plan:</span> {order.planType || order.subscriptionType}</div>
          <div className="mb-2 text-slate-700"><span className="font-semibold">Status:</span> <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${statusColors[order.status] || 'bg-slate-100 text-slate-700'}`}>{order.status}</span></div>
          <div className="mb-2 text-slate-700"><span className="font-semibold">Amount Paid:</span> ₹{order.amountPaid}</div>
          <div className="mb-2 text-slate-700"><span className="font-semibold">Phone:</span> {order.phone}</div>
          <div className="mb-2 text-slate-700"><span className="font-semibold">Payment Method:</span> {order.paymentMethod}</div>
          <div className="mb-2 text-slate-700"><span className="font-semibold">Group:</span> <span className="text-blue-600">(Assign to group UI coming soon)</span></div>
          <div className="flex gap-2 mt-4 items-center">
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={() => handleSendEmail(order)} disabled={emailSending === order.id}>{emailSending === order.id ? 'Sending...' : 'Send Email'}</button>
            {/* Custom dropdown for status */}
            <StatusDropdown value={order.status} onChange={v => handleStatusChange(order.id, v)} disabled={statusUpdating === order.id} />
          </div>
        </div>
      </div>
    );
  };

  // Modal for managing groups (UI only, no backend logic)
  const GroupModal = ({ onClose }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-2">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full relative animate-fadeInUp p-8">
        <button className="absolute -top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-white border border-slate-200 shadow text-slate-700 hover:bg-slate-100 hover:text-blue-600 focus:outline-none" onClick={onClose} aria-label="Close">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10 8.586l4.95-4.95a1 1 0 111.414 1.414L11.414 10l4.95 4.95a1 1 0 01-1.414 1.414L10 11.414l-4.95 4.95a1 1 0 01-1.414-1.414L8.586 10l-4.95-4.95A1 1 0 115.05 3.636L10 8.586z" clipRule="evenodd" /></svg>
        </button>
        <h2 className="text-xl font-bold mb-4">Manage Groups</h2>
        <div className="space-y-4">
          {groups.length === 0 ? <div className="text-slate-400">No groups found.</div> : groups.map(group => (
            <div key={group.id} className="border rounded-lg p-4">
              <div className="font-semibold text-blue-700 mb-2">{group.planType}</div>
              <div className="text-slate-700 text-sm mb-1">Members:</div>
              <ul className="text-slate-600 text-sm list-disc ml-5">
                {group.members.map(m => <li key={m.id}>{m.name} ({m.email})</li>)}
              </ul>
              <div className="mt-2 text-xs text-slate-400">Group size: {group.members.length}</div>
            </div>
          ))}
        </div>
        <button className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full">Create New Group (UI only)</button>
      </div>
    </div>
  );

  // Analytics summary for admin
  const totalOrders = orders.length;
  const activeGroups = groups.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  return (
    <div className="min-h-screen bg-slate-50 pb-10 flex flex-col items-center">
      {/* Toast notification */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-4 py-2 rounded shadow-lg text-white ${toast.type === 'error' ? 'bg-red-600' : 'bg-green-600'}`}>{toast.message}</div>
      )}
      {/* Analytics summary bar */}
      <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6 mt-24 mb-8 px-2">
        <h1 className="text-3xl font-bold text-slate-900 text-center md:text-left">Admin Portal</h1>
        <div className="flex gap-4 justify-center md:justify-end">
          <div className="bg-blue-50 px-4 py-2 rounded-lg text-blue-700 font-semibold text-sm">Total Orders: {totalOrders}</div>
          <div className="bg-green-50 px-4 py-2 rounded-lg text-green-700 font-semibold text-sm">Active Groups: {activeGroups}</div>
          <div className="bg-yellow-50 px-4 py-2 rounded-lg text-yellow-700 font-semibold text-sm">Pending Orders: {pendingOrders}</div>
        </div>
      </div>
      {/* Search and actions row */}
      <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 px-2">
        <input
          type="text"
          placeholder="Search by user, email, or plan..."
          className="w-full md:w-80 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors text-sm" onClick={addSampleData}>
            Add Sample Data
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors" onClick={() => setShowGroupModal(true)}>
            Manage Groups
          </button>
        </div>
      </div>
      {/* Orders table */}
      <div className="w-full max-w-4xl mx-auto overflow-x-auto border-b border-slate-200 mb-10 bg-white rounded-xl shadow-sm">
        {loading ? (
          <div className="text-center text-slate-400 py-12">Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center text-slate-400 py-12">No orders found.</div>
        ) : (
          <table className="min-w-full text-sm bg-transparent">
            <thead className="bg-slate-50 sticky top-0 z-20 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">User</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Email</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Plan</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Amount Paid</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.id} className="border-b border-slate-100 hover:bg-blue-50 cursor-pointer transition" style={{height: '56px'}} onClick={() => setSelectedOrder(order)}>
                  <td className="px-4 py-2 text-base">{order.name}</td>
                  <td className="px-4 py-2 text-base">{order.email}</td>
                  <td className="px-4 py-2 text-base">{order.planType || order.subscriptionType}</td>
                  <td className="px-4 py-2">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${statusColors[order.status] || 'bg-slate-100 text-slate-700'}`}>{order.status}</span>
                  </td>
                  <td className="px-4 py-2 text-base">₹{order.amountPaid}</td>
                  <td className="px-4 py-2 flex flex-col gap-2 items-start md:flex-row md:items-center">
                    <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400" onClick={e => { e.stopPropagation(); handleSendEmail(order); }} disabled={emailSending === order.id}>{emailSending === order.id ? 'Sending...' : 'Send Email'}</button>
                    <button className="px-3 py-1 bg-slate-100 text-slate-700 rounded hover:bg-slate-200 text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-400" onClick={e => { e.stopPropagation(); setSelectedOrder(order); }}>Change Status</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {/* Add admin section (only for super admin) */}
      {user?.isSuperAdmin && (
        <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row md:items-center gap-2 px-2 mb-8">
          <form className="flex gap-2 w-full md:w-auto" onSubmit={handleAddAdmin}>
            <input
              type="email"
              placeholder="Admin email"
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
              value={newAdminEmail}
              onChange={e => setNewAdminEmail(e.target.value)}
              required
            />
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">Add Admin</button>
          </form>
          {addAdminMsg && <div className="text-green-600 mt-2 md:mt-0 md:ml-4 text-sm">{addAdminMsg}</div>}
        </div>
      )}
      {/* Order details modal */}
      <OrderModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      {/* Group management modal */}
      {showGroupModal && <GroupModal onClose={() => setShowGroupModal(false)} />}
      {/* Floating action button for group creation (UI only) */}
      <button className="fixed bottom-8 right-8 z-40 bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg text-3xl hover:bg-blue-700" onClick={() => setShowGroupModal(true)} title="Manage Groups">
        +
      </button>
    </div>
  );
}

export default AdminPortal; 