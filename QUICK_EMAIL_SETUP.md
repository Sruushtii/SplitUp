# Quick Email Setup Guide

## ✅ What's Done

1. ✅ Resend package installed
2. ✅ Serverless API created at `/api/send-email.js`
3. ✅ Email service updated to call API
4. ✅ Integrated in signup and order flows
5. ✅ `.env.example` has your API keys

## 🚀 To Make Emails Work

### Step 1: Copy Environment Variables
```bash
cp .env.example .env
```

### Step 2: Deploy to Vercel

**Why?** The email API needs to run on a server (not in browser). Vercel provides serverless functions for this.

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

### Step 3: Add Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Settings → Environment Variables
3. Add these variables:
   - `VITE_RESEND_API_KEY` = `re_Qt4rbQuP_3GGpL51PSpcLrDDF2vNzTjFi`
   - Add all Firebase variables from `.env.example`

### Step 4: Redeploy
```bash
vercel --prod
```

## 📧 When Emails Are Sent

1. **Welcome Email** → When user signs up (Google or Email/Password)
2. **Order Confirmation** → When user places an order
3. **Admin Notification** → When new order is placed

## 🧪 Testing Locally (Optional)

For local testing, you can use Vercel Dev:

```bash
vercel dev
```

This runs the serverless functions locally at `http://localhost:3000`

## ⚠️ Important Notes

- **Browser can't send emails directly** - That's why we need the serverless API
- **API key stays secure** - It's only on the server, never exposed to browser
- **Resend domain** - Currently using `onboarding@resend.dev` (test domain)
- **Production** - Verify your own domain in Resend dashboard for production

## 🎯 Quick Test

After deployment:
1. Sign up with a new email
2. Check your inbox for welcome email
3. Place an order
4. Check inbox for order confirmation

## 📞 Troubleshooting

**Emails not sending?**
- Check Vercel deployment logs
- Verify environment variables are set in Vercel
- Check Resend dashboard for delivery status

**API endpoint not found?**
- Make sure you deployed to Vercel
- Check `vercel.json` is configured correctly
- API functions only work on Vercel, not local dev server (unless using `vercel dev`)

---

**Ready to go! Deploy to Vercel and emails will work! 🚀**
