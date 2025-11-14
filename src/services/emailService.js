// =========================
// File: emailService.js
// EmailJS service for SplitUp - handles welcome and order confirmation emails
// =========================

import emailjs from '@emailjs/browser';

// EmailJS Configuration - Updated with correct credentials
const EMAILJS_SERVICE_ID = 'service_mwdwmo8';
const EMAILJS_TEMPLATE_ID_WELCOME = 'template_k0cc8td';
const EMAILJS_TEMPLATE_ID_ORDER = 'template_vf2fm9k';
const EMAILJS_PUBLIC_KEY = '1xrthKm2JY9_F_Tu1';

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

/**
 * Send welcome email to new users
 */
export const sendWelcomeEmail = async (userData) => {
  try {
    // Use the most basic EmailJS template variables
    const templateParams = {
      // Standard EmailJS variables that most templates expect
      name: userData.name || 'User',
      email: userData.email,
      to_name: userData.name || 'User', 
      to_email: userData.email,
      from_name: 'SplitUp Team',
      reply_to: 'sru24012005@gmail.com',
      message: `Welcome to SplitUp! Start saving money on your subscriptions today.`
    };

    console.log('🔄 Sending welcome email to:', userData.email);
    console.log('📧 Template params:', templateParams);

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID_WELCOME,
      templateParams
    );

    console.log('✅ Welcome email sent successfully');
    return response;
  } catch (error) {
    console.error('❌ Welcome email failed:', error);
    return null; // Don't block user registration
  }
};

/**
 * Send order confirmation email
 */
export const sendOrderConfirmationEmail = async (orderData) => {
  try {
    const templateParams = {
      // Standard EmailJS variables
      name: orderData.name,
      email: orderData.email,
      to_name: orderData.name,
      to_email: orderData.email,
      from_name: 'SplitUp Team',
      reply_to: 'sru24012005@gmail.com',
      subscription_type: orderData.subscriptionType || 'Subscription',
      plan_type: orderData.planType || 'Plan',
      total_amount: orderData.totalAmount || '0',
      message: `Your ${orderData.subscriptionType} order has been confirmed. Amount: ₹${orderData.totalAmount}`
    };

    console.log('🔄 Sending order confirmation to:', orderData.email);

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID_ORDER,
      templateParams
    );

    console.log('✅ Order confirmation sent successfully');
    return response;
  } catch (error) {
    console.error('❌ Order confirmation failed:', error);
    return null; // Don't block order process
  }
};

/**
 * Send admin notification email
 */
export const sendAdminNotificationEmail = async (orderData) => {
  try {
    const templateParams = {
      name: 'Admin',
      email: 'sru24012005@gmail.com',
      to_name: 'Admin',
      to_email: 'sru24012005@gmail.com',
      from_name: 'SplitUp System',
      reply_to: 'sru24012005@gmail.com',
      customer_name: orderData.name,
      customer_email: orderData.email,
      subscription_type: orderData.subscriptionType,
      total_amount: orderData.totalAmount,
      message: `New order: ${orderData.name} - ${orderData.subscriptionType} - ₹${orderData.totalAmount}`
    };

    console.log('🔄 Sending admin notification');

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID_ORDER,
      templateParams
    );

    console.log('✅ Admin notification sent');
    return response;
  } catch (error) {
    console.error('❌ Admin notification failed:', error);
    return null; // Don't block user flow
  }
};
