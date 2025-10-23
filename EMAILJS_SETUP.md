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
3. **Template Content:**
   ```
   Subject: Welcome to SplitUp - {{to_name}}!
   
   Hi {{to_name}}!
   
   Welcome to SplitUp - the smart way to share subscription costs!
   
   You're now part of a community saving up to 83% on premium subscriptions.
   
   Start exploring our plans and join a group today!
   
   Best regards,
   SplitUp Team
   ```
4. Save and copy **Template ID** (e.g., `template_xyz789`)

#### Order Confirmation Template:
1. Create another template
2. **Template Name:** `Order Confirmation`
3. **Template Content:**
   ```
   Subject: Order Confirmed - {{subscription_type}}
   
   Hi {{to_name}}!
   
   Your order has been confirmed! 🎉
   
   Order Details:
   - Subscription: {{subscription_type}}
   - Plan: {{plan_type}}
   - Group Size: {{number_of_people}}
   - Amount Paid: ₹{{amount_paid}}
   - Remaining: ₹{{amount_remaining}}
   - Total: ₹{{total_amount}}
   - Payment Method: {{payment_method}}
   
   We're matching you with a group now. You'll receive login credentials soon!
   
   Best regards,
   SplitUp Team
   ```
4. Save and copy **Template ID**

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
