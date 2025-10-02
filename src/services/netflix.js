// =========================
// File: netflix.js
//
// SUMMARY:
// Contains Netflix subscription plan data for the SplitUp app.
// This is a simple data file that defines Netflix plans with prices.
//
// HOW IT WORKS:
// - Exports a JavaScript object with Netflix plan information
// - Each plan has a name and monthly price in Indian Rupees
// - Used by Plans.jsx to display Netflix subscription options
// - No logic or functions - just static data
//
// CONNECTIONS:
// - Used in Plans.jsx to show Netflix subscription options
// - Icon path points to /netflix.png in public folder
// =========================

// Netflix subscription service data
// This object contains all the information about Netflix plans that our app needs
const netflixService = {
  // Unique identifier for Netflix service (used in database and code)
  id: 'netflix',
  
  // Logo image path (file is stored in public folder, accessible via URL)
  icon: '/netflix.png',
  
  // Array of available Netflix subscription plans with Indian pricing
  plans: [
    { 
      name: 'Basic',    // Plan name displayed to users
      price: 199        // Monthly price in Indian Rupees (₹199/month)
    },
    { 
      name: 'Standard', // Standard plan with better quality
      price: 499        // Monthly price in Indian Rupees (₹499/month)
    },
    { 
      name: 'Premium',  // Premium plan with highest quality and multiple screens
      price: 649        // Monthly price in Indian Rupees (₹649/month)
    }
  ]
};

// Export this service data for use in Plans.jsx and other components
// Plans.jsx imports this to show Netflix options to users
export default netflixService; 