// Subscription plans page with booking flow
import React, { useState, useEffect, useRef } from 'react';
import UserDetailsForm from './UserDetailsForm';
import { db, collection, addDoc, serverTimestamp } from '../services/firebase';
import { useNavigate } from 'react-router-dom';

// Available subscriptions with latest pricing (2025)
// Each service can have multiple plan options
// Platform fee: Small convenience fee to keep prices attractive
const PLATFORM_FEE = 5; // Only ₹5 total convenience fee
const GST_RATE = 0; // No GST - keeping prices minimal for users

const subscriptions = [
  {
    name: 'Netflix',
    logo: '/netflix.png',
    status: 'active',
    brandColor: 'bg-slate-50',
    priceCheckUrl: 'https://www.netflix.com/in/plans',
    plans: [
      {
        id: 'netflix-standard',
        name: 'Standard',
        totalPrice: 499,
        splitBetween: 2,
        price: 250,
        details: [
          { label: 'Total subscription price', value: '₹499/month' },
          { label: 'Split between', value: '2 people' },
          { label: 'Your share', value: '₹250/month' },
          { label: 'Video quality', value: '1080p (Full HD)' },
          { label: 'Supported devices', value: 'TV, computer, mobile, tablet' },
          { label: 'Watch on 2 devices at a time', value: 'Yes' },
          { label: 'Download on 2 devices', value: 'Yes' },
          { label: 'Ad-free', value: 'Yes' },
        ],
      },
      {
        id: 'netflix-premium',
        name: 'Premium',
        totalPrice: 649,
        splitBetween: 4,
        price: 162,
        details: [
          { label: 'Total subscription price', value: '₹649/month' },
          { label: 'Split between', value: '4 people' },
          { label: 'Your share', value: '₹162/month' },
          { label: 'Video quality', value: '4K (Ultra HD) + HDR' },
          { label: 'Netflix spatial audio', value: 'Included' },
          { label: 'Supported devices', value: 'TV, computer, mobile, tablet' },
          { label: 'Watch on 4 devices at a time', value: 'Yes' },
          { label: 'Download on 6 devices', value: 'Yes' },
          { label: 'Ad-free', value: 'Yes' },
        ],
      },
    ],
  },
  {
    name: 'Spotify',
    logo: '/spotify2.png',
    status: 'active',
    brandColor: 'bg-slate-50',
    priceCheckUrl: 'https://www.spotify.com/in-en/premium/',
    plans: [
      {
        id: 'spotify-duo',
        name: 'Duo',
        totalPrice: 149,
        splitBetween: 2,
        price: 75,
        details: [
          { label: 'Total subscription price', value: '₹149/month' },
          { label: 'Split between', value: '2 people' },
          { label: 'Your share', value: '₹75/month' },
          { label: 'Audio quality', value: 'High' },
          { label: 'Ad-free music', value: 'Yes' },
          { label: 'Offline listening', value: 'Yes' },
          { label: 'Accounts', value: '2 Premium accounts' },
          { label: 'Supported devices', value: 'Phone, tablet, computer' },
        ],
      },
      {
        id: 'spotify-family',
        name: 'Family',
        totalPrice: 229,
        splitBetween: 6,
        price: 38,
        details: [
          { label: 'Total subscription price', value: '₹229/month' },
          { label: 'Split between', value: '6 people' },
          { label: 'Your share', value: '₹38/month' },
          { label: 'Audio quality', value: 'High' },
          { label: 'Ad-free music', value: 'Yes' },
          { label: 'Offline listening', value: 'Yes' },
          { label: 'Accounts', value: 'Up to 6 Premium accounts' },
          { label: 'Supported devices', value: 'Phone, tablet, computer' },
        ],
      },
    ],
  },
  {
    name: 'Prime Video',
    logo: '/primevideo2.png',
    status: 'active',
    brandColor: 'bg-slate-50',
    priceCheckUrl: 'https://www.primevideo.com/offers',
    plans: [
      {
        id: 'prime-monthly',
        name: 'Monthly',
        totalPrice: 299,
        splitBetween: 3,
        price: 100,
        fee: 49,
        details: [
          { label: 'Total subscription price', value: '₹299/month' },
          { label: 'Split between', value: '3 people' },
          { label: 'Your share', value: '₹100/month' },
          { label: 'Video quality', value: 'HD/4K UHD' },
          { label: 'Supported devices', value: 'TV, computer, mobile, tablet' },
          { label: 'Simultaneous streams', value: '3 devices' },
          { label: 'Download and watch offline', value: 'Yes' },
        ],
      },
      {
        id: 'prime-annual',
        name: 'Annual',
        totalPrice: 1499,
        splitBetween: 3,
        price: 500,
        fee: 49,
        details: [
          { label: 'Total subscription price', value: '₹1,499/year' },
          { label: 'Monthly equivalent', value: '₹125/month' },
          { label: 'Split between', value: '3 people' },
          { label: 'Your share', value: '₹500/year (₹42/month)' },
          { label: 'Video quality', value: 'HD/4K UHD' },
          { label: 'Supported devices', value: 'TV, computer, mobile, tablet' },
          { label: 'Simultaneous streams', value: '3 devices' },
          { label: 'Download and watch offline', value: 'Yes' },
        ],
      },
    ],
  },
  {
    name: 'JioHotstar',
    logo: '/hotstar.webp',
    status: 'active',
    brandColor: 'bg-slate-50',
    priceCheckUrl: 'https://www.hotstar.com/in/subscribe',
    plans: [
      {
        id: 'hotstar-super',
        name: 'Super (3 Months)',
        totalPrice: 299,
        splitBetween: 2,
        price: 150,
        fee: 49,
        details: [
          { label: 'Total subscription price', value: '₹299/3 months' },
          { label: 'Split between', value: '2 people' },
          { label: 'Your share', value: '₹150/3 months' },
          { label: 'Video quality', value: 'Full HD' },
          { label: 'Supported devices', value: 'Mobile, Web, Living Room' },
          { label: 'Watch on 2 devices at a time', value: 'Yes' },
          { label: 'Ad-supported', value: 'Yes' },
        ],
      },
      {
        id: 'hotstar-premium-monthly',
        name: 'Premium (Monthly)',
        totalPrice: 299,
        splitBetween: 4,
        price: 75,
        fee: 49,
        details: [
          { label: 'Total subscription price', value: '₹299/month' },
          { label: 'Split between', value: '4 people' },
          { label: 'Your share', value: '₹75/month' },
          { label: 'Video quality', value: '4K (Ultra HD)' },
          { label: 'Supported devices', value: 'Mobile, Web, Living Room' },
          { label: 'Watch on 4 devices at a time', value: 'Yes' },
          { label: 'Ad-free (except LIVE)', value: 'Yes' },
          { label: 'Download and watch offline', value: 'Yes' },
        ],
      },
      {
        id: 'hotstar-premium-annual',
        name: 'Premium (Annual)',
        totalPrice: 1499,
        splitBetween: 4,
        price: 375,
        fee: 49,
        details: [
          { label: 'Total subscription price', value: '₹1,499/year' },
          { label: 'Monthly equivalent', value: '₹125/month' },
          { label: 'Split between', value: '4 people' },
          { label: 'Your share', value: '₹375/year (₹31/month)' },
          { label: 'Video quality', value: '4K (Ultra HD)' },
          { label: 'Supported devices', value: 'Mobile, Web, Living Room' },
          { label: 'Watch on 4 devices at a time', value: 'Yes' },
          { label: 'Ad-free (except LIVE)', value: 'Yes' },
          { label: 'Download and watch offline', value: 'Yes' },
        ],
      },
    ],
  },
  {
    name: 'YouTube Premium',
    logo: '/youtube.png',
    status: 'active',
    brandColor: 'bg-red-50',
    priceCheckUrl: 'https://www.youtube.com/premium',
    plans: [
      {
        id: 'youtube-two-person',
        name: 'Two-person',
        totalPrice: 219,
        splitBetween: 2,
        price: 110,
        details: [
          { label: 'Total subscription price', value: '₹219/month' },
          { label: 'Split between', value: '2 people' },
          { label: 'Your share', value: '₹110/month' },
          { label: 'Ad-free videos', value: 'Yes' },
          { label: 'Offline downloads', value: 'Yes' },
          { label: 'YouTube Music Premium', value: 'Included' },
          { label: 'Background play', value: 'Yes' },
          { label: 'Supported devices', value: 'Phone, tablet, computer, TV' },
          { label: 'Accounts', value: '2 accounts' },
        ],
      },
      {
        id: 'youtube-family',
        name: 'Family',
        totalPrice: 299,
        splitBetween: 5,
        price: 60,
        details: [
          { label: 'Total subscription price', value: '₹299/month' },
          { label: 'Split between', value: '5 people' },
          { label: 'Your share', value: '₹60/month' },
          { label: 'Ad-free videos', value: 'Yes' },
          { label: 'Offline downloads', value: 'Yes' },
          { label: 'YouTube Music Premium', value: 'Included' },
          { label: 'Background play', value: 'Yes' },
          { label: 'Supported devices', value: 'Phone, tablet, computer, TV' },
          { label: 'Family members', value: 'Up to 5 (ages 13+)' },
        ],
      },
    ],
  },
  {
    name: 'Canva Pro',
    logo: '/canva.png',
    status: 'active',
    brandColor: 'bg-purple-50',
    priceCheckUrl: 'https://www.canva.com/pricing/',
    plans: [
      {
        id: 'canva-pro',
        name: 'Pro',
        totalPrice: 500,
        splitBetween: 5,
        price: 100,
        fee: 49,
        details: [
          { label: 'Total subscription price', value: '₹500/month' },
          { label: 'Split between', value: '5 people' },
          { label: 'Your share', value: '₹100/month' },
          { label: 'Premium templates', value: '100,000+' },
          { label: 'Background remover', value: 'Yes' },
          { label: 'Brand kit', value: 'Yes' },
          { label: 'Cloud storage', value: '1TB' },
          { label: 'Team collaboration', value: 'Yes' },
          { label: 'Magic AI tools', value: 'Included' },
        ],
      },
    ],
  },
  {
    name: 'Microsoft 365',
    logo: '/microsoft.png',
    status: 'active',
    brandColor: 'bg-blue-50',
    priceCheckUrl: 'https://www.microsoft.com/en-in/microsoft-365/buy/compare-all-microsoft-365-products',
    plans: [
      {
        id: 'microsoft-family',
        name: 'Family (Annual)',
        totalPrice: 8199,
        splitBetween: 6,
        price: 1367,
        fee: 49,
        details: [
          { label: 'Total subscription price', value: '₹8,199/year' },
          { label: 'Monthly equivalent', value: '₹684/month' },
          { label: 'Split between', value: '6 people' },
          { label: 'Your share', value: '₹1,367/year (₹114/month)' },
          { label: 'Apps included', value: 'Word, Excel, PowerPoint, Outlook, OneNote' },
          { label: 'OneDrive storage', value: '1TB per person (up to 6TB)' },
          { label: 'Supported devices', value: 'PC, Mac, iPhone, iPad, Android' },
          { label: 'Microsoft Copilot AI', value: 'Included' },
          { label: 'Microsoft Defender security', value: 'Included' },
        ],
      },
    ],
  },
];

