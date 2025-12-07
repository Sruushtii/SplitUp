// User orders page with status grouping
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, collection, query, where, getDocs } from '../services/firebase';
import { subscriptions } from './Plans';

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

  // Minimal modal for paying rest amount
  const PayRestModal = ({ order, open, onClose, onPaid }) => {
    const [paymentMethod, setPaymentMethod] = useState('UPI');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    if (!open) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-2 sm:px-0">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full relative animate-fadeInUp p-8">
          <button className="absolute -top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-white border border-slate-200 shadow text-slate-700 hover:bg-slate-100 hover:text-blue-600 focus:outline-none" onClick={onClose} aria-label="Close">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10 8.586l4.95-4.95a1 1 0 111.414 1.414L11.414 10l4.95 4.95a1 1 0 01-1.414 1.414L10 11.414l-4.95 4.95a1 1 0 01-1.414-1.414L8.586 10l-4.95-4.95A1 1 0 115.05 3.636L10 8.586z" clipRule="evenodd" /></svg>
          </button>
          <h2 className="text-xl font-bold mb-2">Pay Remaining Amount</h2>
          <div className="mb-4 text-slate-700">Amount remaining to pay: <span className="font-bold text-red-600">₹{order.amountRemaining}</span></div>
          <div className="mb-4">
            <label className="block mb-1 text-slate-600 text-sm font-medium">Select payment method</label>
            <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className="w-full px-3 py-2 border rounded">
              <option value="UPI">UPI</option>
              <option value="Card">Credit/Debit Card</option>
              <option value="Netbanking">Netbanking</option>
            </select>
          </div>
          {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
          <button
            disabled={loading}
            className="w-full py-3 rounded-lg bg-blue-600 text-white font-bold text-lg shadow hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={async () => {
              setLoading(true);
              setError('');
              try {
                // Update payment in Firestore
                const { updateDoc, doc, db } = await import('../services/firebase');
                await updateDoc(doc(db, 'payments', order.id), {
                  amountPaid: (order.amountPaid || 0) + (order.amountRemaining || 0),
                  amountRemaining: 0,
                  // Do NOT set status to 'paid', keep as 'pending' until admin sends credentials
                  status: 'pending',
                  paymentMethod,
                  updatedAt: new Date()
                });
                onPaid();
              } catch (e) {
                setError('Payment failed. Try again.');
              } finally {
                setLoading(false);
              }
            }}
          >
            {loading ? 'Processing...' : `Pay ₹${order.amountRemaining}`}
          </button>
        </div>
      </div>
    );
  };

  // Modal for showing order details
  const OrderDetailsModal = ({ order, onClose, onPayRest }) => {
    if (!order) return null;

    // Calculate expiry date
    function getPlanDuration(order) {
      const service = subscriptions.find(
        s => s.name.toLowerCase() === (order.subscriptionType || '').toLowerCase()
      );
      if (!service) return 30;
      const plan = service.plans.find(
        p => p.name.toLowerCase() === (order.planType || '').toLowerCase() || p.id === order.planType
      );
      if (!plan) return 30;
      const name = (plan.name || '').toLowerCase();
      if (name.includes('year') || name.includes('annual')) return 365;
      if (name.includes('3 month')) return 90;
      if (name.includes('monthly') || name.includes('month')) return 30;
      const durDetail = (plan.details || []).find(d => /month|year/i.test(d.value));
      if (durDetail) {
        if (/year/i.test(durDetail.value)) return 365;
        if (/3 month/i.test(durDetail.value)) return 90;
        if (/month/i.test(durDetail.value)) return 30;
      }
      return 30;
    }

    let expiry;
    const duration = getPlanDuration(order);
    if (order.subscriptionEnds) {
      expiry = order.subscriptionEnds.toDate ? order.subscriptionEnds.toDate() : new Date(order.subscriptionEnds);
    } else if (order.createdAt) {
      const base = order.createdAt.toDate ? order.createdAt.toDate() : new Date(order.createdAt);
      expiry = new Date(base.getTime() + duration * 24 * 60 * 60 * 1000);
    } else {
      expiry = null;
    }

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative animate-fadeInUp flex flex-col" style={{ maxHeight: 'calc(100vh - 2rem)' }}>
          {/* Close Button */}
          <button
            className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 focus:outline-none z-10"
            onClick={onClose}
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M10 8.586l4.95-4.95a1 1 0 111.414 1.414L11.414 10l4.95 4.95a1 1 0 01-1.414 1.414L10 11.414l-4.95 4.95a1 1 0 01-1.414-1.414L8.586 10l-4.95-4.95A1 1 0 115.05 3.636L10 8.586z" clipRule="evenodd" />
            </svg>
          </button>

          {/* Header - Fixed */}
          <div className="rounded-t-2xl p-4 bg-slate-50 flex flex-col gap-1 items-center border-b border-slate-200 flex-shrink-0">
            {getLogo(order) && (
              <img src={getLogo(order)} alt={order.subscriptionType + ' logo'} className="w-12 h-12 object-contain rounded-lg shadow mb-1" />
            )}
            <h3 className="text-lg font-bold text-slate-900">{order.subscriptionType}</h3>
            <div className="text-sm font-medium text-slate-600">{order.planType}</div>
            <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-xs font-semibold uppercase tracking-wider">{order.status}</span>
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto flex-1 px-4 py-3">
            {/* Order Details */}
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Name</span>
                <span className="font-medium text-slate-800 text-right">{order.name}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Email</span>
                <span className="font-medium text-slate-800 text-right text-xs break-all">{order.email}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Phone</span>
                <span className="font-medium text-slate-800">{order.phone}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Number of People</span>
                <span className="font-medium text-slate-800">{order.numberOfPeople}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Payment Method</span>
                <span className="font-medium text-slate-800">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Amount Paid</span>
                <span className="font-medium text-green-700">₹{order.amountPaid}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Amount Remaining</span>
                <span className="font-medium text-red-700">₹{order.amountRemaining}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Total Amount</span>
                <span className="font-medium text-slate-800">₹{order.totalAmount}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Expiry</span>
                <span className="font-medium text-slate-800">{expiry ? expiry.toLocaleDateString() : 'N/A'}</span>
              </div>
            </div>

            {/* Subscription Credentials Section */}
            {order.credentials && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  <h4 className="font-bold text-blue-900 text-sm">Subscription Credentials</h4>
                </div>
                <div className="space-y-2">
                  <div className="bg-white rounded p-2">
                    <div className="text-xs text-slate-500 mb-1">Username / Email</div>
                    <div className="font-mono text-xs text-slate-900 break-all">{order.credentials.username}</div>
                  </div>
                  <div className="bg-white rounded p-2">
                    <div className="text-xs text-slate-500 mb-1">Password</div>
                    <div className="font-mono text-xs text-slate-900 break-all">{order.credentials.password}</div>
                  </div>
                  {order.credentials.additionalInfo && (
                    <div className="bg-white rounded p-2">
                      <div className="text-xs text-slate-500 mb-1">Additional Info</div>
                      <div className="text-xs text-slate-900 whitespace-pre-wrap">{order.credentials.additionalInfo}</div>
                    </div>
                  )}
                  {order.credentials.sentAt && (
                    <div className="text-xs text-slate-500 text-center mt-1">
                      Sent on {order.credentials.sentAt.toDate ? order.credentials.sentAt.toDate().toLocaleString() : new Date(order.credentials.sentAt).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer - Fixed */}
          {order.amountRemaining > 0 && (order.status === 'pending' || order.status === 'partial') && (
            <div className="p-4 border-t border-slate-200 flex-shrink-0">
              <button
                className="w-full py-3 rounded-lg bg-blue-600 text-white font-bold text-base shadow hover:bg-blue-700 transition-colors"
                onClick={onPayRest}
              >
                Pay Rest Amount (₹{order.amountRemaining})
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };


  const [showPayRest, setShowPayRest] = useState(false);
  const [payRestOrder, setPayRestOrder] = useState(null);

  // Helper to refresh orders after payment
  const refreshOrders = async () => {
    if (!user?.email) return;
    setLoading(true);
    try {
      const q = query(collection(db, 'payments'), where('email', '==', user.email));
      const querySnapshot = await getDocs(q);
      const fetchedOrders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(fetchedOrders);
    } catch (err) {
      setOrders([]);
    } finally {
      setLoading(false);
    }
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
                        <div className="text-xs text-slate-500 mb-1">
                          Expiry: {(() => {
                            // Helper to get plan duration
                            function getPlanDuration(order) {
                              // Try to match by subscriptionType and planType
                              const service = subscriptions.find(
                                s => s.name.toLowerCase() === (order.subscriptionType || '').toLowerCase()
                              );
                              if (!service) return 30; // default 30 days
                              // Try to match plan by planType or name
                              const plan = service.plans.find(
                                p => p.name.toLowerCase() === (order.planType || '').toLowerCase() || p.id === order.planType
                              );
                              if (!plan) return 30;
                              // Infer duration from plan name/details
                              const name = (plan.name || '').toLowerCase();
                              if (name.includes('year') || name.includes('annual')) return 365;
                              if (name.includes('3 month')) return 90;
                              if (name.includes('monthly') || name.includes('month')) return 30;
                              // Fallback: try details
                              const durDetail = (plan.details || []).find(d => /month|year/i.test(d.value));
                              if (durDetail) {
                                if (/year/i.test(durDetail.value)) return 365;
                                if (/3 month/i.test(durDetail.value)) return 90;
                                if (/month/i.test(durDetail.value)) return 30;
                              }
                              return 30; // fallback
                            }
                            let expiry;
                            const duration = getPlanDuration(order);
                            if (order.subscriptionEnds) {
                              expiry = order.subscriptionEnds.toDate ? order.subscriptionEnds.toDate() : new Date(order.subscriptionEnds);
                            } else if (order.createdAt) {
                              const base = order.createdAt.toDate ? order.createdAt.toDate() : new Date(order.createdAt);
                              expiry = new Date(base.getTime() + duration * 24 * 60 * 60 * 1000);
                            } else {
                              expiry = null;
                            }
                            return expiry ? expiry.toLocaleDateString() : 'N/A';
                          })()}
                        </div>
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
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onPayRest={() => {
            setPayRestOrder(selectedOrder);
            setShowPayRest(true);
          }}
        />
        <PayRestModal
          order={payRestOrder}
          open={showPayRest}
          onClose={() => setShowPayRest(false)}
          onPaid={async () => {
            setShowPayRest(false);
            setSelectedOrder(null);
            await refreshOrders();
          }}
        />
      </div>
    </main>
  );
}

export default Orders; 