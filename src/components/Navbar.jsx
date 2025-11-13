// =========================
// File: Navbar.jsx
//
// SUMMARY:
// This is the main navigation bar component for SplitUp. It provides responsive navigation
// with different layouts for regular users and admin users. The navbar includes the logo,
// navigation links, authentication buttons, and mobile menu functionality.
//
// WHAT IT DOES:
// - Displays the SplitUp logo and brand name
// - Shows navigation links (Home, Plans, Orders, Reviews, Blog)
// - Handles user authentication state (login/logout buttons)
// - Provides different navigation for admin users
// - Implements responsive mobile menu with hamburger button
// - Handles smooth scrolling to page sections
//
// WHY IT'S IMPORTANT:
// - Primary navigation interface for the entire application
// - Provides consistent user experience across all pages
// - Handles authentication state visually for users
// - Ensures accessibility on both desktop and mobile devices
//
// HOW IT WORKS:
// - Receives user state from parent App component
// - Conditionally renders different content based on user type
// - Uses React Router for navigation between pages
// - Implements click-outside detection for mobile menu
// - Handles logout functionality for both regular and admin users
// =========================

// Import React hooks for state management and side effects
import React, { useState, useRef, useEffect } from 'react';
// Import React Router components for navigation
import { Link, useLocation, useNavigate } from 'react-router-dom';
// Import Firebase authentication service
import { auth } from '../services/firebase';

function Navbar({ user, setUser }) {
  // =========================
  // STATE AND HOOKS
  // =========================
  
  // State to control mobile menu visibility (open/closed)
  const [isOpen, setIsOpen] = useState(false);
  // Ref to the mobile menu DOM element for click-outside detection
  const menuRef = useRef(null);
  // Function to toggle mobile menu open/closed state
  const toggleMenu = () => setIsOpen(!isOpen);
  // Hook to get current page location (for conditional behavior)
  const location = useLocation();
  // Hook for programmatic navigation
  const navigate = useNavigate();
  
  // =========================
  // MOBILE MENU CLICK-OUTSIDE DETECTION
  // =========================
  
  // Effect to close mobile menu when user clicks outside of it
  useEffect(() => {
    // Only set up listeners if menu is open
    if (!isOpen) return;
    
    // Function to handle clicks outside the menu
    function handleClickOutside(event) {
      // If click is outside the menu element, close the menu
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    
    // Add event listeners for both mouse and touch events
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    
    // Cleanup function to remove event listeners
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]); // Re-run effect when isOpen state changes

  // =========================
  // NAVIGATION CONFIGURATION
  // =========================
  
  // Define navigation links - Orders link only shown to logged-in users
  const navLinks = [
    { name: 'Home', href: '/' },                                    // Landing page
    { name: 'Plans', href: '/plans' },                              // Subscription plans
    ...(user ? [{ name: 'Orders', href: '/orders' }] : []),         // User orders (conditional)
    { name: 'Reviews', href: '/#testimonials' },                    // Testimonials section
    { name: 'Blog', href: '/blog' }                                 // Blog page (placeholder)
  ];

  // Handle logout for both users and admins
  const handleLogout = async () => {
    try {
      localStorage.removeItem('splitup_admin');
      await auth.signOut();
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
    if (isOpen) toggleMenu();
  };

  // Handle smooth scroll to Reviews section if on home page
  const handleReviewsClick = (e) => {
    e.preventDefault();
    if (location.pathname === '/') {
      const el = document.getElementById('testimonials');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/#testimonials'); // Go to home and scroll
    }
    if (isOpen) setIsOpen(false); // Close mobile menu
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo: goes to home or admin portal */}
          <Link to={user && user.isAdmin ? "/admin" : "/"} className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded-full"></div>
            <span className="text-slate-900 font-bold text-xl">Splitup</span>
          </Link>

          {/* If admin, show admin navbar */}
          {user && user.isAdmin ? (
            <nav className="flex items-center gap-8">
              <span className="text-lg font-semibold text-slate-700">Admin Portal</span>
              <button onClick={handleLogout} className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors">Log out</button>
            </nav>
          ) : (
            <>
              {/* Desktop navigation links */}
              <nav className="hidden md:flex items-center gap-8">
                {navLinks.map(link => (
                  link.name === 'Reviews' ? (
                    <a
                      key={link.name}
                      href="/#testimonials"
                      onClick={handleReviewsClick}
                      className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                    >
                      {link.name}
                    </a>
                  ) : (
                    <Link key={link.name} to={link.href} className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                      {link.name}
                    </Link>
                  )
                ))}
              </nav>

              {/* Desktop action buttons (login/logout, avatar) */}
              <div className="hidden md:flex items-center gap-4">
                {user ? (
                  <>
                    <button onClick={handleLogout} className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors">Log out</button>
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <span className="w-8 h-8 flex items-center justify-center bg-slate-300 rounded-full text-slate-700 font-bold uppercase">{user.email ? user.email[0] : '?'}</span>
                    )}
                  </>
                ) : (
                  <>
                    <Link to="/login" className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors">Log in</Link>
                    <Link to="/login?mode=signup" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm">
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            </>
          )}

          {/* Hamburger button for mobile menu (not shown for admin) */}
          {!user?.isAdmin && (
            <button onClick={toggleMenu} className="md:hidden text-slate-700 hover:text-slate-900" aria-label="Toggle menu">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} /></svg>
            </button>
          )}
        </div>
      </div>

      {/* Mobile menu (not shown for admin) */}
      {!user?.isAdmin && (
        <div
          ref={menuRef}
          className={`md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-200 transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        >
          <div className="flex flex-col p-6 space-y-4">
            {navLinks.map(link => (
              link.name === 'Reviews' ? (
                <a
                  key={link.name}
                  href="/#testimonials"
                  onClick={(e) => { handleReviewsClick(e); setIsOpen(false); }}
                  className="text-base font-medium text-slate-700 hover:text-blue-600"
                >
                  {link.name}
                </a>
              ) : (
                <Link key={link.name} to={link.href} className="text-base font-medium text-slate-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>
                  {link.name}
                </Link>
              )
            ))}
            <div className="border-t border-slate-200 pt-4 flex flex-col space-y-3">
              {user ? (
                <button onClick={handleLogout} className="w-full text-center px-4 py-2 text-slate-700 font-semibold">Log out</button>
              ) : (
                <>
                  <Link to="/login" className="w-full text-center px-4 py-2 text-slate-700 font-semibold" onClick={() => setIsOpen(false)}>Log in</Link>
                  <Link to="/login?mode=signup" className="w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700" onClick={() => setIsOpen(false)}>
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar; 