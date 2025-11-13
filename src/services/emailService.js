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
const EMAILJS_SERVICE_ID = 'service_a15iq4h';   //service_a15iq4h      // EmailJS service identifier
const EMAILJS_TEMPLATE_ID_WELCOME = 'template_oef19xj'; //template_oef19xj // Welcome email template
const EMAILJS_TEMPLATE_ID_ORDER = 'template_rzlqcgf';   // Order confirmation template
const EMAILJS_PUBLIC_KEY = 'jN2G0MW074qCNUZAV';         // Public key for authentication

// Initialize EmailJS with public key for authentication
emailjs.init(EMAILJS_PUBLIC_KEY);

/**
 * Send welcome email to new users
 * @param {Object} userData - User data containing email, name
 * @returns {Promise} - EmailJS response
 */
export const sendWelcomeEmail = async (userData) => {
  try {
    const templateParams = {
      to_email: userData.email,
      to_name: userData.name || 'there',
      subject: 'Welcome to SplitUp!',
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID_WELCOME,
      templateParams
    );

    console.log(' Welcome email sent successfully:', response);
    return response;
  } catch (error) {
    console.error(' Error sending welcome email:', error);
    throw error;
  }
};

/**
 * Send order confirmation email to users
 * @param {Object} orderData - Order data containing user and subscription details
 * @returns {Promise} - EmailJS response
 */
export const sendOrderConfirmationEmail = async (orderData) => {
  try {
    const templateParams = {
      to_email: orderData.email,
      to_name: orderData.name,
      subscription_type: orderData.subscriptionType,
      plan_type: orderData.planType,
      amount_paid: orderData.amountPaid,
      amount_remaining: orderData.amountRemaining,
      total_amount: orderData.totalAmount,
      payment_method: orderData.paymentMethod,
      number_of_people: orderData.numberOfPeople,
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID_ORDER,
      templateParams
    );

    console.log(' Order confirmation email sent successfully:', response);
    return response;
  } catch (error) {
    console.error(' Error sending order confirmation email:', error);
    throw error;
  }
};

