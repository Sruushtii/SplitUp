// Login and Signup page with admin authentication
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { auth, db, googleProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, doc, setDoc, getDoc, serverTimestamp } from '../../services/firebase';
import { sendWelcomeEmail } from '../../services/emailService';

function LoginPage({ user, setUser }) {
  const [searchParams] = useSearchParams();
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);

  // Admin credentials
  const ADMIN_EMAILS = ['admin@gmail.com'];
  const SUPER_ADMIN_EMAIL = 'admin@gmail.com';
  const ADMIN_PASSWORD = 'admin';

  useEffect(() => {
    if (searchParams.get('mode') === 'signup') {
      setIsSignup(true);
    }
  }, [searchParams]);

  // Handle Google sign-in
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      const isNewUser = !userSnap.exists();
      
      if (isNewUser) {
        const userData = {
          uid: user.uid,
          name: user.displayName || '',
          email: user.email || '',
          phone: user.phoneNumber || '',
          photoURL: user.photoURL || '',
          provider: user.providerData && user.providerData[0] ? user.providerData[0].providerId : 'google',
          createdAt: serverTimestamp(),
        };
        // Save user to database
        await setDoc(userRef, userData);
        
        // Send welcome email to new user
        console.log('🎉 [SIGNUP] New Google user detected, sending welcome email...');
        try {
          const welcomeEmailData = {
            email: user.email,
            name: user.displayName || user.email.split('@')[0],
            displayName: user.displayName
          };
          console.log('📧 [SIGNUP] Preparing welcome email with data:', welcomeEmailData);
          
          await sendWelcomeEmail(welcomeEmailData);
          console.log('✅ [SIGNUP] Welcome email sent successfully to:', user.email);
        } catch (emailError) {
          console.error('⚠️ [SIGNUP] Failed to send welcome email to:', user.email);
          console.error('⚠️ [SIGNUP] Email error details:', emailError);
          // Don't block signup if email fails
        }
      }
      
      if (setUser) setUser(user);
      // If booking flow in progress, redirect to plans
      if (sessionStorage.getItem('splitup_redirect_plan') !== null) {
        navigate('/plans');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError('Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Helpers for admin email check
  const isAdminEmail = (email) => ADMIN_EMAILS.some(e => e.toLowerCase() === email.toLowerCase());
  const isSuperAdminEmail = (email) => email && email.toLowerCase() === SUPER_ADMIN_EMAIL;

  // Handle email/password login or signup
  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isAdminLogin) {
        // Admin login logic - authenticate with Firebase first
        if (!isAdminEmail(email)) throw new Error('Not an admin email');
        if (password !== ADMIN_PASSWORD) throw new Error('Incorrect admin password');
        
        try {
          // Try to sign in with Firebase first
          const result = await signInWithEmailAndPassword(auth, email, password);
          const firebaseUser = result.user;
          
          // Create admin user object with Firebase auth
          const adminUser = {
            ...firebaseUser,
            isAdmin: true,
            isSuperAdmin: isSuperAdminEmail(email)
          };
          
          console.log('Admin login successful with Firebase:', adminUser);
          if (setUser) setUser(adminUser);
          localStorage.setItem('splitup_admin', JSON.stringify(adminUser));
          navigate('/admin');
        } catch (firebaseError) {
          console.log('Firebase auth failed, using fallback admin auth:', firebaseError.message);
          
          // Fallback: Create admin user without Firebase auth
          const adminUser = {
            uid: 'admin-uid-12345',
            email: email,
            displayName: 'Admin User',
            isAdmin: true,
            isSuperAdmin: isSuperAdminEmail(email),
            photoURL: null
          };
          
          console.log('Admin login successful (fallback):', adminUser);
          if (setUser) setUser(adminUser);
          localStorage.setItem('splitup_admin', JSON.stringify(adminUser));
          navigate('/admin');
        }
      } else if (isSignup) {
        if (!name) throw new Error('Name is required');
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const user = result.user;
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, {
          uid: user.uid,
          name: name,
          email: user.email,
          phone: user.phoneNumber || '',
          photoURL: user.photoURL || '',
          provider: 'password',
          createdAt: serverTimestamp(),
        });
        
        // Send welcome email to new user
        console.log('🎉 [SIGNUP] New email user created, sending welcome email...');
        try {
          const welcomeEmailData = {
            email: user.email,
            name: name,
            displayName: name
          };
          console.log('📧 [SIGNUP] Preparing welcome email with data:', welcomeEmailData);
          
          await sendWelcomeEmail(welcomeEmailData);
          console.log('✅ [SIGNUP] Welcome email sent successfully to:', user.email);
        } catch (emailError) {
          console.error('⚠️ [SIGNUP] Failed to send welcome email to:', user.email);
          console.error('⚠️ [SIGNUP] Email error details:', emailError);
          // Don't block signup if email fails
        }
        
        if (setUser) setUser(user);
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
        if (setUser) setUser(userCredential.user);
      }
      // If booking flow in progress, redirect to plans
      if (sessionStorage.getItem('splitup_redirect_plan') !== null) {
        navigate('/plans');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // UI/UX: Role switcher (user/admin)
  const role = isAdminLogin ? 'admin' : (isSignup ? 'signup' : 'login');

  if (user) return null; // If already logged in, don't show login page

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white rounded-xl shadow-lg p-8">
        {/* Role switcher buttons */}
        <div className="flex justify-center mb-6">
          <button
            className={`px-4 py-2 rounded-l-lg font-semibold text-sm border ${!isAdminLogin ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'} border-slate-200 focus:outline-none`}
            onClick={() => { setIsAdminLogin(false); setIsSignup(false); setError(''); }}
            disabled={!isAdminLogin}
          >
            User
          </button>
          <button
            className={`px-4 py-2 rounded-r-lg font-semibold text-sm border-l-0 border ${isAdminLogin ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'} border-slate-200 focus:outline-none`}
            onClick={() => { setIsAdminLogin(true); setIsSignup(false); setError(''); }}
            disabled={isAdminLogin}
          >
            Admin
          </button>
        </div>
        <div className="text-center mb-2">
          <h2 className="text-2xl font-extrabold text-slate-900">
            {isAdminLogin ? 'Admin Login' : (isSignup ? 'Create your account' : 'Welcome back')}
          </h2>
        </div>
        {/* Auth form */}
        <form className="space-y-4" action="#" method="POST" onSubmit={handleEmailAuth}>
          <div className="space-y-4 rounded-md">
            {/* Name field only for user signup */}
            {isSignup && !isAdminLogin && (
              <div>
                <label htmlFor="name" className="sr-only">Full Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required={isSignup && !isAdminLogin}
                  className="appearance-none relative block w-full px-4 py-3 border border-slate-300 placeholder-slate-500 text-slate-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Full Name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  disabled={loading}
                />
              </div>
            )}
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-slate-300 placeholder-slate-500 text-slate-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete={isSignup ? 'new-password' : 'current-password'}
                required
                className="appearance-none relative block w-full px-4 py-3 border border-slate-300 placeholder-slate-500 text-slate-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm pr-12"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                disabled={loading}
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-700 focus:outline-none"
                onClick={() => setShowPassword(v => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.403-3.22 1.125-4.575m1.664-2.13A9.956 9.956 0 0112 3c5.523 0 10 4.477 10 10 0 1.657-.403 3.22-1.125 4.575m-1.664 2.13A9.956 9.956 0 0112 21c-5.523 0-10-4.477-10-10 0-1.657.403-3.22 1.125-4.575" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.274.832-.642 1.624-1.09 2.354M15.54 15.54A5.978 5.978 0 0112 17c-3.314 0-6-2.686-6-6 0-.828.167-1.617.46-2.354" /></svg>
                )}
              </button>
            </div>
          </div>
          {/* Google button only for user login/signup */}
          {!isAdminLogin && (
            <button
              type="button"
              className="w-full flex justify-center items-center py-3 px-4 border border-slate-300 rounded-lg shadow-sm bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-60"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <img className="h-5 w-5 mr-3" src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google logo" />
              {isSignup ? 'Sign up with Google' : 'Continue with Google'}
            </button>
          )}
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-60"
            disabled={loading}
          >
            {loading ? (isAdminLogin ? 'Logging in...' : (isSignup ? 'Signing up...' : 'Logging in...')) : (isAdminLogin ? 'Admin Login' : (isSignup ? 'Sign up with Email' : 'Log in with Email'))}
          </button>
          {error && <div className="text-red-500 text-sm text-center mt-2">{error}</div>}
        </form>
        {/* Switch between login/signup for user only */}
        {!isAdminLogin && (
          <p className="text-center text-sm text-slate-600 mt-4">
            {isSignup ? (
              <>
                Already have an account?{' '}
                <button type="button" className="font-medium text-blue-600 hover:text-blue-500 underline" onClick={() => setIsSignup(false)}>
                  Log in
                </button>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <button type="button" className="font-medium text-blue-600 hover:text-blue-500 underline" onClick={() => setIsSignup(true)}>
                  Sign up
                </button>
              </>
            )}
          </p>
        )}
      </div>
    </div>
  );
}

export default LoginPage; 