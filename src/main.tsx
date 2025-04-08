
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Add default values for development
if (import.meta.env.MODE === 'development' && !import.meta.env.VITE_SUPABASE_URL) {
  // In development, provide a warning but don't block rendering
  console.warn('Warning: Supabase environment variables not set. Using development defaults.');
  // You would set actual values in a .env file in production
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
