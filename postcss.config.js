// =========================
// File: postcss.config.js
//
// SUMMARY:
// PostCSS configuration file that defines CSS processing plugins for the SplitUp project.
// PostCSS is a tool that transforms CSS with JavaScript plugins. This file tells PostCSS
// which plugins to use when processing our CSS files.
//
// WHAT IT DOES:
// - Configures Tailwind CSS to generate utility classes
// - Configures Autoprefixer to add vendor prefixes for browser compatibility
//
// WHY IT'S IMPORTANT:
// - Enables Tailwind CSS to work properly with Vite
// - Ensures CSS works across different browsers (Safari, Chrome, Firefox, etc.)
// - Processes CSS during build time for optimization
//
// HOW IT WORKS:
// - Vite automatically uses this config when processing CSS files
// - Tailwind plugin generates CSS from utility classes in our components
// - Autoprefixer adds -webkit-, -moz-, -ms- prefixes where needed
// =========================

export default {
  // PostCSS plugins that will process our CSS files
  plugins: {
    // Tailwind CSS plugin - generates utility classes like 'bg-blue-500', 'text-center'
    // Scans our HTML/JSX files for class names and generates only the CSS we actually use
    tailwindcss: {},
    
    // Autoprefixer plugin - adds vendor prefixes for cross-browser compatibility
    // Example: 'display: flex' becomes 'display: -webkit-flex; display: flex;'
    autoprefixer: {},
  },
}
  