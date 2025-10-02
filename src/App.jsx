// Main App component with routing and authentication
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import Plans from "./pages/Plans";
import LoginPage from "./pages/auth/LoginPage";
import Orders from "./pages/Orders";
import { auth } from './services/firebase';
import AdminPortal from './pages/AdminPortal';

// Placeholder for unbuilt pages
const DummyPage = ({title}) => (
    <div className="bg-white min-h-screen pt-40 pb-16 text-center px-4">
        <h1 className="text-4xl font-bold text-slate-800">{title}</h1>
        <p className="mt-4 text-slate-600">This is a placeholder page. The actual content will be built later.</p>
    </div>
);

// Protect admin routes
function AdminRoute({ user, children }) {
  const navigate = useNavigate();
  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/login');
    }
  }, [user, navigate]);
  if (!user || !user.isAdmin) return null;
  return children;
}

// Redirect admins to admin portal
function AdminRedirector({ user }) {
  const location = useLocation();
  useEffect(() => {
    if (!user) return;
    if (user.isAdmin && location.pathname !== '/admin' && location.pathname !== '/login') {
      window.location.replace('/admin');
    }
  }, [user, location]);
  return null;
}

function App() {
  const [user, setUser] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Check for admin session first
    const adminSession = localStorage.getItem('splitup_admin');
    if (adminSession) {
      setUser(JSON.parse(adminSession));
      setChecked(true);
      return;
    }
    // Use Firebase auth for regular users
    const unsubscribe = auth.onAuthStateChanged(u => {
      setUser(u);
      setChecked(true);
    });
    return unsubscribe;
  }, []);

  // Redirect admin to admin portal
  if (user && user.isAdmin && window.location.pathname !== '/admin') {
    window.location.replace('/admin');
    return null;
  }
  if (!checked) return null;
  return (
    <BrowserRouter>
      <Navbar user={user} setUser={setUser} />
      <Routes>
        {/* Home page */}
        <Route path="/" element={<HomePage />} />
        {/* Plans page (pass user info) */}
        <Route path="/plans" element={<Plans user={user} setUser={setUser} />} />
        {/* Reviews and Blog are placeholders */}
        <Route path="/reviews" element={<DummyPage title="Reviews" />} />
        <Route path="/blog" element={<DummyPage title="Blog" />} />
        {/* Login page (pass user info) */}
        <Route path="/login" element={<LoginPage user={user} setUser={setUser} />} />
        {/* Signup is a placeholder (real signup is in LoginPage) */}
        <Route path="/signup" element={<DummyPage title="Sign Up" />} />
        {/* Orders page (user's subscriptions) */}
        <Route path="/orders" element={<Orders user={user} setUser={setUser} />} />
        {/* My Account is a placeholder */}
        <Route path="/account" element={<DummyPage title="My Account" />} />
        {/* Admin portal, protected by AdminRoute */}
        <Route path="/admin" element={
          <AdminRoute user={user}>
            <AdminPortal user={user} setUser={setUser} />
          </AdminRoute>
        } />
      </Routes>
      <Footer /> {/* Bottom footer */}
    </BrowserRouter>
  )
}

export default App
