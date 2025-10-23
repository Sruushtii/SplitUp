// Serverless function to send emails via Resend API
// This runs on the server, not in the browser
import { Resend } from 'resend';

const resend = new Resend('re_Qt4rbQuP_3GGpL51PSpcLrDDF2vNzTjFi');
const FROM_EMAIL = 'onboarding@resend.dev';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { type, data } = req.body;

    let emailData;

    // Handle different email types
    switch (type) {
      case 'welcome':
        emailData = {
          from: FROM_EMAIL,
          to: data.email,
          subject: '🎉 Welcome to SplitUp - Start Saving on Subscriptions!',
          html: generateWelcomeEmailHTML(data),
        };
        break;

      case 'order':
        emailData = {
          from: FROM_EMAIL,
          to: data.email,
          subject: `✅ Order Confirmed - ${data.subscriptionType} ${data.planType}`,
          html: generateOrderEmailHTML(data),
        };
        break;

      case 'admin':
        emailData = {
          from: FROM_EMAIL,
          to: 'admin@gmail.com',
          subject: `🔔 New Order: ${data.subscriptionType} - ${data.name}`,
          html: generateAdminEmailHTML(data),
        };
        break;

      default:
        return res.status(400).json({ error: 'Invalid email type' });
    }

    // Send email via Resend
    const response = await resend.emails.send(emailData);
    
    console.log('✅ Email sent successfully:', response);
    return res.status(200).json({ success: true, data: response });

  } catch (error) {
    console.error('❌ Error sending email:', error);
    return res.status(500).json({ error: error.message });
  }
}

// Email HTML templates
function generateWelcomeEmailHTML(data) {
  const { name } = data;
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <tr>
                  <td style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 40px 30px; text-align: center; border-radius: 16px 16px 0 0;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">Welcome to SplitUp!</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="margin: 0 0 16px; color: #1e293b; font-size: 22px;">Hi ${name || 'there'}! 👋</h2>
                    <p style="margin: 0 0 20px; color: #475569; font-size: 16px; line-height: 1.6;">
                      Thank you for joining SplitUp - the smart way to share subscription costs!
                    </p>
                    <div style="text-align: center; margin: 32px 0;">
                      <a href="https://your-domain.com/plans" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600;">
                        Explore Plans
                      </a>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                    <p style="margin: 0; color: #94a3b8; font-size: 13px;">© ${new Date().getFullYear()} SplitUp. All rights reserved.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

function generateOrderEmailHTML(data) {
  const { name, subscriptionType, planType, amountPaid, amountRemaining, totalAmount, paymentMethod, numberOfPeople } = data;
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <tr>
                  <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 30px; text-align: center; border-radius: 16px 16px 0 0;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">Order Confirmed!</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="margin: 0 0 16px; color: #1e293b; font-size: 22px;">Hi ${name}! 🎉</h2>
                    <p style="margin: 0 0 20px; color: #475569; font-size: 16px; line-height: 1.6;">
                      Your subscription order has been confirmed!
                    </p>
                    <div style="background-color: #f1f5f9; border-radius: 12px; padding: 24px; margin: 24px 0;">
                      <h3 style="margin: 0 0 16px; color: #1e293b; font-size: 18px;">Order Details</h3>
                      <table width="100%" cellpadding="8">
                        <tr>
                          <td style="color: #64748b; font-size: 14px;">Subscription</td>
                          <td style="color: #1e293b; font-size: 14px; font-weight: 600; text-align: right;">${subscriptionType}</td>
                        </tr>
                        <tr>
                          <td style="color: #64748b; font-size: 14px;">Plan</td>
                          <td style="color: #1e293b; font-size: 14px; font-weight: 600; text-align: right;">${planType}</td>
                        </tr>
                        <tr>
                          <td style="color: #64748b; font-size: 14px;">Group Size</td>
                          <td style="color: #1e293b; font-size: 14px; font-weight: 600; text-align: right;">${numberOfPeople}</td>
                        </tr>
                        <tr>
                          <td style="color: #64748b; font-size: 14px;">Payment Method</td>
                          <td style="color: #1e293b; font-size: 14px; font-weight: 600; text-align: right;">${paymentMethod}</td>
                        </tr>
                        <tr style="border-top: 2px solid #e2e8f0;">
                          <td style="color: #64748b; font-size: 14px; padding-top: 12px;">Amount Paid</td>
                          <td style="color: #10b981; font-size: 16px; font-weight: 700; text-align: right; padding-top: 12px;">₹${amountPaid}</td>
                        </tr>
                        <tr>
                          <td style="color: #64748b; font-size: 14px;">Remaining</td>
                          <td style="color: #f59e0b; font-size: 14px; font-weight: 600; text-align: right;">₹${amountRemaining}</td>
                        </tr>
                        <tr style="border-top: 2px solid #e2e8f0;">
                          <td style="color: #1e293b; font-size: 16px; font-weight: 600; padding-top: 12px;">Total</td>
                          <td style="color: #1e293b; font-size: 18px; font-weight: 700; text-align: right; padding-top: 12px;">₹${totalAmount}</td>
                        </tr>
                      </table>
                    </div>
                    <div style="text-align: center; margin: 32px 0;">
                      <a href="https://your-domain.com/orders" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600;">
                        View My Orders
                      </a>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                    <p style="margin: 0; color: #94a3b8; font-size: 13px;">© ${new Date().getFullYear()} SplitUp. All rights reserved.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

function generateAdminEmailHTML(data) {
  const { name, email, subscriptionType, planType, totalAmount } = data;
  return `
    <!DOCTYPE html>
    <html>
      <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 8px;">
          <h2 style="color: #2563eb;">🔔 New Order Received</h2>
          <p><strong>Customer:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subscription:</strong> ${subscriptionType} - ${planType}</p>
          <p><strong>Total Amount:</strong> ₹${totalAmount}</p>
        </div>
      </body>
    </html>
  `;
}
