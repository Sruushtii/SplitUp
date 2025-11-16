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

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

/**
 * Send welcome email to new users
 */
export const sendWelcomeEmail = async (userData) => {
  try {
    const templateParams = {
      name: userData.name || 'User',
      email: userData.email,
      to_name: userData.name || 'User',
      to_email: userData.email,
      from_name: 'Splitup',
      reply_to: 'info.splitup@gmail.com',
      message: `Welcome to SplitUp! Start saving money on your subscriptions today.`
    };
    console.log('Sending welcome email to:', userData.email, templateParams);
    console.log('[EmailJS] Sending welcome email:', {
      templateId: EMAILJS_TEMPLATE_ID_WELCOME,
      params: templateParams
    });
    try {
      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID_WELCOME,
        templateParams
      );
      console.log('Welcome email sent successfully', response);
      return response;
    } catch (err) {
      console.error('EmailJS send error:', err);
      throw err;
    }
  } catch (error) {
    console.error('Welcome email failed:', error);
    return null;
  }
};

/**
 * Send order confirmation email
 */
export const sendOrderConfirmationEmail = async (orderData) => {
  try {
    const templateParams = {
      name: orderData.name,
      email: orderData.email,
      to_name: orderData.name,
      to_email: orderData.email,
      from_name: 'Splitup',
      reply_to: 'info.splitup@gmail.com',
      subscription_type: orderData.subscriptionType || 'Subscription',
      plan_type: orderData.planType || 'Plan',
      total_amount: orderData.totalAmount || '0',
      message: `Your ${orderData.subscriptionType} order has been confirmed. Amount: ₹${orderData.totalAmount}`
    };
    console.log('Sending order confirmation to:', orderData.email);
    console.log('[EmailJS] Sending order confirmation email:', {
      templateId: EMAILJS_TEMPLATE_ID_ORDER,
      params: templateParams
    });
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID_ORDER,
      templateParams
    );
    console.log('Order confirmation sent successfully');
    return response;
  } catch (error) {
    console.error('Order confirmation failed:', error);
    return null;
  }
};
// Admin notification email removed as per new requirements.
