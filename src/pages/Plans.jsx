// Subscription plans page with booking flow
import React, { useState, useEffect, useRef } from 'react';
import UserDetailsForm from './UserDetailsForm';
import { db, collection, addDoc, serverTimestamp } from '../services/firebase';
import { useNavigate } from 'react-router-dom';

// Available subscriptions
const subscriptions = [
  {
    name: 'Netflix',
    logo: '/netflix.png',
    plan: '5-person plan',
    planType: 'Premium 4K + HDR',
    price: 139,
    fee: 49,
    status: 'active',
    brandColor: 'bg-slate-50',
    details: [
      { label: 'Monthly price', value: '₹649' },
      { label: 'Video and sound quality', value: 'Best' },
      { label: 'Resolution', value: '4K (Ultra HD) + HDR' },
      { label: 'Spatial audio (immersive sound)', value: 'Included' },
      { label: 'Supported devices', value: 'TV, computer, mobile phone, tablet' },
      { label: 'Devices your household can watch at the same time', value: '4' },
      { label: 'Download devices', value: '6' },
      { label: 'Split between', value: '5 people' },
    ],
  },
  {
    name: 'Spotify',
    logo: '/spotify2.png',
    plan: '6-person plan',
    planType: 'Premium Family',
    price: 34,
    fee: 49,
    status: 'active',
    brandColor: 'bg-slate-50',
    details: [
      { label: 'Monthly price', value: '₹199' },
      { label: 'Audio quality', value: 'High' },
      { label: 'Ad-free music', value: 'Yes' },
      { label: 'Offline listening', value: 'Yes' },
      { label: 'Supported devices', value: 'Phone, tablet, computer' },
      { label: 'Accounts included', value: '6' },
      { label: 'Split between', value: '6 people' },
    ],
  },
  {
    name: 'Prime Video',
    logo: '/primevideo2.png',
    plan: '4-person plan',
    planType: 'Prime Video',
    price: 89,
    fee: 49,
    status: 'active',
    brandColor: 'bg-slate-50',
    details: [
      { label: 'Monthly price', value: '₹299' },
      { label: 'Video quality', value: 'HD/UHD' },
      { label: 'Supported devices', value: 'TV, computer, mobile phone, tablet' },
      { label: 'Simultaneous streams', value: '3' },
      { label: 'Split between', value: '4 people' },
    ],
  },
  {
    name: 'Hotstar',
    logo: '/hotstar.webp',
    plan: '4-person plan',
    planType: 'Premium',
    price: 139,
    fee: 49,
    status: 'active',
    brandColor: 'bg-slate-50',
    details: [
      { label: 'Monthly price', value: '₹299' },
      { label: 'Video quality', value: '4K (Ultra HD)' },
      { label: 'Supported devices', value: 'TV, computer, mobile phone, tablet' },
      { label: 'Simultaneous streams', value: '4' },
      { label: 'Split between', value: '4 people' },
    ],
  },
  {
    name: 'YouTube Premium',
    logo: 'youtube-svg',
    plan: '6-person plan',
    planType: 'Premium Family',
    price: 39,
    fee: 49,
    status: 'active',
    brandColor: 'bg-red-50',
    details: [
      { label: 'Monthly price', value: '₹229' },
      { label: 'Ad-free videos', value: 'Yes' },
      { label: 'Offline downloads', value: 'Yes' },
      { label: 'YouTube Music included', value: 'Yes' },
      { label: 'Background play', value: 'Yes' },
      { label: 'Supported devices', value: 'Phone, tablet, computer, TV' },
      { label: 'Split between', value: '6 people' },
    ],
  },
  {
    name: 'Disney+',
    logo: 'disney-svg',
    plan: '4-person plan',
    planType: 'Premium',
    price: 199,
    fee: 49,
    status: 'active',
    brandColor: 'bg-blue-50',
    details: [
      { label: 'Monthly price', value: '₹799' },
      { label: 'Video quality', value: '4K Ultra HD' },
      { label: 'Simultaneous streams', value: '4' },
      { label: 'Supported devices', value: 'TV, computer, mobile phone, tablet' },
      { label: 'Content', value: 'Disney, Marvel, Star Wars, Pixar' },
      { label: 'Split between', value: '4 people' },
    ],
  },
  {
    name: 'Adobe Creative Cloud',
    logo: 'adobe-svg',
    plan: '3-person plan',
    planType: 'All Apps',
    price: 599,
    fee: 49,
    status: 'active',
    brandColor: 'bg-red-50',
    details: [
      { label: 'Monthly price', value: '₹1,799' },
      { label: 'Apps included', value: 'Photoshop, Illustrator, Premiere Pro, After Effects' },
      { label: 'Cloud storage', value: '100GB per user' },
      { label: 'Supported devices', value: 'Desktop and mobile' },
      { label: 'Updates', value: 'Latest versions included' },
      { label: 'Split between', value: '3 people' },
    ],
  },
  {
    name: 'Canva Pro',
    logo: 'canva-svg',
    plan: '5-person plan',
    planType: 'Pro Team',
    price: 99,
    fee: 49,
    status: 'active',
    brandColor: 'bg-purple-50',
    details: [
      { label: 'Monthly price', value: '₹499' },
      { label: 'Premium templates', value: '100,000+' },
      { label: 'Background remover', value: 'Yes' },
      { label: 'Brand kit', value: 'Yes' },
      { label: 'Cloud storage', value: '1TB' },
      { label: 'Team collaboration', value: 'Yes' },
      { label: 'Split between', value: '5 people' },
    ],
  },
  {
    name: 'Microsoft 365',
    logo: 'microsoft-svg',
    plan: '6-person plan',
    planType: 'Family',
    price: 149,
    fee: 49,
    status: 'active',
    brandColor: 'bg-blue-50',
    details: [
      { label: 'Monthly price', value: '₹899' },
      { label: 'Apps included', value: 'Word, Excel, PowerPoint, Outlook' },
      { label: 'OneDrive storage', value: '1TB per user' },
      { label: 'Supported devices', value: 'PC, Mac, tablet, phone' },
      { label: 'Premium features', value: 'Yes' },
      { label: 'Split between', value: '6 people' },
    ],
  },
];

