import React from 'react'; // Recommended but optional for newer React versions
import ReactDOM from 'react-dom/client'; // Give access to the newer React 18 root API (createRoot) which replaces the older ReactDOM.render method
import './styles/index.css';
import App from './pages/App';

// React app will mount at <div id="root"></div> in index.html.
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // A wrapper for safer dev that activates extra checks and warnings
  // for potential problems but gets automatically removed when app built (production).
  <React.StrictMode>
    // Render React app inside root.
    <App />
  </React.StrictMode>
);