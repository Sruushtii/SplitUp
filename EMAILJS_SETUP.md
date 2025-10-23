# EmailJS Setup Guide - Easy Email Solution

EmailJS is much simpler than Resend - **no domain verification needed!**

## 🚀 Quick Setup (5 minutes)

### Step 1: Create EmailJS Account

1. Go to [EmailJS Dashboard](https://dashboard.emailjs.com/sign-up)
2. Sign up with Google or Email
3. Verify your email

### Step 2: Connect Your Email Service

1. Go to **Email Services** → **Add New Service**
2. Choose your email provider:
   - **Gmail** (Recommended - easiest)
   - Outlook
   - Yahoo
   - Or any SMTP
3. Click **Connect Account** and authorize
4. Copy your **Service ID** (e.g., `service_abc123`)

### Step 3: Create Email Templates

#### Welcome Email Template:
1. Go to **Email Templates** → **Create New Template**
2. **Template Name:** `Welcome Email`
3. **Subject:** `Welcome to SplitUp - {{to_name}}!`
4. **Template Content (HTML):**
   ```html
   <!DOCTYPE html>
   <html>
   <head>
     <meta charset="utf-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
   </head>
   <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc;">
     <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
       <tr>
         <td align="center">
           <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 24px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); overflow: hidden;">
             
             <!-- Header -->
             <tr>
               <td style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 48px 32px; text-align: center;">
                 <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 600; letter-spacing: -0.5px;">Welcome to SplitUp</h1>
               </td>
             </tr>
             
             <!-- Content -->
             <tr>
               <td style="padding: 48px 32px;">
                 <h2 style="margin: 0 0 16px; color: #1e293b; font-size: 24px; font-weight: 500;">Hi {{to_name}}! 👋</h2>
                 <p style="margin: 0 0 24px; color: #64748b; font-size: 16px; line-height: 1.6;">
                   Welcome to SplitUp - the smart way to share subscription costs with friends and save money!
                 </p>
                 <p style="margin: 0 0 32px; color: #64748b; font-size: 16px; line-height: 1.6;">
                   You're now part of a community saving up to <strong style="color: #2563eb;">83%</strong> on premium subscriptions like Netflix, Spotify, Prime Video, and more.
                 </p>
                 
                 <!-- CTA Button -->
                 <div style="text-align: center; margin: 40px 0;">
                   <a href="https://split-up-blond.vercel.app/plans" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-weight: 500; font-size: 16px; box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);">
                     Explore Plans
                   </a>
                 </div>
                 
                 <p style="margin: 32px 0 0; color: #94a3b8; font-size: 14px; line-height: 1.6;">
                   Need help? Just reply to this email and we'll be happy to assist you.
                 </p>
               </td>
             </tr>
             
             <!-- Footer -->
             <tr>
               <td style="background-color: #f8fafc; padding: 32px; text-align: center; border-top: 1px solid #e2e8f0;">
                 <p style="margin: 0 0 8px; color: #94a3b8; font-size: 14px;">© 2025 SplitUp. All rights reserved.</p>
                 <p style="margin: 0; color: #cbd5e1; font-size: 13px;">Proudly incubated at VIT Pune</p>
               </td>
             </tr>
             
           </table>
         </td>
       </tr>
     </table>
   </body>
   </html>
   ```
5. Save and copy **Template ID** (e.g., `template_xyz789`)

#### Order Confirmation Template:
1. Create another template
2. **Template Name:** `Order Confirmation`
3. **Subject:** `Order Confirmed - {{subscription_type}}`
4. **Template Content (HTML):**
   ```html
   <!DOCTYPE html>
   <html>
   <head>
     <meta charset="utf-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
   </head>
   <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc;">
     <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
       <tr>
         <td align="center">
           <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 24px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); overflow: hidden;">
             
             <!-- Header -->
             <tr>
               <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 48px 32px; text-align: center;">
                 <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 600; letter-spacing: -0.5px;">Order Confirmed! 🎉</h1>
               </td>
             </tr>
             
             <!-- Content -->
             <tr>
               <td style="padding: 48px 32px;">
                 <h2 style="margin: 0 0 16px; color: #1e293b; font-size: 24px; font-weight: 500;">Hi {{to_name}}!</h2>
                 <p style="margin: 0 0 32px; color: #64748b; font-size: 16px; line-height: 1.6;">
                   Your subscription order has been confirmed. We're now matching you with other members to complete your group.
                 </p>
                 
                 <!-- Order Details Card -->
                 <div style="background-color: #f8fafc; border-radius: 16px; padding: 32px; margin: 32px 0;">
                   <h3 style="margin: 0 0 24px; color: #1e293b; font-size: 18px; font-weight: 600;">Order Details</h3>
                   
                   <table width="100%" cellpadding="8" cellspacing="0">
                     <tr>
                       <td style="color: #64748b; font-size: 15px; padding: 8px 0;">Subscription</td>
                       <td style="color: #1e293b; font-size: 15px; font-weight: 500; text-align: right; padding: 8px 0;">{{subscription_type}}</td>
                     </tr>
                     <tr>
                       <td style="color: #64748b; font-size: 15px; padding: 8px 0;">Plan</td>
                       <td style="color: #1e293b; font-size: 15px; font-weight: 500; text-align: right; padding: 8px 0;">{{plan_type}}</td>
                     </tr>
                     <tr>
                       <td style="color: #64748b; font-size: 15px; padding: 8px 0;">Group Size</td>
                       <td style="color: #1e293b; font-size: 15px; font-weight: 500; text-align: right; padding: 8px 0;">{{number_of_people}} people</td>
                     </tr>
                     <tr>
                       <td style="color: #64748b; font-size: 15px; padding: 8px 0;">Payment Method</td>
                       <td style="color: #1e293b; font-size: 15px; font-weight: 500; text-align: right; padding: 8px 0;">{{payment_method}}</td>
                     </tr>
                     <tr style="border-top: 2px solid #e2e8f0;">
                       <td style="color: #64748b; font-size: 15px; padding: 16px 0 8px;">Amount Paid</td>
                       <td style="color: #10b981; font-size: 17px; font-weight: 600; text-align: right; padding: 16px 0 8px;">₹{{amount_paid}}</td>
                     </tr>
                     <tr>
                       <td style="color: #64748b; font-size: 15px; padding: 8px 0;">Remaining</td>
                       <td style="color: #f59e0b; font-size: 15px; font-weight: 500; text-align: right; padding: 8px 0;">₹{{amount_remaining}}</td>
                     </tr>
                     <tr style="border-top: 2px solid #e2e8f0;">
                       <td style="color: #1e293b; font-size: 16px; font-weight: 600; padding: 16px 0 0;">Total Amount</td>
                       <td style="color: #1e293b; font-size: 18px; font-weight: 700; text-align: right; padding: 16px 0 0;">₹{{total_amount}}</td>
                     </tr>
                   </table>
                 </div>
                 
                 <!-- Next Steps -->
                 <div style="background-color: #dbeafe; border-left: 4px solid #2563eb; border-radius: 12px; padding: 24px; margin: 32px 0;">
                   <h4 style="margin: 0 0 12px; color: #1e40af; font-size: 16px; font-weight: 600;">📋 What's Next?</h4>
                   <ul style="margin: 0; padding-left: 20px; color: #1e40af; font-size: 14px; line-height: 1.8;">
                     <li>We'll match you with other members</li>
                     <li>You'll receive login credentials once ready</li>
                     <li>Final payment will be collected before activation</li>
                     <li>Start enjoying your subscription!</li>
                   </ul>
                 </div>
                 
                 <!-- CTA Button -->
                 <div style="text-align: center; margin: 40px 0 32px;">
                   <a href="https://split-up-blond.vercel.app/orders" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-weight: 500; font-size: 16px; box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);">
                     View My Orders
                   </a>
                 </div>
                 
                 <p style="margin: 0; color: #94a3b8; font-size: 14px; line-height: 1.6; text-align: center;">
                   Questions? Reply to this email and we'll help you out!
                 </p>
               </td>
             </tr>
             
             <!-- Footer -->
             <tr>
               <td style="background-color: #f8fafc; padding: 32px; text-align: center; border-top: 1px solid #e2e8f0;">
                 <p style="margin: 0 0 8px; color: #94a3b8; font-size: 14px;">© 2025 SplitUp. All rights reserved.</p>
                 <p style="margin: 0; color: #cbd5e1; font-size: 13px;">Proudly incubated at VIT Pune</p>
               </td>
             </tr>
             
           </table>
         </td>
       </tr>
     </table>
   </body>
   </html>
   ```
5. Save and copy **Template ID**

### Step 4: Get Your Public Key

1. Go to **Account** → **General**
2. Copy your **Public Key** (e.g., `abc123XYZ`)

### Step 5: Update Your Code

Open `src/services/emailService.js` and replace:

```javascript
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID'; // From Step 2
const EMAILJS_TEMPLATE_ID_WELCOME = 'YOUR_WELCOME_TEMPLATE_ID'; // From Step 3
const EMAILJS_TEMPLATE_ID_ORDER = 'YOUR_ORDER_TEMPLATE_ID'; // From Step 3
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY'; // From Step 4
```

### Step 6: Push and Deploy

```bash
git add .
git commit -m "Switch to EmailJS for easier email implementation"
git push origin main
```

Vercel will auto-deploy!

## ✅ Benefits of EmailJS

- ✅ **No domain verification** - works immediately
- ✅ **Free tier:** 200 emails/month
- ✅ **Uses your Gmail** - emails come from your actual email
- ✅ **No serverless function** - works directly from browser
- ✅ **Simple setup** - 5 minutes total
- ✅ **Better deliverability** - uses established email providers

## 📧 How It Works

1. User signs up → EmailJS sends email via your Gmail
2. User places order → EmailJS sends confirmation via your Gmail
3. All emails appear in your Gmail "Sent" folder
4. Recipients see emails from your Gmail address

## 🎯 Testing

1. Complete setup above
2. Sign up with any email address
3. Check inbox - email should arrive in 5-10 seconds
4. Check your Gmail "Sent" folder - you'll see the sent email

## 🔒 Security

- Public key is safe to expose (it's meant to be public)
- EmailJS handles rate limiting
- No sensitive data in frontend code

## 📊 Free Tier Limits

- **200 emails/month** - perfect for MVP
- Upgrade to paid plan for more: $15/month for 1000 emails

## 💡 Pro Tips

1. **Use Gmail** - Most reliable and easiest to set up
2. **Customize templates** - Add HTML for beautiful emails
3. **Test first** - Send test email from EmailJS dashboard
4. **Monitor usage** - Check dashboard for email count

---

**That's it! Much easier than Resend! 🎉**