// SVG Logo Components - Minimal and smaller
const YouTubeSVG = () => (
  <svg viewBox="0 0 40 40" className="w-8 h-8">
    <rect width="40" height="40" rx="6" fill="#FF0000"/>
    <path d="M15 12v16l12-8-12-8z" fill="white"/>
  </svg>
);

const DisneySVG = () => (
  <svg viewBox="0 0 40 40" className="w-8 h-8">
    <rect width="40" height="40" rx="6" fill="#113CCF"/>
    <circle cx="20" cy="20" r="12" fill="none" stroke="white" strokeWidth="2"/>
    <text x="20" y="26" textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">D+</text>
  </svg>
);

const AdobeSVG = () => (
  <svg viewBox="0 0 40 40" className="w-8 h-8">
    <rect width="40" height="40" rx="6" fill="#FF0000"/>
    <path d="M12 8L20 28L28 8H12z" fill="white"/>
  </svg>
);

const CanvaSVG = () => (
  <svg viewBox="0 0 40 40" className="w-8 h-8">
    <rect width="40" height="40" rx="6" fill="#00C4CC"/>
    <circle cx="20" cy="20" r="10" fill="white"/>
    <text x="20" y="26" textAnchor="middle" fontSize="12" fill="#00C4CC" fontWeight="bold">C</text>
  </svg>
);

const MicrosoftSVG = () => (
  <svg viewBox="0 0 40 40" className="w-8 h-8">
    <rect width="40" height="40" rx="6" fill="#0078D4"/>
    <rect x="12" y="12" width="8" height="8" fill="#F25022"/>
    <rect x="22" y="12" width="8" height="8" fill="#7FBA00"/>
    <rect x="12" y="22" width="8" height="8" fill="#00A4EF"/>
    <rect x="22" y="22" width="8" height="8" fill="#FFB900"/>
  </svg>
);

