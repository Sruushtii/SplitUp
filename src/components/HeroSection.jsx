// =========================
// File: HeroSection.jsx
//
// SUMMARY:
// This component renders the main hero section and "How it Works" section for the SplitUp homepage.
// It includes the primary value proposition, call-to-action buttons, and a 4-step process explanation
// that helps users understand how the subscription sharing platform works.
//
// WHAT IT DOES:
// - Displays the main headline and value proposition
// - Shows call-to-action buttons (Get Started, How it Works)
// - Renders an avatar image to make the page more engaging
// - Explains the 4-step process of using SplitUp
// - Provides smooth scrolling navigation within the page
//
// WHY IT'S IMPORTANT:
// - First impression for visitors - needs to clearly communicate value
// - Drives user conversion with clear CTAs
// - Educates users on how the platform works
// - Builds trust with VIT Pune branding
//
// HOW IT WORKS:
// - Uses responsive design for mobile and desktop
// - Links to /plans page for user conversion
// - Implements smooth scrolling to "How it Works" section
// - Uses custom SVG icons for visual appeal
// =========================

// Import React for component creation
import React from 'react';
// Import Link component for navigation to other pages
import { Link } from 'react-router-dom';

// =========================
// CUSTOM SVG ICON COMPONENTS
// =========================

// Icon representing group formation/joining (step 1)
const GroupIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.5 17.5C19.433 15.567 19.433 12.433 17.5 10.5C15.567 8.56701 12.433 8.56701 10.5 10.5M6.5 6.5C4.567 8.43301 4.567 11.567 6.5 13.5C8.433 15.433 11.567 15.433 13.5 13.5M14 10L10 14M21 21L19 19M5 5L3 3" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
);

// Icon representing payment/credit card (step 2)
const PayIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="6" width="18" height="13" rx="2" stroke="#3B82F6" strokeWidth="2"/><path d="M3 10H21" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"/></svg>
);

// Icon representing success/checkmark (step 3)
const EnjoyIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 13.3L8.5 17L19 6" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
);

// Icon representing refund/money back guarantee (step 4)
const RefundIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 15L15 12M15 12L12 9M15 12H9" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
);

function HeroSection() {
  return (
    <main className="bg-white">
      {/* Hero section: main headline and call-to-action */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="max-w-6xl w-full mx-auto flex flex-col md:flex-row items-center px-4 sm:px-6 lg:px-8">
          {/* Left: Text content */}
          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
            <h1 className="text-slate-900 font-extrabold text-4xl sm:text-5xl md:text-6xl leading-tight mb-6">
              The Smart, Secure Way<br className="hidden md:inline" /> to Share Subscriptions.
            </h1>
            <p className="text-slate-600 text-lg md:text-xl mb-8 max-w-2xl">
              Splitup is the secure and easy way to share subscription costs with anyone. Create or join a group and start saving today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              {/* Button to go to plans page */}
              <Link to="/plans" className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg text-base font-semibold hover:bg-blue-700 transition text-center shadow-md">
                Get Started
              </Link>
              {/* Button to scroll to 'How it works' section */}
              <a href="#how-it-works" className="w-full sm:w-auto px-8 py-3 bg-white text-slate-700 rounded-lg text-base font-semibold hover:bg-slate-100 transition text-center border border-slate-300 shadow-md">
                How it Works
              </a>
            </div>
            {/* Tagline about VIT Pune */}
            <div className="mt-8 flex items-center gap-3 text-slate-500">
              <svg className="w-6 h-6 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008h-.008v-.008z" />
              </svg>
              <span className="text-sm font-semibold">A secure platform proudly incubated at <span className='text-blue-600'>VIT Pune.</span> </span>
            </div>
          </div>
          {/* Right: Avatar image */}
          <div className="flex-1 flex justify-center items-center mt-12 md:mt-0">
            <div className="relative w-full max-w-lg">
              <img
                src="/avatar.png"
                alt="Group of people sharing subscriptions"
                className="w-full h-auto object-contain select-none scale-110"
                draggable="false"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How it works section: explains the process in 4 steps */}
      <section id="how-it-works" className="py-16 bg-white scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">How Splitup works</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {/* Step 1: Join a group */}
            <div className="text-center p-4">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-4">
                <GroupIcon />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">1. Join a group</h3>
              <p className="text-slate-500">Find a group for your favorite service. We'll match you with others looking to share.</p>
            </div>
            {/* Step 2: Pay your share */}
            <div className="text-center p-4">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-4">
                <PayIcon />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">2. Pay your share</h3>
              <p className="text-slate-500">Pay your portion of the subscription cost securely through our platform.</p>
            </div>
            {/* Step 3: Enjoy your subscription */}
            <div className="text-center p-4">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-4">
                <EnjoyIcon />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">3. Enjoy your subscription</h3>
              <p className="text-slate-500">Once you've paid, you'll receive instant access to start saving.</p>
            </div>
            {/* Step 4: Get a refund if not satisfied */}
            <div className="text-center p-4">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-4">
                <RefundIcon />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">4. Get a refund if not satisfied</h3>
              <p className="text-slate-500">If you're not happy, we offer a full refund within a specified period. No questions asked.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default HeroSection; 