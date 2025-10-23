// Email service using EmailJS - No domain verification needed!
import emailjs from '@emailjs/browser';

// EmailJS Configuration
// Get these from: https://dashboard.emailjs.com/
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID_WELCOME = 'YOUR_WELCOME_TEMPLATE_ID';
const EMAILJS_TEMPLATE_ID_ORDER = 'YOUR_ORDER_TEMPLATE_ID';
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';

// Initialize EmailJS
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

    console.log('✅ Welcome email sent successfully:', response);
    return response;
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
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

    console.log('✅ Order confirmation email sent successfully:', response);
    return response;
  } catch (error) {
    console.error('❌ Error sending order confirmation email:', error);
    throw error;
  }
};

/**
 * Send admin notification email when new order is placed
 * @param {Object} orderData - Order data
 * @returns {Promise} - EmailJS response
 */
export const sendAdminNotificationEmail = async (orderData) => {
  try {
    const templateParams = {
      to_email: 'admin@gmail.com',
      customer_name: orderData.name,
      customer_email: orderData.email,
      subscription_type: orderData.subscriptionType,
      plan_type: orderData.planType,
      total_amount: orderData.totalAmount,
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID_ORDER,
      templateParams
    );

    console.log('✅ Admin notification email sent successfully:', response);
    return response;
  } catch (error) {
    console.error('❌ Error sending admin notification email:', error);
    // Don't throw error for admin notifications - it shouldn't block user flow
    return null;
  }
};
