// User orders page with status grouping
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, collection, query, where, getDocs } from '../services/firebase';

// Order status sections
const statusSections = [
  { key: 'active', label: 'Active' },
  { key: 'pending', label: 'Pending' },
  { key: 'completed', label: 'Completed' },
];

function Orders({ user }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Fetch user's orders on mount or when user changes
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.email) {
        console.log('No user email found, clearing orders');
        setOrders([]);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      console.log('Fetching orders for user:', user.email);
      
      try {
        const q = query(collection(db, 'payments'), where('email', '==', user.email));
        const querySnapshot = await getDocs(q);
        const fetchedOrders = querySnapshot.docs.map(doc => {
          const data = doc.data();
          console.log('Order data:', data);
          return { id: doc.id, ...data };
        });
        console.log('Fetched orders:', fetchedOrders);
        setOrders(fetchedOrders);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [user]);

  // Helper to get logo for each order
  const getLogo = (order) => {
    if (order.logo) return order.logo;
    if (order.subscriptionType) {
      const name = order.subscriptionType.toLowerCase().replace(/\s/g, '');
      // Map known services to their logo files
      const logoMap = {
        'netflix': '/netflix.png',
        'spotify': '/spotify2.png',
        'primevideo': '/primevideo2.png',
        'jiohotstar': '/hotstar.webp',
        'hotstar': '/hotstar.webp',
        'youtubepremium': '/youtube.png',
        'youtube': '/youtube.png',
        'canvapro': '/canva.png',
        'canva': '/canva.png',
        'microsoft365': '/microsoft.png',
        'microsoft': '/microsoft.png',
      };
      return logoMap[name] || `/${name}.png`;
    }
    return null;
  };

  // Modal for showing order details
  const OrderDetailsModal = ({ order, onClose }) => {
    if (!order) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-2 sm:px-0">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full relative animate-fadeInUp">
          <button
            className="absolute -top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-white border border-slate-200 shadow text-slate-700 hover:bg-slate-100 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all z-10"
            onClick={onClose}
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M10 8.586l4.95-4.95a1 1 0 111.414 1.414L11.414 10l4.95 4.95a1 1 0 01-1.414 1.414L10 11.414l-4.95 4.95a1 1 0 01-1.414-1.414L8.586 10l-4.95-4.95A1 1 0 115.05 3.636L10 8.586z" clipRule="evenodd" />
            </svg>
          </button>
          <div className="rounded-t-2xl p-6 pb-4 bg-slate-50 flex flex-col gap-1 relative items-center">
            {getLogo(order) && (
              <img src={getLogo(order)} alt={order.subscriptionType + ' logo'} className="w-14 h-14 object-contain rounded-lg shadow mb-2" />
            )}
            <h3 className="text-xl font-bold text-slate-900 mb-1">{order.subscriptionType}</h3>
            <div className="text-base font-medium text-slate-700 mb-2">{order.planType}</div>
            <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-xs font-semibold mb-2 uppercase tracking-wider">{order.status}</span>
          </div>
          <div className="px-6 py-4 space-y-3">
            <ul className="divide-y divide-slate-200">
              <li className="py-2 flex justify-between"><span className="text-slate-500">Name</span><span className="font-medium text-slate-800">{order.name}</span></li>
              <li className="py-2 flex justify-between"><span className="text-slate-500">Email</span><span className="font-medium text-slate-800">{order.email}</span></li>
              <li className="py-2 flex justify-between"><span className="text-slate-500">Phone</span><span className="font-medium text-slate-800">{order.phone}</span></li>
              <li className="py-2 flex justify-between"><span className="text-slate-500">Number of People</span><span className="font-medium text-slate-800">{order.numberOfPeople}</span></li>
              <li className="py-2 flex justify-between"><span className="text-slate-500">Payment Method</span><span className="font-medium text-slate-800">{order.paymentMethod}</span></li>
              <li className="py-2 flex justify-between"><span className="text-slate-500">Amount Paid</span><span className="font-medium text-green-700">₹{order.amountPaid}</span></li>
              <li className="py-2 flex justify-between"><span className="text-slate-500">Amount Remaining</span><span className="font-medium text-red-700">₹{order.amountRemaining}</span></li>
              <li className="py-2 flex justify-between"><span className="text-slate-500">Total Amount</span><span className="font-medium text-slate-800">₹{order.totalAmount}</span></li>
              {order.timestamp && <li className="py-2 flex justify-between"><span className="text-slate-500">Booked On</span><span className="font-medium text-slate-800">{order.timestamp.toDate ? order.timestamp.toDate().toLocaleString() : order.timestamp}</span></li>}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  return (
    <main className="bg-slate-50 min-h-screen py-20 px-2 sm:px-4 mt-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-10 tracking-tight">My Subscriptions</h1>
        {loading ? (
          <div className="text-center text-slate-400">Loading your orders...</div>
        ) : (
        <div className="space-y-12">
          {statusSections.map((section, idx) => (
            <div key={section.key}>
              <h2 className="text-base font-semibold text-blue-600 uppercase tracking-wider mb-6 pl-1">{section.label}</h2>
              <div className="flex flex-col gap-6">
                {orders.filter(o => o.status === section.key).length === 0 && (
                  <div className="text-slate-400 italic">No {section.label.toLowerCase()} subscriptions.</div>
                )}
                {orders.filter(o => o.status === section.key).map(order => (
                  <div key={order.id} className="flex flex-col sm:flex-row items-center sm:items-stretch bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition hover:shadow-md">
                    <div className="flex-1 p-5 flex flex-col justify-center min-w-0">
                        <div className="font-bold text-lg text-slate-900 mb-1 truncate">{order.planType || order.subscriptionType}</div>
                        <button onClick={() => setSelectedOrder(order)} className="mt-2 px-4 py-2 rounded-lg border border-blue-600 text-blue-600 font-semibold bg-white hover:bg-blue-50 transition w-max text-sm">View Details</button>
                    </div>
                    <div className="sm:w-48 w-full h-32 sm:h-auto flex items-center justify-center bg-slate-100 border-l border-slate-200">
                        {getLogo(order) ? (
                          <img src={getLogo(order)} alt={order.subscriptionType} className="max-h-16 w-auto object-contain" />
                      ) : (
                          <span className="text-slate-400 font-bold text-xl">{order.subscriptionType}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {idx < statusSections.length - 1 && (
                <div className="my-12 border-t border-slate-200" />
              )}
            </div>
          ))}
        </div>
        )}
        {/* Show order details modal if an order is selected */}
        <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      </div>
    </main>
  );
}

export default Orders; 