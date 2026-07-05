import React from 'react';
import { useAuth } from '../../context/AuthContext/AuthContext';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

/**
 * MainLayout Component
 * Wraps all authenticated pages with persistent shell (Navbar + Sidebar + Footer)
 */
const MainLayout = ({ children }) => {
  const { isAuthenticated } = useAuth();

  // For unauthenticated users, show only content without sidebar
  if (!isAuthenticated) {
    return (
      <div className="app">
        <Navbar />
        <main className="app-main" style={{ padding: 'var(--spacing-4)' }}>
          {children}
        </main>
        <Footer />
      </div>
    );
  }

  // For authenticated users, show full layout with sidebar
  return (
    <div className="app">
      <Navbar />
      <div style={{
        display: 'flex',
        flex: 1,
        minHeight: 'calc(100vh - 128px)', // Adjust for navbar + footer
      }}>
        <Sidebar />
        <main style={{
          flex: 1,
          backgroundColor: 'var(--color-gray-50)',
          overflowY: 'auto',
        }}>
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;