// =========================
// File: main.jsx
//
// SUMMARY:
// This is the entry point for the React app. It renders the App component into the root HTML element. It also imports the global CSS styles. This file is the first code that runs in the browser and connects the React app to the HTML page.
//
// CONNECTIONS:
// - Imports App.jsx (the main app component)
// - Imports index.css for global styles
// - Uses React 18's createRoot API for rendering
// =========================

import { StrictMode } from 'react'; // Import StrictMode for highlighting potential problems
import { createRoot } from 'react-dom/client'; // Import createRoot for React 18 rendering
import './index.css'; // Import global CSS (Tailwind and custom styles)
import App from './App.jsx'; // Import the main App component

// Find the root HTML element and render the App inside it
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
