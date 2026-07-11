import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext/AuthContext';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  
  const { register, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  // ✅ Redirect if not ADMIN (only admins can register users)
  useEffect(() => {
    if (isAuthenticated) {
      if (!isAdmin()) {
        // Non-admin users should not be on register page
        navigate('/');
      }
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setRegistrationSuccess(false);
    
    if (!formData.name.trim()) {
      setFormError('Name is required');
      return;
    }
    if (!formData.email.trim()) {
      setFormError('Email is required');
      return;
    }
    if (!formData.password.trim()) {
      setFormError('Password is required');
      return;
    }
    if (formData.password.length < 6) {
      setFormError('Password must be at least 6 characters');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    
    setIsSubmitting(true);
    
    // ✅ Remove confirmPassword, no role field needed
    const { confirmPassword, ...registrationData } = formData;
    
    const result = await register(registrationData);
    
    setIsSubmitting(false);
    
    if (result.success) {
      setRegistrationSuccess(true);
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
      setTimeout(() => {
        navigate('/users'); // Redirect to users list
      }, 2000);
    } else {
      setFormError(result.error);
    }
  };

  // ✅ If not logged in, show login required message
  if (!isAuthenticated) {
    return (
      <div className="container" style={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--spacing-4)'
      }}>
        <div className="card" style={{ maxWidth: '500px', width: '100%', textAlign: 'center' }}>
          <h3>🔒 Access Restricted</h3>
          <p style={{ color: 'var(--color-gray-500)' }}>
            Only Admins can create new users.
          </p>
          <Link to="/login" className="btn btn-primary" style={{ marginTop: 'var(--spacing-4)' }}>
            Login as Admin
          </Link>
        </div>
      </div>
    );
  }

  // ✅ If logged in but not admin
  if (!isAdmin()) {
    return (
      <div className="container" style={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--spacing-4)'
      }}>
        <div className="card" style={{ maxWidth: '500px', width: '100%', textAlign: 'center' }}>
          <h3>⛔ Access Denied</h3>
          <p style={{ color: 'var(--color-gray-500)' }}>
            You don't have permission to create users.
          </p>
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/')}
            style={{ marginTop: 'var(--spacing-4)' }}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--spacing-4)'
    }}>
      <div className="card" style={{ maxWidth: '500px', width: '100%' }}>
        <div className="card-header">
          <h2 className="card-title" style={{ textAlign: 'center' }}>Create New User</h2>
          <p style={{ textAlign: 'center', color: 'var(--color-gray-500)', fontSize: 'var(--font-size-sm)', marginTop: 'var(--spacing-2)' }}>
            New users will be assigned the <strong>EMPLOYEE</strong> role by default
          </p>
        </div>
        
        {registrationSuccess && (
          <div className="alert alert-success" style={{ marginBottom: 'var(--spacing-4)' }}>
            ✅ User created successfully! Redirecting to users list...
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {formError && !registrationSuccess && (
            <div className="alert alert-danger" style={{ marginBottom: 'var(--spacing-4)' }}>
              {formError}
            </div>
          )}
          
          <div style={{ marginBottom: 'var(--spacing-4)' }}>
            <label htmlFor="name" style={{ 
              display: 'block', 
              marginBottom: 'var(--spacing-2)',
              fontWeight: 'var(--font-weight-medium)',
              fontSize: 'var(--font-size-sm)'
            }}>
              Full Name <span style={{ color: 'var(--color-danger)' }}>*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              style={{ width: '100%' }}
              disabled={isSubmitting || registrationSuccess}
            />
          </div>
          
          <div style={{ marginBottom: 'var(--spacing-4)' }}>
            <label htmlFor="email" style={{ 
              display: 'block', 
              marginBottom: 'var(--spacing-2)',
              fontWeight: 'var(--font-weight-medium)',
              fontSize: 'var(--font-size-sm)'
            }}>
              Email Address <span style={{ color: 'var(--color-danger)' }}>*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="user@company.com"
              style={{ width: '100%' }}
              disabled={isSubmitting || registrationSuccess}
            />
          </div>
          
          <div style={{ marginBottom: 'var(--spacing-4)' }}>
            <label htmlFor="password" style={{ 
              display: 'block', 
              marginBottom: 'var(--spacing-2)',
              fontWeight: 'var(--font-weight-medium)',
              fontSize: 'var(--font-size-sm)'
            }}>
              Password (min 6 characters) <span style={{ color: 'var(--color-danger)' }}>*</span>
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              style={{ width: '100%' }}
              disabled={isSubmitting || registrationSuccess}
            />
          </div>
          
          <div style={{ marginBottom: 'var(--spacing-6)' }}>
            <label htmlFor="confirmPassword" style={{ 
              display: 'block', 
              marginBottom: 'var(--spacing-2)',
              fontWeight: 'var(--font-weight-medium)',
              fontSize: 'var(--font-size-sm)'
            }}>
              Confirm Password <span style={{ color: 'var(--color-danger)' }}>*</span>
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              style={{ width: '100%' }}
              disabled={isSubmitting || registrationSuccess}
            />
          </div>

          {/* ✅ Role info banner - no dropdown */}
          <div style={{
            marginBottom: 'var(--spacing-4)',
            padding: 'var(--spacing-3)',
            backgroundColor: 'var(--color-primary-bg)',
            borderRadius: 'var(--border-radius-md)',
            border: '1px solid var(--color-primary)',
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-primary)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
              <span>ℹ️</span>
              <span>
                New users will be created with the <strong>EMPLOYEE</strong> role.
                You can change their role later via database or system configuration.
              </span>
            </div>
          </div>
          
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%' }}
            disabled={isSubmitting || registrationSuccess}
          >
            {isSubmitting ? 'Creating User...' : 'Create User'}
          </button>
        </form>
        
        <div style={{ 
          marginTop: 'var(--spacing-4)',
          textAlign: 'center',
          fontSize: 'var(--font-size-sm)',
          color: 'var(--color-gray-500)'
        }}>
          <Link to="/users" style={{ fontWeight: 'var(--font-weight-medium)' }}>
            ← Back to Users
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;