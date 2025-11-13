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
