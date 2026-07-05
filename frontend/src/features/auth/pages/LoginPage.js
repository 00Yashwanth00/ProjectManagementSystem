import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, isAuthenticated, error: authError } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    // Validate form
    if (!email.trim()) {
      setFormError('Email is required');
      return;
    }
    if (!password.trim()) {
      setFormError('Password is required');
      return;
    }
    
    setIsSubmitting(true);
    
    const result = await login(email, password);
    
    setIsSubmitting(false);
    
    if (result.success) {
      navigate('/');
    } else {
      setFormError(result.error);
    }
  };

  return (
    <div className="container" style={{ 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="card-header">
          <h2 className="card-title" style={{ textAlign: 'center' }}>Login</h2>
          <p style={{ textAlign: 'center', color: 'var(--color-gray-500)', fontSize: 'var(--font-size-sm)', marginTop: 'var(--spacing-2)' }}>
            Sign in to your account
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          {/* Display error messages */}
          {formError && (
            <div className="alert alert-danger" style={{ marginBottom: 'var(--spacing-4)' }}>
              {formError}
            </div>
          )}
          
          {authError && !formError && (
            <div className="alert alert-danger" style={{ marginBottom: 'var(--spacing-4)' }}>
              {authError}
            </div>
          )}
          
          {/* Email field */}
          <div style={{ marginBottom: 'var(--spacing-4)' }}>
            <label htmlFor="email" style={{ 
              display: 'block', 
              marginBottom: 'var(--spacing-2)',
              fontWeight: 'var(--font-weight-medium)',
              fontSize: 'var(--font-size-sm)'
            }}>
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@test.com"
              style={{ width: '100%' }}
              disabled={isSubmitting}
            />
          </div>
          
          {/* Password field */}
          <div style={{ marginBottom: 'var(--spacing-6)' }}>
            <label htmlFor="password" style={{ 
              display: 'block', 
              marginBottom: 'var(--spacing-2)',
              fontWeight: 'var(--font-weight-medium)',
              fontSize: 'var(--font-size-sm)'
            }}>
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              style={{ width: '100%' }}
              disabled={isSubmitting}
            />
          </div>
          
          {/* Submit button */}
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging in...' : 'Sign In'}
          </button>
        </form>
        
        {/* Register link */}
        <div style={{ 
          marginTop: 'var(--spacing-4)',
          textAlign: 'center',
          fontSize: 'var(--font-size-sm)',
          color: 'var(--color-gray-500)'
        }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ fontWeight: 'var(--font-weight-medium)' }}>
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;