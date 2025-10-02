// =========================
// File: tailwind.config.js
//
// SUMMARY:
// Tailwind CSS configuration file that customizes the default Tailwind setup.
// Defines which files to scan for CSS classes, custom fonts, animations, and plugins.
// This file tells Tailwind how to generate the CSS for our SplitUp app.
//
// HOW IT WORKS:
// - Tailwind scans files in 'content' array for class names like 'bg-blue-500'
// - Generates CSS only for classes that are actually used (smaller file size)
// - Custom theme extensions add new utilities beyond Tailwind defaults
//
// CONNECTIONS:
// - Used by PostCSS to process CSS (see postcss.config.js)
// - Imported in src/index.css with @tailwind directives
// - Works with Vite build process
// =========================

/** @type {import('tailwindcss').Config} */
// TypeScript type annotation for better IDE support and error checking
export default {
  // Files that Tailwind should scan for CSS class names
  content: [
    "./index.html",                    // Main HTML file
    "./src/**/*.{js,ts,jsx,tsx}",     // All JavaScript/TypeScript/React files in src folder
  ],
  
  // Theme customization and extensions
  theme: {
    extend: {
      // Custom font family configuration
      fontFamily: {
        // Override default sans-serif font stack with Inter font
        sans: [
          'Inter',                    // Primary font (loaded from Google Fonts)
          '-apple-system',            // macOS system font
          'BlinkMacSystemFont',       // macOS system font (older versions)
          'Segoe UI',                 // Windows system font
          'Roboto',                   // Android system font
          'Oxygen',                   // KDE system font
          'Ubuntu',                   // Ubuntu system font
          'Cantarell',                // GNOME system font
          'Open Sans',                // Fallback web font
          'Helvetica Neue',           // macOS fallback
          'sans-serif'                // Generic fallback
        ],
      },
      
      // Custom animations for the app
      animation: {
        // Slow marquee animation for testimonials carousel
        'marquee-slow': 'marquee 25s linear infinite',
      },
      
      // Keyframe definitions for custom animations
      keyframes: {
        // Marquee animation that moves content from right to left
        marquee: {
          '0%': { transform: 'translateX(0%)' },     // Start at normal position
          '100%': { transform: 'translateX(-50%)' }, // End at 50% left (creates seamless loop)
        }
      }
    },
  },
  
  // Additional Tailwind plugins (none used in this project)
  plugins: [],
};