// Function to render the appropriate logo
const renderLogo = (logoType, name) => {
  switch (logoType) {
    case 'youtube-svg':
      return <YouTubeSVG />;
    case 'disney-svg':
      return <DisneySVG />;
    case 'adobe-svg':
      return <AdobeSVG />;
    case 'canva-svg':
      return <CanvaSVG />;
    case 'microsoft-svg':
      return <MicrosoftSVG />;
    default:
      if (logoType && logoType.startsWith('/')) {
        return <img src={logoType} alt={`${name} logo`} className="w-8 h-8 object-contain" />;
      }
      return <LogoPlaceholder name={name} />;
  }
};

const LogoPlaceholder = ({ name }) => (
    <div className="w-full h-full flex items-center justify-center rounded-lg bg-slate-200">
        <span className="font-bold text-slate-500 text-lg text-center p-2">{name}</span>
    </div>
);

function Plans({ user, setUser }) {
  // State for which plan is selected, modals, user details, payment, etc.
  const [selected, setSelected] = useState(null);
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
  const handleBookNow = (planIdx) => {
    if (!user) {
      // Save intended plan index in sessionStorage for redirect after login
      sessionStorage.setItem('splitup_redirect_plan', planIdx);
      navigate('/login');
      return;
    }
    setSelected(planIdx);
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

  // Modal for payment (mocked, no real payment)
  const PaymentModal = ({ open, onClose, plan, bookingAmount }) => {
    if (!open) return null;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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
          subscriptionType: plan.name,
          planType: plan.planType,
          numberOfPeople: plan.details?.find(d => d.label.toLowerCase().includes('split between'))?.value || '',
          amountPaid: bookingAmount,
          amountRemaining: plan.price - bookingAmount,
          totalAmount: plan.price,
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
          <div className="px-6 py-8">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Select payment method</h3>
            <div className="flex flex-col gap-3 mb-6">
              <button onClick={() => setPaymentMethod('UPI')} className={`w-full py-3 rounded-lg border ${paymentMethod === 'UPI' ? 'border-blue-600 bg-blue-50' : 'border-slate-200'} text-slate-700 font-medium hover:bg-slate-50 transition`}>UPI</button>
              <button onClick={() => setPaymentMethod('Card')} className={`w-full py-3 rounded-lg border ${paymentMethod === 'Card' ? 'border-blue-600 bg-blue-50' : 'border-slate-200'} text-slate-700 font-medium hover:bg-slate-50 transition`}>Credit/Debit Card</button>
              <button onClick={() => setPaymentMethod('Netbanking')} className={`w-full py-3 rounded-lg border ${paymentMethod === 'Netbanking' ? 'border-blue-600 bg-blue-50' : 'border-slate-200'} text-slate-700 font-medium hover:bg-slate-50 transition`}>Netbanking</button>
            </div>
            {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
            <button onClick={handleCompletePayment} disabled={loading} className="w-full py-3 rounded-lg bg-blue-600 text-white font-bold text-lg shadow hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? 'Processing...' : `Complete Payment (₹${bookingAmount})`}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Modal for showing plan details and booking
  const PlanModal = ({ plan, onClose, planIdx }) => {
    const splitAmount = plan.price;
    const bookingAmount = Math.ceil(plan.price * 0.10);
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
          <div className={`rounded-t-2xl p-6 pb-4 ${plan.brandColor} flex flex-col gap-1 relative`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">{plan.name}</h3>
                <div className="text-base font-medium text-slate-700">{plan.planType}</div>
              </div>
              <div className="w-8 h-8">
                {renderLogo(plan.logo, plan.name)}
              </div>
            </div>
          </div>
          <div className="px-6 py-4 space-y-4">
            <ul className="divide-y divide-slate-200">
              {plan.details.map((item, idx) => (
                <li key={idx} className="py-2 flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <span className="text-slate-500 text-sm sm:text-base">{item.label}</span>
                  <span className="font-medium text-slate-800 text-sm sm:text-base mt-1 sm:mt-0">{item.value}</span>
                </li>
              ))}
            </ul>
            <div className="bg-slate-50 rounded-lg p-4 flex flex-col gap-2 border border-slate-100">
              <div className="flex justify-between items-center text-base">
                <span className="text-slate-600">Your split amount</span>
                <span className="font-bold text-slate-900">₹{splitAmount}</span>
              </div>
              <div className="flex justify-between items-center text-base">
                <span className="text-slate-600">Booking amount <span className="text-xs text-slate-400">(10% of split)</span></span>
                <span className="font-bold text-blue-600">₹{bookingAmount}</span>
              </div>
            </div>
            <button
              className="w-full mt-2 py-3 rounded-lg bg-blue-600 text-white font-bold text-lg shadow hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              onClick={() => handleBookNow(planIdx)}
            >
              Book now &nbsp; <span className="text-base font-semibold">₹{bookingAmount}</span>
            </button>
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
            {subscriptions.map((sub, index) => {
              if (sub.status === 'active') {
                // Calculate discount percentage
                let original = 0;
                if (sub.details && sub.details.length > 0) {
                  const monthly = sub.details.find(d => d.label.toLowerCase().includes('monthly price'));
                  if (monthly) {
                    original = parseInt(monthly.value.replace(/[^\d]/g, ''));
                  }
                }
                const discount = original ? Math.round(100 * (1 - sub.price / original)) : null;
                return (
                  <button
                    key={sub.name}
                    className={`text-left rounded-xl p-2 cursor-pointer transition-all duration-300 ease-in-out focus:outline-none hover:scale-105 hover:shadow-xl ${selected === index ? 'ring-2 ring-blue-600 scale-105 shadow-xl' : 'shadow-md'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelected(index);
                    }}
                  >
                    <div className={`aspect-square rounded-lg mb-4 flex items-center justify-center p-4 ${sub.brandColor}`}>
                      {renderLogo(sub.logo, sub.name)}
                    </div>
                    <div className="px-1 relative">
                      <p className="font-semibold text-slate-800">{sub.name} <span className="block text-xs text-slate-500 font-normal">({sub.plan})</span></p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-sm text-slate-500"><span className="font-bold text-slate-900">₹{sub.price}</span>/mo <span className='text-slate-400'>+ taxes</span></p>
                        {discount !== null && (
                          <span className="ml-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-500 text-xs font-semibold whitespace-nowrap">{discount}% off</span>
                        )}
                      </div>
                    </div>
                  </button>
                )
              } else {
                return (
                  <div key={sub.name} className="text-left rounded-xl p-2">
                    <div className="relative aspect-square rounded-lg mb-4 flex items-center justify-center p-4 bg-slate-100 border-2 border-dashed border-slate-300">
                        <LogoPlaceholder name={sub.name} />
                        <div className="absolute inset-0 flex items-center justify-center bg-white/50">
                            <span className="bg-slate-700 text-white text-xs font-semibold px-2 py-1 rounded-full">
                                Coming Soon
                            </span>
                        </div>
                    </div>
                    <div className="px-1">
                      <p className="font-semibold text-slate-500">{sub.name}</p>
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
          <PlanModal plan={subscriptions[selected]} onClose={() => setSelected(null)} planIdx={selected} />
        )}
        {selected !== null && showUserForm && !showPayment && (
          <UserDetailsForm
            open={true}
            plan={subscriptions[selected]}
            user={user}
            onClose={() => { setShowUserForm(false); setSelected(null); }}
            onPay={(details) => { setUserDetails(details); setShowUserForm(false); setShowPayment(true); }}
          />
        )}
        {selected !== null && showPayment && (
          <PaymentModal
            open={true}
            plan={subscriptions[selected]}
            bookingAmount={Math.ceil(subscriptions[selected].price * 0.10)}
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