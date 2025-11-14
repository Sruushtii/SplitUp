// =========================
// File: emailService.js
//
// SUMMARY:
// This service handles all email functionality for SplitUp using EmailJS. EmailJS allows sending
// emails directly from the frontend without needing a backend server or domain verification.
// It manages welcome emails, order confirmations, and admin notifications.
//
// WHAT IT DOES:
// - Sends welcome emails to new users
// - Sends order confirmation emails with subscription details
// - Sends admin notification emails for new orders
//
// WHY IT'S IMPORTANT:
// - Provides professional communication with users
// - Confirms successful transactions and builds trust
// - Keeps admins informed of new business
// - No backend server required - works entirely from frontend
//
// HOW IT WORKS:
// - Uses EmailJS service with pre-configured email templates
// - Templates are set up in EmailJS dashboard with dynamic variables
// - Functions format data and send via EmailJS API
// - Error handling ensures user flow isn't disrupted by email failures
// =========================

// Import EmailJS browser library for client-side email sending
import emailjs from '@emailjs/browser';

// =========================
// EMAILJS CONFIGURATION
// =========================

// EmailJS service configuration - these IDs are from EmailJS dashboard
const EMAILJS_SERVICE_ID = 'service_a15iq4h';  
const EMAILJS_TEMPLATE_ID_WELCOME = 'template_oef19xj';  // Updated template ID
const EMAILJS_TEMPLATE_ID_ORDER = 'template_rzlqcgf'; 
const EMAILJS_PUBLIC_KEY = 'jN2G0MW074qCNUZAV';       

// Initialize EmailJS with public key for authentication
emailjs.init(EMAILJS_PUBLIC_KEY);

/**
 * Send welcome email to new users
 * @param {Object} userData - User data containing email, name
 * @returns {Promise} - EmailJS response
 */
export const sendWelcomeEmail = async (userData) => {
  try {
    // Simplified template parameters - using standard EmailJS variable names
    const templateParams = {
      to_name: userData.name || 'there',
      to_email: userData.email,
      from_name: 'SplitUp Team',
      message: 'Welcome to SplitUp! Start saving money on your subscriptions today.',
    };

    console.log('🔄 Sending welcome email to:', userData.email);
    console.log('📧 Using service:', EMAILJS_SERVICE_ID);
    console.log('📧 Using template:', EMAILJS_TEMPLATE_ID_WELCOME);

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID_WELCOME,
      templateParams
    );

    if (response && response.status === 200) {
      console.log('✅ Welcome email sent successfully:', response);
      return response;
    } else {
      throw new Error('EmailJS returned non-200 status: ' + (response?.status || 'unknown'));
    }
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    console.error('Error type:', typeof error);
    console.error('Error message:', error?.message || 'Unknown error');
    
    // Don't throw error - just log it so user registration isn't blocked
    return null;
  }
};

/**
 * Send order confirmation email to users
 * @param {Object} orderData - Order data containing user and subscription details
 * @returns {Promise} - EmailJS response
 */
export const sendOrderConfirmationEmail = async (orderData) => {
  try {
    // Simplified template parameters
    const templateParams = {
      to_name: orderData.name,
      to_email: orderData.email,
      from_name: 'SplitUp Team',
      subscription_type: orderData.subscriptionType || 'Subscription',
      plan_type: orderData.planType || 'Plan',
      total_amount: orderData.totalAmount || '0',
      message: `Your ${orderData.subscriptionType} ${orderData.planType} order has been confirmed!`,
    };

    console.log('🔄 Sending order confirmation email to:', orderData.email);

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID_ORDER,
      templateParams
    );

    if (response && response.status === 200) {
      console.log('✅ Order confirmation email sent successfully:', response);
      return response;
    } else {
      throw new Error('EmailJS returned non-200 status: ' + (response?.status || 'unknown'));
    }
  } catch (error) {
    console.error('❌ Error sending order confirmation email:', error);
    console.error('Error type:', typeof error);
    console.error('Error message:', error?.message || 'Unknown error');
    
    // Don't throw error - just log it so order process isn't blocked
    return null;
  }
};

/**
 * Send admin notification email when new order is placed
 * @param {Object} orderData - Order data
 * @returns {Promise} - EmailJS response
 */
export const sendAdminNotificationEmail = async (orderData) => {
  try {
    // Simplified template parameters for admin notification
    const templateParams = {
      to_name: 'Admin',
      to_email: 'kumbharsrushti.01@gmail.com',
      from_name: 'SplitUp System',
      customer_name: orderData.name || 'Unknown',
      customer_email: orderData.email || 'Unknown',
      subscription_type: orderData.subscriptionType || 'Unknown',
      total_amount: orderData.totalAmount || '0',
      message: `New order from ${orderData.name} for ${orderData.subscriptionType}`,
    };

    console.log('🔄 Sending admin notification email...');

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID_ORDER, // Using same template as order confirmation
      templateParams
    );

    if (response && response.status === 200) {
      console.log('✅ Admin notification email sent successfully:', response);
      return response;
    } else {
      console.log('⚠️ Admin notification failed, but continuing...');
      return null;
    }
  } catch (error) {
    console.error('❌ Error sending admin notification email:', error);
    // Don't throw error for admin notifications - it shouldn't block user flow
    return null;
  }
};
