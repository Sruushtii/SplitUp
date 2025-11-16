// =========================
// File: App.jsx
//
// SUMMARY:
// This is the main App component that serves as the root of the SplitUp React application.
// It handles routing, authentication state management, and renders the appropriate pages
// based on the current URL and user authentication status.
//
// WHAT IT DOES:
// - Sets up React Router for client-side navigation
// - Manages global user authentication state
// - Protects admin routes from unauthorized access
// - Renders the appropriate page components based on URL
// - Provides consistent layout with Navbar and Footer
//
// WHY IT'S IMPORTANT:
// - Central hub that connects all pages and components
// - Ensures proper authentication flow throughout the app
// - Provides consistent user experience across all pages
// - Handles both regular users and admin users differently
//
// HOW IT WORKS:
// - Uses React Router to map URLs to page components
// - Firebase auth listener updates user state automatically
// - Admin users are redirected to admin portal
// - Regular users can access public and protected routes
// =========================

// Import React hooks for state management and side effects
import React, { useState, useEffect } from 'react';
// Import React Router components for client-side navigation
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
// Import layout components that appear on every page
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
// Import page components for different routes
import HomePage from "./pages/HomePage";
import Plans from "./pages/Plans";
import LoginPage from "./pages/auth/LoginPage";
import Orders from "./pages/Orders";
// Import Firebase authentication service
import { auth } from './services/firebase';
// Import admin-specific page
import AdminPortal from './pages/AdminPortal';

// =========================
// HELPER COMPONENTS
// =========================

// Placeholder component for pages that haven't been built yet
// Used for Reviews, Blog, Sign Up, and My Account pages
const DummyPage = ({title}) => (
    <div className="bg-white min-h-screen pt-40 pb-16 text-center px-4">
        <h1 className="text-4xl font-bold text-slate-800">{title}</h1>
        <p className="mt-4 text-slate-600">This is a placeholder page. The actual content will be built later.</p>
    </div>
);

// Route protection component for admin-only pages
// Automatically redirects non-admin users to login page
function AdminRoute({ user, children }) {
  const navigate = useNavigate(); // Hook for programmatic navigation
  
  // Effect runs whenever user state changes
  useEffect(() => {
    // If no user is logged in OR user is not an admin, redirect to login
    if (!user || !user.isAdmin) {
      navigate('/login');
    }
  }, [user, navigate]); // Dependencies: re-run when user or navigate changes
  
  // Don't render children if user is not admin (double protection)
  if (!user || !user.isAdmin) return null;
  
  // If user is admin, render the protected content
  return children;
}

// Component that automatically redirects admins to admin portal
// Prevents admins from accessing regular user pages
function AdminRedirector({ user }) {
  const location = useLocation(); // Hook to get current URL location
  
  useEffect(() => {
    // Exit early if no user is logged in
    if (!user) return;
    
    // If user is admin and not already on admin or login page, redirect
    if (user.isAdmin && location.pathname !== '/admin' && location.pathname !== '/login') {
      window.location.replace('/admin'); // Hard redirect (not React Router navigation)
    }
  }, [user, location]); // Dependencies: re-run when user or location changes
  
  // This component doesn't render anything visible
  return null;
}

// =========================
// MAIN APP COMPONENT
// =========================

function App() {
  // State to store current user information (null if not logged in)
  const [user, setUser] = useState(null);
  // State to track if we've finished checking authentication status
  const [checked, setChecked] = useState(false);

  // Effect runs once when component mounts to set up authentication
  useEffect(() => {
    // First, check if there's an admin session stored in localStorage
    // This is used for the special admin login (admin@gmail.com)
    const adminSession = localStorage.getItem('splitup_admin');
    if (adminSession) {
      // Parse the stored admin data and set as current user
      setUser(JSON.parse(adminSession));
      setChecked(true); // Mark authentication check as complete
      return; // Exit early, don't set up Firebase listener
    }
    
    // For regular users, set up Firebase authentication listener
    // This listener automatically updates user state when auth status changes
    const unsubscribe = auth.onAuthStateChanged(u => {
      setUser(u); // Update user state (u is null if not logged in)
      setChecked(true); // Mark authentication check as complete
    });
    
    // Return cleanup function to unsubscribe from listener when component unmounts
    return unsubscribe;
  }, []); // Empty dependency array = run only once on mount

  // Special handling for admin users - redirect them to admin portal
  if (user && user.isAdmin && window.location.pathname !== '/admin') {
    window.location.replace('/admin'); // Hard redirect to admin portal
    return null; // Don't render anything during redirect
  }
  
  // Don't render the app until we've checked authentication status
  // This prevents flash of wrong content before auth state is determined
  if (!checked) return null;
  // Render the main application structure
  return (
    <BrowserRouter> {/* Enables client-side routing for the entire app */}
      {/* Navigation bar - appears on every page, receives user state */}
      <Navbar user={user} setUser={setUser} />
      
      {/* Route definitions - maps URLs to page components */}
      <Routes>
        {/* PUBLIC ROUTES - accessible to everyone */}
        
        {/* Home page - landing page with hero section and testimonials */}
        <Route path="/" element={<HomePage />} />
        
        {/* Plans page - shows subscription plans, handles booking flow */}
        {/* Passes user state so it can show different content for logged-in users */}
        <Route path="/plans" element={<Plans user={user} setUser={setUser} />} />
        
        {/* PLACEHOLDER ROUTES - not fully implemented yet */}
        
        {/* Reviews page - placeholder for customer reviews */}
        <Route path="/reviews" element={<DummyPage title="Reviews" />} />
        
        {/* Blog page - placeholder for blog/articles */}
        <Route path="/blog" element={<DummyPage title="Blog" />} />
        

        <Route path="/signup" element={<DummyPage title="Sign Up" />} />
        
        {/* My Account page - placeholder for user profile management */}
        <Route path="/account" element={<DummyPage title="My Account" />} />
        
        {/* AUTHENTICATION ROUTES */}
        
        {/* Login page - handles both login and signup */}
        {/* Passes user state to redirect after successful login */}
        <Route path="/login" element={<LoginPage user={user} setUser={setUser} />} />
        
        {/* USER-SPECIFIC ROUTES - require authentication */}
        
        {/* Orders page - shows user's subscription orders and status */}
        {/* Passes user state to fetch and display user-specific data */}
        <Route path="/orders" element={<Orders user={user} setUser={setUser} />} />
        
        {/* ADMIN ROUTES - protected by AdminRoute component */}
        
        {/* Admin portal - only accessible to admin users */}
        {/* AdminRoute component automatically redirects non-admins to login */}
        <Route path="/admin" element={
          <AdminRoute user={user}>
            <AdminPortal user={user} setUser={setUser} />
          </AdminRoute>
        } />
      </Routes>
      
      {/* Footer - appears on every page at the bottom */}
      <Footer />
    </BrowserRouter>
  )
}

export default App
