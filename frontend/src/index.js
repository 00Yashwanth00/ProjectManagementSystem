// frontend/src/index.js or frontend/src/App.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/global.css';
import './styles/variables.css';
import './styles/layout.css';
import App from './App';
import { AuthProvider } from './context/AuthContext/AuthContext';
import { NotificationProvider } from './context/NotificationContext/NotificationContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    {/* ✅ AuthProvider must be OUTSIDE NotificationProvider */}
    <AuthProvider>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </AuthProvider>
  </React.StrictMode>
);