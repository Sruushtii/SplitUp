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
      to_name: userData.name || 'User',
      to_email: userData.email,
      from_name: 'Splitup',
      reply_to: 'info.splitup@gmail.com',
    };
    console.log('[EmailJS] Welcome:', {templateId: EMAILJS_TEMPLATE_ID_WELCOME, params: templateParams});
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
      to_name: orderData.name,
      to_email: orderData.email,
      email: orderData.email, // Ensure 'email' is set for recipient
      subscription_type: orderData.subscriptionType || '',
      plan_type: orderData.planType || '',
      number_of_people: orderData.numberOfPeople || '',
      payment_method: orderData.paymentMethod || '',
      amount_paid: orderData.amountPaid || '',
      amount_remaining: orderData.amountRemaining || '',
      total_amount: orderData.totalAmount || '',
      from_name: 'Splitup',
      reply_to: 'info.splitup@gmail.com',
    };
    console.log('[EmailJS] Confirmation:', {templateId: EMAILJS_TEMPLATE_ID_ORDER, params: templateParams});
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
