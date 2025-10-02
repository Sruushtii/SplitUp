// =========================
// File: vite.config.js
//
// SUMMARY:
// Vite configuration file that tells Vite how to build and serve our React app.
// Vite is a fast build tool that replaces Create React App with better performance.
// This file enables React support and sets up the development server.
//
// HOW IT WORKS:
// - Vite reads this file when starting dev server or building for production
// - The React plugin enables JSX compilation and Fast Refresh (hot reload)
// - Default settings work well for most React apps
//
// CONNECTIONS:
// - Used by 'npm run dev' and 'npm run build' commands
// - Works with package.json scripts
// - Integrates with Tailwind CSS and PostCSS
// =========================

// Import Vite's configuration function
import { defineConfig } from 'vite'
// Import the React plugin that enables React support in Vite
import react from '@vitejs/plugin-react'

// Official Vite documentation: https://vite.dev/config/
// Export the Vite configuration object
export default defineConfig({
  // Array of plugins that extend Vite's functionality
  plugins: [
    react(), // Enables React JSX compilation and Fast Refresh (hot reload)
  ],
  // Additional configuration options can be added here:
  // - server: { port: 3000 } // Custom development server port
  // - build: { outDir: 'build' } // Custom build output directory
  // - base: '/my-app/' // Base URL for deployment
})