// Function to render the appropriate logo
const renderLogo = (logoType, name) => {
  if (logoType && logoType.startsWith('/')) {
    return <img src={logoType} alt={`${name} logo`} className="w-16 h-16 object-contain drop-shadow-lg" />;
  }
  return <LogoPlaceholder name={name} />;
};

const LogoPlaceholder = ({ name }) => (
    <div className="w-full h-full flex items-center justify-center rounded-lg bg-slate-200">
        <span className="font-bold text-slate-500 text-lg text-center p-2">{name}</span>
    </div>
);

function Plans({ user, setUser }) {
  // State for which plan is selected, modals, user details, payment, etc.
  const [selected, setSelected] = useState(null);
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(0); // Track which plan variant is selected
  const [showUserForm, setShowUserForm] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const plansContainerRef = useRef(null);
  const navigate = useNavigate();

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (selected !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selected]);

  // If user is not logged in, redirect to login when booking
  const handleBookNow = (serviceIdx, planIdx) => {
    if (!user) {
      // Save intended plan index in sessionStorage for redirect after login
      sessionStorage.setItem('splitup_redirect_plan', serviceIdx);
      navigate('/login');
      return;
    }
    setSelected(serviceIdx);
    setSelectedPlanIndex(planIdx);
    setShowUserForm(true);
  };

  // On mount, check if redirected from login and open the intended plan
  useEffect(() => {
    if (user) {
      const planIdx = sessionStorage.getItem('splitup_redirect_plan');
      if (planIdx !== null) {
        setSelected(Number(planIdx));
        setShowUserForm(true);
        sessionStorage.removeItem('splitup_redirect_plan');
      }
    }
  }, [user]);

  // Modal for payment with detailed breakdown
  const PaymentModal = ({ open, onClose, plan, bookingAmount }) => {
    if (!open) return null;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    // Calculate all fees - No GST, only ₹5 convenience fee on final payment
    const splitAmount = plan.price;
    const totalBookingPayment = bookingAmount; // No fees on booking
    
    const remainingAmount = splitAmount - bookingAmount;
    const totalRemainingPayment = remainingAmount + PLATFORM_FEE; // Only ₹5 fee

    const handleCompletePayment = async () => {
      if (!paymentMethod) {
        setError('Please select a payment method');
        return;
      }
      setLoading(true);
      setError('');
      try {
        await addDoc(collection(db, 'payments'), {
          name: userDetails?.name,
          email: userDetails?.email,
          phone: userDetails?.phone,
          subscriptionType: subscriptions[selected].name,
          planType: plan.name,
          numberOfPeople: plan.details?.find(d => d.label.toLowerCase().includes('split between'))?.value || '',
          amountPaid: totalBookingPayment,
          amountRemaining: totalRemainingPayment,
          totalAmount: totalBookingPayment + totalRemainingPayment,
          subscriptionShare: splitAmount,
          convenienceFee: PLATFORM_FEE,
          paymentMethod,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          status: 'pending',
        });
        setSuccessMsg('Payment Successful!');
        setShowPayment(false);
        setTimeout(() => {
          setSuccessMsg('');
          setSelected(null);
        }, 2000);
      } catch (e) {
        setError('Failed to save payment. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-2 sm:px-0">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full relative animate-fadeInUp max-h-[90vh] overflow-y-auto">
          <button
            className="absolute -top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-white border border-slate-200 shadow text-slate-700 hover:bg-slate-100 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all z-10"
            onClick={onClose}
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M10 8.586l4.95-4.95a1 1 0 111.414 1.414L11.414 10l4.95 4.95a1 1 0 01-1.414 1.414L10 11.414l-4.95 4.95a1 1 0 01-1.414-1.414L8.586 10l-4.95-4.95A1 1 0 115.05 3.636L10 8.586z" clipRule="evenodd" />
            </svg>
          </button>
          <div className="px-6 py-8">
            <h3 className="text-xl font-bold text-slate-900 mb-1">Complete Payment</h3>
            <p className="text-sm text-slate-600 mb-6">{subscriptions[selected].name} - {plan.name}</p>
            
            {/* Payment Breakdown */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 mb-6">
              <h4 className="font-semibold text-slate-900 mb-3 text-sm">Payment Breakdown</h4>
              
              {/* Booking Payment */}
              <div className="mb-3 pb-3 border-b border-blue-200">
                <p className="text-xs font-medium text-slate-600 mb-2">Booking Payment (Now)</p>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Booking amount (10%)</span>
                    <span className="text-slate-800">₹{bookingAmount}</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm pt-1 border-t border-blue-200">
                    <span className="text-slate-900">Total now</span>
                    <span className="text-blue-600">₹{totalBookingPayment}</span>
                  </div>
                  <p className="text-xs text-green-600 mt-1">✓ No fees on booking!</p>
                </div>
              </div>
              
              {/* Remaining Payment */}
              <div>
                <p className="text-xs font-medium text-slate-600 mb-2">Final Payment (Later)</p>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Remaining amount</span>
                    <span className="text-slate-800">₹{remainingAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Convenience fee</span>
                    <span className="text-slate-800">₹{PLATFORM_FEE}</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm pt-1 border-t border-blue-200">
                    <span className="text-slate-900">Total later</span>
                    <span className="text-slate-800">₹{totalRemainingPayment}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t-2 border-blue-300">
                <div className="flex justify-between font-bold text-base">
                  <span className="text-slate-900">Grand Total</span>
                  <span className="text-blue-600">₹{totalBookingPayment + totalRemainingPayment}</span>
                </div>
              </div>
            </div>
            
            <h4 className="font-semibold text-slate-900 mb-3">Select payment method</h4>
            <div className="flex flex-col gap-3 mb-6">
              <button onClick={() => setPaymentMethod('UPI')} className={`w-full py-3 rounded-lg border ${paymentMethod === 'UPI' ? 'border-blue-600 bg-blue-50' : 'border-slate-200'} text-slate-700 font-medium hover:bg-slate-50 transition`}>UPI</button>
              <button onClick={() => setPaymentMethod('Card')} className={`w-full py-3 rounded-lg border ${paymentMethod === 'Card' ? 'border-blue-600 bg-blue-50' : 'border-slate-200'} text-slate-700 font-medium hover:bg-slate-50 transition`}>Credit/Debit Card</button>
              <button onClick={() => setPaymentMethod('Netbanking')} className={`w-full py-3 rounded-lg border ${paymentMethod === 'Netbanking' ? 'border-blue-600 bg-blue-50' : 'border-slate-200'} text-slate-700 font-medium hover:bg-slate-50 transition`}>Netbanking</button>
            </div>
            {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
            <button onClick={handleCompletePayment} disabled={loading} className="w-full py-3 rounded-lg bg-blue-600 text-white font-bold text-lg shadow hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? 'Processing...' : `Pay ₹${totalBookingPayment}`}
            </button>
            <p className="text-xs text-center text-slate-500 mt-3">
              You'll pay ₹{totalRemainingPayment} later when the group is complete
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Modal for showing plan details and booking
  const PlanModal = ({ service, onClose, serviceIdx }) => {
    const [activePlanIdx, setActivePlanIdx] = useState(0);
    const currentPlan = service.plans[activePlanIdx];
    const splitAmount = currentPlan.price;
    const bookingAmount = Math.ceil(currentPlan.price * 0.10);
    
    // Calculate fees - No GST, only ₹5 convenience fee on final payment
    const totalBookingPayment = bookingAmount; // No fees on booking
    
    const remainingAmount = splitAmount - bookingAmount;
    const totalRemainingPayment = remainingAmount + PLATFORM_FEE; // Only ₹5 fee added
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-2 sm:px-0">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full relative animate-fadeInUp max-h-[90vh] overflow-y-auto">
          <div className={`rounded-t-2xl p-6 pb-4 ${service.brandColor} flex flex-col gap-3 relative`}>
            <button
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm text-slate-700 hover:bg-white hover:text-slate-900 transition-all z-10"
              onClick={onClose}
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{service.name}</h3>
              </div>
              <div className="w-10 h-10">
                {renderLogo(service.logo, service.name)}
              </div>
            </div>
            
            {/* Plan selector - only show if multiple plans */}
            {service.plans.length > 1 && (
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-slate-600">Choose Plan</label>
                <div className="flex gap-2 flex-wrap">
                  {service.plans.map((plan, idx) => (
                    <button
                      key={plan.id}
                      onClick={() => setActivePlanIdx(idx)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        activePlanIdx === idx
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-white text-slate-700 border border-slate-200 hover:border-blue-300'
                      }`}
                    >
                      {plan.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="px-6 py-4 space-y-4">
            <ul className="divide-y divide-slate-200">
              {currentPlan.details.map((item, idx) => (
                <li key={idx} className="py-2 flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <span className="text-slate-500 text-sm">{item.label}</span>
                  <span className="font-medium text-slate-800 text-sm mt-1 sm:mt-0">{item.value}</span>
                </li>
              ))}
            </ul>
            
            {/* Simple pricing summary */}
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-600 text-sm">Your share</span>
                <span className="font-bold text-slate-900 text-lg">₹{splitAmount}</span>
              </div>
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-slate-500">Booking amount (10%)</span>
                <span className="text-slate-700">₹{bookingAmount}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-500 mb-2">
                <span>Convenience fee (on final payment)</span>
                <span>₹{PLATFORM_FEE}</span>
              </div>
              <div className="pt-2 mt-2 border-t border-slate-200">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 text-sm">Pay now</span>
                  <span className="font-bold text-blue-600 text-xl">₹{totalBookingPayment}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-slate-500 text-xs">Total (including ₹{PLATFORM_FEE} fee)</span>
                  <span className="text-slate-700 text-sm font-semibold">₹{splitAmount + PLATFORM_FEE}</span>
                </div>
              </div>
            </div>
            
            <button
              className="w-full py-3 rounded-lg bg-blue-600 text-white font-bold text-lg shadow hover:bg-blue-700 transition-colors"
              onClick={() => handleBookNow(serviceIdx, activePlanIdx)}
            >
              Continue to Book
            </button>
            <p className="text-xs text-center text-slate-500">
              Complete payment breakdown on next step
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <main className="bg-white" onClick={(e) => {
      if (e.target === e.currentTarget) {
        setSelected(null);
        setShowUserForm(false);
        setShowPayment(false);
      }
    }}>
      <section className="pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900">Split your subscriptions with friends</h1>
            <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
              Choose a subscription you want to share. We handle the group, the payments, and the security. You just save.
            </p>
            <div className="mt-6 flex items-center justify-center gap-2 text-slate-500">
              <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008h-.008v-.008z" />
              </svg>
              <span className="text-sm font-medium">A secure platform proudly incubated at <span className='text-blue-600'>VIT Pune.</span></span>
            </div>
          </div>
          {/* List of all available subscriptions */}
          <div ref={plansContainerRef} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {subscriptions.map((service, index) => {
              if (service.status === 'active') {
                // Show the cheapest plan price for the card
                const cheapestPlan = service.plans.reduce((min, plan) => 
                  plan.price < min.price ? plan : min, service.plans[0]);
                
                return (
                  <button
                    key={`${service.name}-${index}`}
                    className={`text-left rounded-xl p-3 cursor-pointer transition-all duration-300 ease-in-out focus:outline-none hover:scale-105 hover:shadow-2xl bg-white border-2 ${selected === index ? 'ring-2 ring-blue-600 scale-105 shadow-2xl border-blue-200' : 'shadow-lg border-slate-100 hover:border-blue-100'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelected(index);
                    }}
                  >
                    <div className={`aspect-square rounded-xl mb-4 flex items-center justify-center p-6 ${service.brandColor} border border-slate-100`}>
                      {renderLogo(service.logo, service.name)}
                    </div>
                    <div className="px-1 relative">
                      <p className="font-semibold text-slate-800 text-sm">{service.name}</p>
                      {service.plans.length > 1 && (
                        <p className="text-xs text-slate-500 font-normal mb-1">{service.plans.length} plans</p>
                      )}
                      <div className="flex items-center gap-1 mt-1">
                        <p className="text-sm text-slate-500">
                          <span className="text-xs">from </span>
                          <span className="font-bold text-slate-900 text-base">₹{cheapestPlan.price}</span>
                          <span className="text-xs">/person</span>
                        </p>
                      </div>
                    </div>
                  </button>
                )
              } else {
                return (
                  <div key={service.name} className="text-left rounded-xl p-2">
                    <div className="relative aspect-square rounded-lg mb-4 flex items-center justify-center p-4 bg-slate-100 border-2 border-dashed border-slate-300">
                        <LogoPlaceholder name={service.name} />
                        <div className="absolute inset-0 flex items-center justify-center bg-white/50">
                            <span className="bg-slate-700 text-white text-xs font-semibold px-2 py-1 rounded-full">
                                Coming Soon
                            </span>
                        </div>
                    </div>
                    <div className="px-1">
                      <p className="font-semibold text-slate-500">{service.name}</p>
                      <p className="text-sm text-slate-400">Not yet available</p>
                    </div>
                  </div>
                )
              }
            })}
          </div>
        </div>
        {/* Modals for plan details, user form, payment, and success message */}
        {selected !== null && !showUserForm && !showPayment && (
          <PlanModal service={subscriptions[selected]} onClose={() => setSelected(null)} serviceIdx={selected} />
        )}
        {selected !== null && showUserForm && !showPayment && (
          <UserDetailsForm
            open={true}
            plan={subscriptions[selected].plans[selectedPlanIndex]}
            user={user}
            onClose={() => { setShowUserForm(false); setSelected(null); }}
            onPay={(details) => { setUserDetails(details); setShowUserForm(false); setShowPayment(true); }}
          />
        )}
        {selected !== null && showPayment && (
          <PaymentModal
            open={true}
            plan={subscriptions[selected].plans[selectedPlanIndex]}
            bookingAmount={Math.ceil(subscriptions[selected].plans[selectedPlanIndex].price * 0.10)}
            onClose={() => { setShowPayment(false); setSelected(null); }}
          />
        )}
        {successMsg && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl px-8 py-10 shadow text-center animate-fadeInUp flex flex-col items-center gap-4">
              <svg className="w-16 h-16 text-green-500 mx-auto animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <div className="text-green-600 font-bold text-2xl">Payment Successful!</div>
              <div className="text-slate-700 text-base">Thank you for your payment. You will be added to the group soon.</div>
              <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors" onClick={() => setSuccessMsg('')}>Go to Home</button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

export default Plans; 