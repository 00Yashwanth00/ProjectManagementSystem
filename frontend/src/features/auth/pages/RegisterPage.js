import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext/AuthContext';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'TEAM_MEMBER',
  });
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setRegistrationSuccess(false);
    
    // Validate form
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
    
    // Prepare data for API (remove confirmPassword)
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
        role: 'TEAM_MEMBER',
      });
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      setFormError(result.error);
    }
  };

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
          <h2 className="card-title" style={{ textAlign: 'center' }}>Register</h2>
          <p style={{ textAlign: 'center', color: 'var(--color-gray-500)', fontSize: 'var(--font-size-sm)', marginTop: 'var(--spacing-2)' }}>
            Create your account
          </p>
        </div>
        
        {/* Success message */}
        {registrationSuccess && (
          <div className="alert alert-success" style={{ marginBottom: 'var(--spacing-4)' }}>
            Registration successful! Redirecting to login...
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {/* Error message */}
          {formError && !registrationSuccess && (
            <div className="alert alert-danger" style={{ marginBottom: 'var(--spacing-4)' }}>
              {formError}
            </div>
          )}
          
          {/* Name field */}
          <div style={{ marginBottom: 'var(--spacing-4)' }}>
            <label htmlFor="name" style={{ 
              display: 'block', 
              marginBottom: 'var(--spacing-2)',
              fontWeight: 'var(--font-weight-medium)',
              fontSize: 'var(--font-size-sm)'
            }}>
              Full Name
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
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="user@test.com"
              style={{ width: '100%' }}
              disabled={isSubmitting || registrationSuccess}
            />
          </div>
          
          {/* Password field */}
          <div style={{ marginBottom: 'var(--spacing-4)' }}>
            <label htmlFor="password" style={{ 
              display: 'block', 
              marginBottom: 'var(--spacing-2)',
              fontWeight: 'var(--font-weight-medium)',
              fontSize: 'var(--font-size-sm)'
            }}>
              Password (min 6 characters)
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
          
          {/* Confirm Password field */}
          <div style={{ marginBottom: 'var(--spacing-4)' }}>
            <label htmlFor="confirmPassword" style={{ 
              display: 'block', 
              marginBottom: 'var(--spacing-2)',
              fontWeight: 'var(--font-weight-medium)',
              fontSize: 'var(--font-size-sm)'
            }}>
              Confirm Password
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
          
          {/* Role selection */}
          <div style={{ marginBottom: 'var(--spacing-6)' }}>
            <label htmlFor="role" style={{ 
              display: 'block', 
              marginBottom: 'var(--spacing-2)',
              fontWeight: 'var(--font-weight-medium)',
              fontSize: 'var(--font-size-sm)'
            }}>
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={{ width: '100%' }}
              disabled={isSubmitting || registrationSuccess}
            >
              <option value="TEAM_MEMBER">Team Member</option>
              <option value="PROJECT_LEADER">Project Leader</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          
          {/* Submit button */}
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%' }}
            disabled={isSubmitting || registrationSuccess}
          >
            {isSubmitting ? 'Registering...' : 'Create Account'}
          </button>
        </form>
        
        {/* Login link */}
        <div style={{ 
          marginTop: 'var(--spacing-4)',
          textAlign: 'center',
          fontSize: 'var(--font-size-sm)',
          color: 'var(--color-gray-500)'
        }}>
          Already have an account?{' '}
          <Link to="/login" style={{ fontWeight: 'var(--font-weight-medium)' }}>
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;