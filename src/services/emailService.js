// =========================
// File: emailService.js
// EmailJS service for SplitUp - handles welcome and order confirmation emails
// =========================

import emailjs from '@emailjs/browser';

// EmailJS Configuration - Updated with correct credentials
const EMAILJS_SERVICE_ID = 'service_wcvg2i3';
const EMAILJS_TEMPLATE_ID_WELCOME = 'template_k2eb16g';
const EMAILJS_TEMPLATE_ID_ORDER = 'template_620ndud';
const EMAILJS_PUBLIC_KEY = 'lL5P2ZqG4phJcJz6B';

// Initialize EmailJS with detailed logging
console.log('🚀 [EmailJS] Initializing EmailJS with public key:', EMAILJS_PUBLIC_KEY);
emailjs.init(EMAILJS_PUBLIC_KEY);
console.log('✅ [EmailJS] EmailJS initialized successfully');

/**
 * Send welcome email to new users
 */
export const sendWelcomeEmail = async (userData) => {
  console.log('📧 [WELCOME EMAIL] Starting welcome email process...');
  console.log('📧 [WELCOME EMAIL] Input userData:', JSON.stringify(userData, null, 2));
  
  // Validate input data
  if (!userData) {
    console.error('❌ [WELCOME EMAIL] No userData provided');
    throw new Error('User data is required');
  }
  
  if (!userData.email) {
    console.error('❌ [WELCOME EMAIL] No email provided in userData');
    throw new Error('User email is required');
  }
  
  console.log('✅ [WELCOME EMAIL] Input validation passed');
  
  try {
    const templateParams = {
      to_name: userData.name || userData.displayName || userData.email?.split('@')[0] || 'User',
      to_email: userData.email,
      user_email: userData.email, // Additional field for template compatibility
      user_name: userData.name || userData.displayName || userData.email?.split('@')[0] || 'User',
      from_name: 'SplitUp Team',
      reply_to: 'info.splitup@gmail.com',
      company_name: 'SplitUp',
    };
    
    console.log('📧 [WELCOME EMAIL] Template parameters prepared:');
    console.log('📧 [WELCOME EMAIL] Service ID:', EMAILJS_SERVICE_ID);
    console.log('📧 [WELCOME EMAIL] Template ID:', EMAILJS_TEMPLATE_ID_WELCOME);
    console.log('📧 [WELCOME EMAIL] Template Params:', JSON.stringify(templateParams, null, 2));
    
    console.log('📤 [WELCOME EMAIL] Sending email via EmailJS...');
    
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID_WELCOME,
      templateParams
    );
    
    console.log('✅ [WELCOME EMAIL] Email sent successfully!');
    console.log('✅ [WELCOME EMAIL] Response:', JSON.stringify(response, null, 2));
    console.log('✅ [WELCOME EMAIL] Email sent to:', userData.email);
    
    return response;
    
  } catch (error) {
    console.error('❌ [WELCOME EMAIL] Failed to send welcome email');
    console.error('❌ [WELCOME EMAIL] Error details:', error);
    console.error('❌ [WELCOME EMAIL] Error message:', error.message);
    console.error('❌ [WELCOME EMAIL] Error stack:', error.stack);
    
    // Log specific EmailJS error details
    if (error.status) {
      console.error('❌ [WELCOME EMAIL] EmailJS Status:', error.status);
    }
    if (error.text) {
      console.error('❌ [WELCOME EMAIL] EmailJS Text:', error.text);
    }
    
    throw error;
  }
};

/**
 * Send order confirmation email
 */
