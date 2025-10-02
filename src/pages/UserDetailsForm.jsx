// User details form modal for subscription booking
import React, { useState } from 'react';

function UserDetailsForm({ open, onClose, onPay, plan, user }) {
  const [name, setName] = useState(user?.displayName || '');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  if (!open) return null; // Don't render if not open

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !phone) {
      setError('Please fill all fields');
      return;
    }
    setError('');
    onPay({ name, email: user?.email, phone }); // Pass details to parent
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
        <form onSubmit={handleSubmit} className="px-6 py-8 space-y-5">
          <h3 className="text-xl font-bold text-slate-900 mb-2">Enter your details</h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 bg-slate-50"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
            <div className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-100 text-slate-500 flex items-center gap-2">
              <span className="font-medium">Google Email:</span>
              <span className="text-slate-700 font-mono truncate">{user?.email || 'Not logged in'}</span>
            </div>
            <input
              type="tel"
              placeholder="Phone Number"
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 bg-slate-50"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              required
            />
          </div>
          {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
          <button
            type="submit"
            className="w-full mt-2 py-3 rounded-lg bg-blue-600 text-white font-bold text-lg shadow hover:bg-blue-700 transition-colors"
          >
            Pay now
          </button>
        </form>
      </div>
    </div>
  );
}

export default UserDetailsForm; 