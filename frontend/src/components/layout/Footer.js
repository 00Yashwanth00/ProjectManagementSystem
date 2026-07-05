import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      backgroundColor: 'var(--color-white)',
      borderTop: 'var(--border-width) solid var(--border-color)',
      padding: 'var(--spacing-4) 0',
      marginTop: 'auto',
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 'var(--spacing-4)',
        fontSize: 'var(--font-size-sm)',
        color: 'var(--color-gray-500)',
      }}>
        <div>
          © {currentYear} Project Management System. All rights reserved.
        </div>
        <div style={{
          display: 'flex',
          gap: 'var(--spacing-4)',
        }}>
          <a href="#" style={{ color: 'var(--color-gray-500)', textDecoration: 'none' }}>
            Privacy
          </a>
          <a href="#" style={{ color: 'var(--color-gray-500)', textDecoration: 'none' }}>
            Terms
          </a>
          <a href="#" style={{ color: 'var(--color-gray-500)', textDecoration: 'none' }}>
            Support
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;