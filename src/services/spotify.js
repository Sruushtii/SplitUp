// =========================
// File: spotify.js
//
// SUMMARY:
// Contains Spotify subscription plan data for the SplitUp app.
// This is a simple data file that defines Spotify plans with prices.
//
// HOW IT WORKS:
// - Exports a JavaScript object with Spotify plan information
// - Each plan has a name and monthly price in Indian Rupees
// - Used by Plans.jsx to display Spotify subscription options
// - No logic or functions - just static data
//
// CONNECTIONS:
// - Used in Plans.jsx to show Spotify subscription options
// - Icon path points to /spotify.png in public folder
// =========================

// Spotify subscription service data
// This object contains all the information about Spotify plans that our app needs
const spotifyService = {
  // Unique identifier for Spotify service (used in database and code)
  id: 'spotify',
  
  // Logo image path (file is stored in public folder, accessible via URL)
  icon: '/spotify.png',
  
  // Array of available Spotify subscription plans with Indian pricing
  plans: [
    { 
      name: 'Individual', // Individual plan for one person
      price: 119          // Monthly price in Indian Rupees (₹119/month)
    },
    { 
      name: 'Duo',       // Duo plan for two people
      price: 149          // Monthly price in Indian Rupees (₹149/month)
    },
    { 
      name: 'Family',    // Family plan for up to 6 people
      price: 179          // Monthly price in Indian Rupees (₹179/month)
    }
  ]
};

// Export this service data for use in Plans.jsx and other components
// Plans.jsx imports this to show Spotify options to users
export default spotifyService;