export const sendOrderConfirmationEmail = async (orderData) => {
  console.log('📧 [ORDER EMAIL] Starting order confirmation email process...');
  console.log('📧 [ORDER EMAIL] Input orderData:', JSON.stringify(orderData, null, 2));
  
  // Validate input data
  if (!orderData) {
    console.error('❌ [ORDER EMAIL] No orderData provided');
    throw new Error('Order data is required');
  }
  
  if (!orderData.email) {
    console.error('❌ [ORDER EMAIL] No email provided in orderData');
    throw new Error('Order email is required');
  }
  
  console.log('✅ [ORDER EMAIL] Input validation passed');
  
  try {
    const templateParams = {
      to_name: orderData.name || orderData.email?.split('@')[0] || 'Customer',
      to_email: orderData.email,
      email: orderData.email, // Ensure 'email' is set for recipient
      user_email: orderData.email, // Additional field for template compatibility
      user_name: orderData.name || orderData.email?.split('@')[0] || 'Customer',
      subscription_type: orderData.subscriptionType || '',
      plan_type: orderData.planType || '',
      number_of_people: orderData.numberOfPeople || '',
      payment_method: orderData.paymentMethod || '',
      amount_paid: orderData.amountPaid || '',
      amount_remaining: orderData.amountRemaining || '',
      total_amount: orderData.totalAmount || '',
      from_name: 'SplitUp Team',
      reply_to: 'info.splitup@gmail.com',
      company_name: 'SplitUp',
    };
    
    console.log('📧 [ORDER EMAIL] Template parameters prepared:');
    console.log('📧 [ORDER EMAIL] Service ID:', EMAILJS_SERVICE_ID);
    console.log('📧 [ORDER EMAIL] Template ID:', EMAILJS_TEMPLATE_ID_ORDER);
    console.log('📧 [ORDER EMAIL] Template Params:', JSON.stringify(templateParams, null, 2));
    
    console.log('📤 [ORDER EMAIL] Sending email via EmailJS...');
    
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID_ORDER,
      templateParams
    );
    
    console.log('✅ [ORDER EMAIL] Email sent successfully!');
    console.log('✅ [ORDER EMAIL] Response:', JSON.stringify(response, null, 2));
    console.log('✅ [ORDER EMAIL] Email sent to:', orderData.email);
    
    return response;
    
  } catch (error) {
    console.error('❌ [ORDER EMAIL] Failed to send order confirmation email');
    console.error('❌ [ORDER EMAIL] Error details:', error);
    console.error('❌ [ORDER EMAIL] Error message:', error.message);
    console.error('❌ [ORDER EMAIL] Error stack:', error.stack);
    
    // Log specific EmailJS error details
    if (error.status) {
      console.error('❌ [ORDER EMAIL] EmailJS Status:', error.status);
    }
    if (error.text) {
      console.error('❌ [ORDER EMAIL] EmailJS Text:', error.text);
    }
    
    throw error;
  }
};

/**
 * Test function to verify EmailJS configuration
 */
export const testEmailService = async () => {
  console.log('🧪 [EMAIL TEST] Starting email service test...');
  
  try {
    console.log('🧪 [EMAIL TEST] Configuration check:');
    console.log('🧪 [EMAIL TEST] Service ID:', EMAILJS_SERVICE_ID);
    console.log('🧪 [EMAIL TEST] Welcome Template ID:', EMAILJS_TEMPLATE_ID_WELCOME);
    console.log('🧪 [EMAIL TEST] Order Template ID:', EMAILJS_TEMPLATE_ID_ORDER);
    console.log('🧪 [EMAIL TEST] Public Key:', EMAILJS_PUBLIC_KEY);
    
    // Test welcome email with dummy data
    const testUserData = {
      email: 'test@example.com',
      name: 'Test User',
      displayName: 'Test User'
    };
    
    console.log('🧪 [EMAIL TEST] Testing welcome email...');
    await sendWelcomeEmail(testUserData);
    
    console.log('✅ [EMAIL TEST] Email service test completed successfully!');
    return true;
    
  } catch (error) {
    console.error('❌ [EMAIL TEST] Email service test failed:', error);
    return false;
  }
};

// Admin notification email removed as per new requirements.
