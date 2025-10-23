import { Resend } from 'resend';

const resend = new Resend('re_Qt4rbQuP_3GGpL51PSpcLrDDF2vNzTjFi');

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { type, data } = req.body;

    let emailData;
    const FROM_EMAIL = 'onboarding@resend.dev';

    switch (type) {
      case 'welcome':
        emailData = {
          from: FROM_EMAIL,
          to: data.email,
          subject: '🎉 Welcome to SplitUp - Start Saving on Subscriptions!',
          html: `
            <!DOCTYPE html>
            <html>
              <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8fafc;">
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
                            <h2 style="margin: 0 0 16px; color: #1e293b; font-size: 22px;">Hi ${data.name || 'there'}! 👋</h2>
                            <p style="margin: 0 0 20px; color: #475569; font-size: 16px; line-height: 1.6;">
                              Thank you for joining SplitUp - the smart way to share subscription costs!
                            </p>
                            <div style="text-align: center; margin: 32px 0;">
                              <a href="https://split-up-blond.vercel.app/plans" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600;">
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
          `,
        };
        break;

      case 'order':
        emailData = {
          from: FROM_EMAIL,
          to: data.email,
          subject: `✅ Order Confirmed - ${data.subscriptionType} ${data.planType}`,
          html: `
            <!DOCTYPE html>
            <html>
              <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8fafc;">
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
                            <h2 style="margin: 0 0 16px; color: #1e293b; font-size: 22px;">Hi ${data.name}! 🎉</h2>
                            <p style="margin: 0 0 20px; color: #475569; font-size: 16px;">Your subscription order has been confirmed!</p>
                            <div style="background-color: #f1f5f9; border-radius: 12px; padding: 24px; margin: 24px 0;">
                              <h3 style="margin: 0 0 16px; color: #1e293b; font-size: 18px;">Order Details</h3>
                              <p style="margin: 8px 0;"><strong>Subscription:</strong> ${data.subscriptionType}</p>
                              <p style="margin: 8px 0;"><strong>Plan:</strong> ${data.planType}</p>
                              <p style="margin: 8px 0;"><strong>Group Size:</strong> ${data.numberOfPeople}</p>
                              <p style="margin: 8px 0;"><strong>Amount Paid:</strong> ₹${data.amountPaid}</p>
                              <p style="margin: 8px 0;"><strong>Remaining:</strong> ₹${data.amountRemaining}</p>
                              <p style="margin: 8px 0;"><strong>Total:</strong> ₹${data.totalAmount}</p>
                            </div>
                            <div style="text-align: center; margin: 32px 0;">
                              <a href="https://split-up-blond.vercel.app/orders" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600;">
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
          `,
        };
        break;

      case 'admin':
        emailData = {
          from: FROM_EMAIL,
          to: 'admin@gmail.com',
          subject: `🔔 New Order: ${data.subscriptionType} - ${data.name}`,
          html: `
            <!DOCTYPE html>
            <html>
              <body style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>🔔 New Order Received</h2>
                <p><strong>Customer:</strong> ${data.name}</p>
                <p><strong>Email:</strong> ${data.email}</p>
                <p><strong>Subscription:</strong> ${data.subscriptionType} - ${data.planType}</p>
                <p><strong>Total Amount:</strong> ₹${data.totalAmount}</p>
              </body>
            </html>
          `,
        };
        break;

      default:
        return res.status(400).json({ error: 'Invalid email type' });
    }

    const response = await resend.emails.send(emailData);
    console.log('✅ Email sent successfully:', response);
    return res.status(200).json({ success: true, data: response });

  } catch (error) {
    console.error('❌ Error sending email:', error);
    return res.status(500).json({ error: error.message, details: error });
  }
}
