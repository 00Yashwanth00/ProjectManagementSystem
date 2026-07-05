import React from 'react';

/**
 * PageWrapper Component
 * Provides consistent padding and structure for all pages
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Page content
 * @param {string} props.title - Page title
 * @param {string} props.subtitle - Page subtitle (optional)
 * @param {React.ReactNode} props.actions - Right-aligned actions (buttons, etc.)
 * @param {string} props.maxWidth - Max width of content (default: '1280px')
 * @param {string} props.padding - Padding size (default: 'var(--spacing-6)')
 */
const PageWrapper = ({ 
  children, 
  title, 
  subtitle, 
  actions, 
  maxWidth = '1280px',
  padding = 'var(--spacing-6)',
}) => {
  return (
    <div style={{
      flex: 1,
      padding: padding,
      maxWidth: maxWidth,
      margin: '0 auto',
      width: '100%',
    }}>
      {/* Page Header */}
      {(title || subtitle || actions) && (
        <div className="page-header" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 'var(--spacing-4)',
          marginBottom: 'var(--spacing-6)',
          paddingBottom: 'var(--spacing-4)',
          borderBottom: 'var(--border-width) solid var(--border-color)',
        }}>
          <div>
            {title && <h1 className="page-title">{title}</h1>}
            {subtitle && <p className="page-subtitle">{subtitle}</p>}
          </div>
          {actions && (
            <div style={{
              display: 'flex',
              gap: 'var(--spacing-2)',
              flexWrap: 'wrap',
            }}>
              {actions}
            </div>
          )}
        </div>
      )}
      
      {/* Page Content */}
      <div>
        {children}
      </div>
    </div>
  );
};

export default PageWrapper;