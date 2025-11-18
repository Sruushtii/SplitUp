// Admin Portal - Dashboard for managing orders and users
import React, { useState, useEffect } from 'react';
import { db, collection, getDocs, updateDoc, doc } from '../services/firebase';

// Status colors
const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  active: 'bg-green-100 text-green-800',
  completed: 'bg-blue-100 text-blue-800',
};

import { getServiceNameFromPlanType } from './getServiceNameFromPlanType';
import { sendWelcomeEmail } from '../services/emailService';

function AdminPortal({ user }) {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [subgroups, setSubgroups] = useState([]);
  const [selectedSubgroupIdx, setSelectedSubgroupIdx] = useState(0);
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
      if (order.status !== 'pending') return; // Only include pending users
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

  // Send emails to all members of a subgroup
  const sendSubgroupEmails = async (subgroup, group) => {
    if (!subgroup || !Array.isArray(subgroup) || subgroup.length === 0) {
      showToast('No members in this subgroup', 'error');
      return;
    }
    let successCount = 0;
    let failCount = 0;
    for (const member of subgroup) {
      try {
        await sendWelcomeEmail({
          email: member.email,
          name: member.name,
          service_name: getServiceNameFromPlanType(group.planType),
          group_name: group.planType,
          subscription_period: '1 Month', // or dynamic if available
          members: subgroup.map(m => m.email).join(', '),
          subscription_username: 'splitupdemo@gmail.com',
          subscription_password: 'demo1234',
          platform_url: 'https://splitup.sruushtii.in',
        });
        // Auto-update status from 'pending' to 'active' in Firestore
        if (member.status === 'pending' && member.id) {
          try {
            await updateDoc(doc(db, 'payments', member.id), { status: 'active', updatedAt: new Date() });
          } catch (updateErr) {
            console.error('Failed to update status for', member.email, updateErr);
          }
        }
        successCount++;
      } catch (err) {
        failCount++;
        console.error('Failed to send email to', member.email, err);
      }
    }
    if (successCount > 0) showToast(`Sent ${successCount} email(s) successfully`, 'success');
    if (failCount > 0) showToast(`Failed to send ${failCount} email(s)`, 'error');
    // Remove non-pending users from local state
    setOrders(prevOrders => prevOrders.map(order =>
      subgroup.some(m => m.id === order.id) && order.status === 'pending'
        ? { ...order, status: 'active' }
        : order
    ));
    // No need to manually update groups; let useEffect handle it based on orders

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
            {/* Custom dropdown for status */}
            <StatusDropdown value={order.status} onChange={v => handleStatusChange(order.id, v)} disabled={statusUpdating === order.id} />
          </div>
        </div>
      </div>
    );
  };

  // Modal for managing groups (UI only, no backend logic)
  function splitGroup(members, size) {
    const result = [];
    for (let i = 0; i < members.length; i += size) {
      result.push(members.slice(i, i + size));
    }
    return result;
  }

  const GroupModal = ({ onClose, selectedGroup, setSelectedGroup, subgroups, setSubgroups, selectedSubgroupIdx, setSelectedSubgroupIdx }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 py-6">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full relative animate-fadeInUp flex flex-col max-h-[90vh]">
        {/* Fixed Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Manage Groups</h2>
            <p className="text-sm text-slate-500 mt-1">View and manage subscription groups</p>
          </div>
          <button 
            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400" 
            onClick={onClose} 
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M10 8.586l4.95-4.95a1 1 0 111.414 1.414L11.414 10l4.95 4.95a1 1 0 01-1.414 1.414L10 11.414l-4.95 4.95a1 1 0 01-1.414-1.414L8.586 10l-4.95-4.95A1 1 0 115.05 3.636L10 8.586z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Group selection or subgroup management */}
          {!selectedGroup ? (
            groups.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <svg className="w-16 h-16 text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="text-slate-400 text-lg">No groups found</p>
                <p className="text-slate-400 text-sm mt-1">Groups will appear here once users place orders</p>
              </div>
            ) : (
              <div className="space-y-4">
                {groups.map((group, index) => (
                  <div key={group.id} className="border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow bg-gradient-to-br from-white to-slate-50">
                    {/* Group Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-700 font-bold text-lg">{index + 1}</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-slate-900">{getServiceNameFromPlanType(group.planType)}</h3>
                          <p className="text-xs text-slate-500">Subscription Group</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="text-sm font-semibold text-blue-700">{group.members.length} {group.members.length === 1 ? 'Member' : 'Members'}</span>
                      </div>
                      <button className="ml-4 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400" onClick={() => {
                        setSelectedGroup(group);
                        setSubgroups([group.members]);
                        setSelectedSubgroupIdx(0);
                      }}>Manage</button>
                    </div>

                    {/* Members List */}
                    <div className="bg-white rounded-lg p-4 border border-slate-100">
                      <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        Group Members
                      </h4>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {group.members.map((member, idx) => (
                          <div key={member.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                              {member.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-900 truncate">{member.name}</p>
                              <p className="text-xs text-slate-500 truncate">{member.email}</p>
                            </div>
                            <span className="text-xs text-slate-400 font-medium">#{idx + 1}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            // Subgroup management UI
            <div>
              <button className="mb-4 px-3 py-1 bg-slate-100 text-slate-700 rounded hover:bg-slate-200 text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-400" onClick={() => setSelectedGroup(null)}>&larr; Back to Groups</button>
              <h3 className="font-bold text-lg text-slate-900 mb-2">{getServiceNameFromPlanType(selectedGroup.planType)} Subgroups</h3>
              <div className="flex gap-2 mb-4 items-center">
                <span className="text-xs text-slate-500">Split members into groups of</span>
                {[2, 3, 4, 5, 6].map(size => (
                  <button key={size} className={`px-2 py-1 rounded border text-xs ${subgroups[0]?.length === size ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'} border-slate-200`} onClick={() => {
                    setSubgroups(splitGroup(selectedGroup.members, size));
                    setSelectedSubgroupIdx(0);
                  }}>{size}</button>
                ))}
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
                {subgroups.map((sg, idx) => (
                  <button key={idx} className={`px-3 py-2 rounded border text-xs ${selectedSubgroupIdx === idx ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'} border-slate-200`} onClick={() => setSelectedSubgroupIdx(idx)}>
                    Subgroup {idx + 1} ({sg.length} people)
                  </button>
                ))}
              </div>
              <div className="bg-white rounded-lg p-4 border border-slate-100 mb-4">
                <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Subgroup Members
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {subgroups[selectedSubgroupIdx]?.map((member, idx) => (
                    <div key={member.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                        {member.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{member.name}</p>
                        <p className="text-xs text-slate-500 truncate">{member.email}</p>
                      </div>
                      <span className="text-xs text-slate-400 font-medium">#{idx + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 flex items-center justify-center gap-2" onClick={async () => await sendSubgroupEmails(subgroups[selectedSubgroupIdx], selectedGroup)}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12H8m8 0a4 4 0 11-8 0 4 4 0 018 0zm-4 4v1m0-5h1M4 12h16" />
                </svg>
                Send Email to Subgroup
              </button>
            </div>
          )}
        </div>

        {/* Fixed Footer */}
        <div className="p-6 border-t border-slate-200 bg-slate-50 rounded-b-2xl">
          <button 
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 flex items-center justify-center gap-2"
            onClick={() => showToast('Group creation feature coming soon!', 'success')}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create New Group
          </button>
        </div>
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
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors" onClick={() => setShowGroupModal(true)}>
          Manage Groups
        </button>
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
      {showGroupModal && (
        <GroupModal
          onClose={() => setShowGroupModal(false)}
          selectedGroup={selectedGroup}
          setSelectedGroup={setSelectedGroup}
          subgroups={subgroups}
          setSubgroups={setSubgroups}
          selectedSubgroupIdx={selectedSubgroupIdx}
          setSelectedSubgroupIdx={setSelectedSubgroupIdx}
        />
      )}
      {/* Floating action button for group creation (UI only) */}
      <button className="fixed bottom-8 right-8 z-40 bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg text-3xl hover:bg-blue-700" onClick={() => setShowGroupModal(true)} title="Manage Groups">
        +
      </button>
    </div>
  );
}

export default AdminPortal; 