# Email Integration Setup Guide

This guide explains how to set up and use the email functionality in SplitUp using Resend API.

## 📧 Features

The email system sends automated emails for:
1. **Welcome Email** - When a new user signs up (Google or Email/Password)
2. **Order Confirmation Email** - When a user places a subscription order
3. **Admin Notification Email** - When a new order is placed (sent to admin)

## 🚀 Setup Instructions

### Step 1: Get Resend API Key

1. Go to [Resend Dashboard](https://resend.com/dashboard)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the API key (starts with `re_`)

### Step 2: Verify Your Domain/Email

**Important:** Resend requires you to verify your sending domain or email address.

#### Option A: Use Resend's Test Domain (Development)
- For testing, you can use `onboarding@resend.dev` (already configured)
- This works immediately but has limitations

#### Option B: Verify Your Own Domain (Production)
1. Go to Resend Dashboard → Domains
2. Click "Add Domain"
3. Enter your domain (e.g., `splitup.com`)
4. Add the DNS records provided by Resend to your domain
5. Wait for verification (usually takes a few minutes)
6. Update `FROM_EMAIL` in `src/services/emailService.js`:
   ```javascript
   const FROM_EMAIL = 'noreply@yourdomain.com';
   ```

### Step 3: Configure Environment Variables

1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Add your Resend API key to `.env`:
   ```env
   # Firebase Configuration
   VITE_FIREBASE_API_KEY=AIzaSyDkaYijK6hGteSuEi2kZD7OYBKlVftDY-0
   VITE_FIREBASE_AUTH_DOMAIN=split-up-d77e1.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=split-up-d77e1
   VITE_FIREBASE_STORAGE_BUCKET=split-up-d77e1.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=118530154667
   VITE_FIREBASE_APP_ID=1:118530154667:web:e7785a297ffd665ffdd7ee
   VITE_FIREBASE_MEASUREMENT_ID=G-Q8SXEVFK3R

   # Resend API Configuration
   VITE_RESEND_API_KEY=re_Qt4rbQuP_3GGpL51PSpcLrDDF2vNzTjFi
   ```

3. **Important:** Never commit the `.env` file to Git. It's already in `.gitignore`.

### Step 4: Install Dependencies

The Resend package has already been installed. If you need to reinstall:

```bash
npm install resend
```

### Step 5: Update Email Templates (Optional)

You can customize the email templates in `src/services/emailService.js`:

- **Welcome Email**: `sendWelcomeEmail()` function
- **Order Confirmation**: `sendOrderConfirmationEmail()` function
- **Admin Notification**: `sendAdminNotificationEmail()` function

Update the following in the templates:
- Replace `https://your-domain.com` with your actual domain
- Customize colors, text, and branding
- Update admin email in `sendAdminNotificationEmail()`

## 📁 File Structure

```
src/
├── services/
│   ├── emailService.js       # Email service with Resend integration
│   └── firebase.js            # Firebase configuration
├── pages/
│   ├── auth/
│   │   └── LoginPage.jsx     # Sends welcome email on signup
│   └── Plans.jsx              # Sends order confirmation email
.env.example                   # Environment variables template
.env                          # Your actual environment variables (not in Git)
```

## 🔧 How It Works

### Welcome Email Flow

1. User signs up with Google or Email/Password
2. User data is saved to Firebase
3. `sendWelcomeEmail()` is called with user's email and name
4. Resend API sends a beautifully formatted HTML email
5. If email fails, error is logged but signup continues

### Order Confirmation Flow

1. User completes payment for a subscription
2. Order data is saved to Firestore
3. `sendOrderConfirmationEmail()` is called with order details
4. `sendAdminNotificationEmail()` is called to notify admin
5. Both emails are sent via Resend API
6. If emails fail, errors are logged but order is still saved

## 🎨 Email Templates

All emails are responsive HTML templates with:
- Modern design with gradients and colors
- Mobile-friendly layout
- Clear call-to-action buttons
- Professional branding
- Order/user details in formatted tables

## 🐛 Troubleshooting

### Email Not Sending

1. **Check API Key**: Verify your Resend API key is correct in `.env`
2. **Check Domain**: Ensure your sending domain is verified in Resend
3. **Check Console**: Look for error messages in browser console
4. **Check Resend Dashboard**: View email logs in Resend dashboard

### Common Errors

**Error: "Invalid API key"**
- Solution: Double-check your API key in `.env` file

**Error: "Domain not verified"**
- Solution: Verify your domain in Resend dashboard or use `onboarding@resend.dev` for testing

**Error: "Rate limit exceeded"**
- Solution: Resend has rate limits. Check your plan limits in dashboard

### Testing Emails

1. Sign up with a test email address
2. Check your inbox (and spam folder)
3. View email logs in Resend Dashboard → Emails
4. Check browser console for success/error messages

## 📊 Monitoring

### View Email Logs

1. Go to [Resend Dashboard](https://resend.com/emails)
2. View all sent emails with status
3. See delivery rates and errors
4. Debug failed emails

### Console Logs

The app logs email status to console:
- ✅ Success: "Welcome email sent to: user@example.com"
- ⚠️ Warning: "Failed to send welcome email: [error]"

## 🔒 Security Best Practices

1. **Never commit `.env` file** - It contains sensitive API keys
2. **Use environment variables** - Don't hardcode API keys
3. **Verify sender domain** - Prevents email spoofing
4. **Rate limiting** - Resend has built-in rate limits
5. **Error handling** - Emails fail gracefully without blocking user flow

## 🚀 Production Deployment

### Vercel Deployment

1. Add environment variables in Vercel dashboard:
   - Go to Project Settings → Environment Variables
   - Add `VITE_RESEND_API_KEY` with your API key
   - Add all Firebase variables

2. Redeploy your application

### Firebase Hosting

1. Set environment variables in your CI/CD pipeline
2. Or use Firebase Functions for server-side email sending (recommended for production)

## 📈 Resend Pricing

- **Free Tier**: 100 emails/day, 3,000 emails/month
- **Pro Plan**: $20/month for 50,000 emails/month
- Check [Resend Pricing](https://resend.com/pricing) for details

## 🎯 Next Steps

1. ✅ Set up Resend account and get API key
2. ✅ Add API key to `.env` file
3. ✅ Verify your domain (or use test domain)
4. ✅ Test signup flow and check email
5. ✅ Test order placement and check email
6. ✅ Customize email templates with your branding
7. ✅ Set up production environment variables

## 📞 Support

- **Resend Documentation**: https://resend.com/docs
- **Resend Support**: support@resend.com
- **SplitUp Issues**: Create an issue in the repository

---

**Happy Emailing! 📧**
