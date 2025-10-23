// Email service - calls serverless API to send emails
// This avoids exposing API keys in the browser

const API_ENDPOINT = '/api/send-email';

/**
 * Send welcome email to new users
 * @param {Object} userData - User data containing email, name
 * @returns {Promise} - API response
 */
export const sendWelcomeEmail = async (userData) => {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'welcome',
        data: userData,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Welcome email sent successfully:', result);
    return result;
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    throw error;
  }
};

/**
 * Send order confirmation email to users
 * @param {Object} orderData - Order data containing user and subscription details
 * @returns {Promise} - API response
 */
export const sendOrderConfirmationEmail = async (orderData) => {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'order',
        data: orderData,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Order confirmation email sent successfully:', result);
    return result;
  } catch (error) {
    console.error('❌ Error sending order confirmation email:', error);
    throw error;
  }
};

/**
 * Send admin notification email when new order is placed
 * @param {Object} orderData - Order data
 * @returns {Promise} - API response
 */
export const sendAdminNotificationEmail = async (orderData) => {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'admin',
        data: orderData,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Admin notification email sent successfully:', result);
    return result;
  } catch (error) {
    console.error('❌ Error sending admin notification email:', error);
    // Don't throw error for admin notifications - it shouldn't block user flow
    return null;
  }
};
