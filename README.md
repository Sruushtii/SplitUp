# SplitUp - Subscription Sharing Platform

SplitUp is a comprehensive subscription sharing platform that enables students and young professionals to share subscription costs for popular streaming services with up to 83% savings.

## 🚀 Features

- **Multi-Service Support**: Netflix, Spotify, Prime Video, JioHotstar, YouTube Premium, Canva Pro, Microsoft 365
- **Secure Payment Processing**: Cost splitting with automated group management
- **User Management**: Role-based access (User, Admin, Super Admin)
- **Admin Portal**: Complete order management and user analytics
- **Responsive Design**: Works seamlessly on all devices
- **Firebase Integration**: Authentication, Firestore database, and hosting

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - Modern React with hook
- **Vite 6.0.1** - Fast build tool and development server
- **Tailwind CSS 3.4.16** - Utility-first CSS framework
- **React Router 7.6.2** - Client-side routing
- **React Icons 5.5.0** - Icon library

### Backend & Services
- **Firebase 12.3.0** - Complete Backend-as-a-Service
  - Authentication (Google OAuth + Email/Password)
  - Firestore Database
  - Hosting

### Development Tools
- **ESLint 9.15.0** - Code linting
- **PostCSS 8.4.49** - CSS processing
- **Autoprefixer 10.4.20** - CSS vendor prefixes

## 📁 Project Structure

```
SplitUp/
├── public/                     # Static assets
│   ├── logo.png               # App logo
│   ├── netflix.png            # Service logos
│   ├── spotify.png
│   ├── primevideo.png
│   └── hotstar.webp
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── Footer.jsx         # Site footer
│   │   ├── HeroSection.jsx    # Landing page hero
│   │   ├── Marquee.jsx        # Testimonials carousel
│   │   └── Navbar.jsx         # Navigation bar
│   ├── pages/                 # Page components
│   │   ├── auth/
│   │   │   └── LoginPage.jsx  # Login/signup page
│   │   ├── AdminPortal.jsx    # Admin dashboard
│   │   ├── HomePage.jsx       # Landing page
│   │   ├── Orders.jsx         # User orders page
│   │   ├── Plans.jsx          # Subscription plans
│   │   └── UserDetailsForm.jsx # User info form
│   ├── services/              # Business logic & APIs
│   │   ├── firebase.js        # Firebase configuration
│   │   ├── netflix.js         # Netflix plans data
│   │   └── spotify.js         # Spotify plans data
│   ├── App.jsx               # Main app component
│   ├── main.jsx              # App entry point
│   └── index.css             # Global styles
├── .env                      # Environment variables
├── firebase.json             # Firebase configuration
├── firestore.rules           # Database security rules
├── package.json              # Dependencies
├── tailwind.config.js        # Tailwind configuration
├── vite.config.js            # Vite configuration
└── vercel.json               # Vercel deployment config
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase account

### 1. Clone the Repository
```bash
git clone <repository-url>
cd SplitUp
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory with your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

### 4. Firebase Setup
1. Create a new Firebase project
2. Enable Authentication (Google & Email/Password)
3. Create Firestore database
4. Deploy security rules: `firebase deploy --only firestore:rules`

### 5. Run Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
# Deploy to Vercel
```

### Firebase Hosting
```bash
npm run build
firebase deploy
```

## 🔐 Authentication & Security

### User Roles
- **Regular User**: Can view plans, place orders, manage their subscriptions
- **Admin**: Access to admin portal, can manage all orders and users
- **Super Admin**: Full system access

### Admin Access
- Email: `admin@gmail.com`
- Password: `admin`

### Security Features
- Firebase Authentication with Google OAuth
- Firestore security rules for data protection
- Environment variables for sensitive configuration
- Role-based access control

## 📊 Database Schema

### Users Collection
```javascript
{
  uid: "user-id",
  email: "user@example.com",
  displayName: "User Name",
  photoURL: "profile-image-url",
  createdAt: timestamp,
  lastLoginAt: timestamp
}
```

### Payments Collection
```javascript
{
  email: "user@example.com",
  subscriptionType: "Netflix",
  planName: "Premium",
  amount: 649,
  status: "pending", // pending, confirmed, cancelled
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## 🎯 Key Features Explained

### Subscription Plans (2025 Pricing)
- **Netflix**: Premium (₹649/month)
- **Spotify**: Premium (₹119/month)
- **Prime Video**: Monthly (₹299/month)
- **JioHotstar**: Premium Ad-Free (₹299/month)
- **YouTube Premium**: Family (₹299/month)
- **Canva Pro**: Pro Team (₹500/month)
- **Microsoft 365**: Family Annual (₹8,199/year or ₹684/month)

### Cost Splitting Algorithm
Users are automatically matched into groups to share subscription costs, providing up to 83% savings on individual plans.
- Custom user engagement metrics

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Code Style
- ESLint configuration for React
- Tailwind CSS for styling
- Component-based architecture
- Detailed code comments for maintainability

## 🐛 Troubleshooting

### Common Issues

1. **Firebase Connection Issues**
   - Verify environment variables
   - Check Firebase project configuration
   - Ensure services are enabled in Firebase Console

2. **Authentication Problems**
   - Check authorized domains in Firebase Console
   - Verify Google OAuth configuration
   - Clear browser cache and localStorage

3. **Build Errors**
   - Run `npm install` to ensure dependencies are installed
   - Check for TypeScript/ESLint errors
   - Verify all imports are correct

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team

---

**SplitUp** - Making subscriptions affordable for everyone! 🎉
