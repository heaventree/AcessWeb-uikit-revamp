/**
 * Main Entry Point
 * 
 * Initializes the React application with all required providers
 * and sets up accessibility features and security.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Find the root element
const rootElement = document.getElementById('root');

// Error if root element not found
if (!rootElement) {
  throw new Error('Root element not found. Please add an element with id "root" to your HTML file.');
}

// Create root and render app
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);