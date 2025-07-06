import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUserData } from '../context/UserDataContext';
import { validateEmail, validatePassword } from '../utils/validation';

const LoginPage = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useUserData();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.error;
    }
    
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.error;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      console.log('Attempting login with:', formData.email);
      
      // Real API call to backend
      const response = await fetch('http://127.0.0.1:8000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      console.log('Login response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
      }

      const loginData = await response.json();
      console.log('Login successful, token received');
      
      // Store the access token
      localStorage.setItem('access_token', loginData.access_token);
      
      // Create user data from email (simplified approach)
      const userData = {
        id: 'user_' + Date.now(), // Temporary ID
        name: formData.email.split('@')[0], // Use email prefix as name
        email: formData.email,
        isAuthenticated: true
      };
      
      console.log('Setting user in context:', userData);
      
      // Set user in context
      dispatch({
        type: 'SET_USER',
        payload: userData
      });
      
      setLoading(false);
      console.log('Navigating to dashboard...');
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ general: error.message });
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ 
        background: 'rgba(255, 255, 255, 0.95)', 
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        padding: '40px',
        maxWidth: '450px',
        width: '100%',
        boxShadow: '0 8px 32px 0 rgba(102, 126, 234, 0.25), 0 1.5px 8px 0 rgba(118, 75, 162, 0.10)',
        border: '2px solid #e0e7ff',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Gradient overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          background: 'linear-gradient(120deg, rgba(102,126,234,0.08) 0%, rgba(118,75,162,0.10) 100%)',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              color: 'white',
              fontWeight: 'bold',
              boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
              margin: '0 auto 20px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: '3px',
                left: '3px',
                width: '10px',
                height: '10px',
                background: 'rgba(255, 255, 255, 0.3)',
                borderRadius: '50%'
              }}></div>
              <div style={{
                position: 'absolute',
                bottom: '8px',
                right: '8px',
                width: '8px',
                height: '8px',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '50%'
              }}></div>
              <span style={{ fontSize: '24px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>
                ⚕️
              </span>
            </div>
            <h1 style={{ color: '#333', marginBottom: '10px', fontSize: '28px', fontWeight: '700' }}>Welcome Back</h1>
            <p style={{ color: '#666', fontSize: '16px' }}>Sign in to your MediConnect account</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className={errors.email ? 'error' : ''}
                disabled={loading}
              />
              {errors.email && <div className="error" style={{ marginTop: '8px' }}>{errors.email}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className={errors.password ? 'error' : ''}
                disabled={loading}
              />
              {errors.password && <div className="error" style={{ marginTop: '8px' }}>{errors.password}</div>}
            </div>

            {errors.general && (
              <div className="error" style={{ 
                marginTop: '16px', 
                padding: '12px', 
                background: '#f8d7da', 
                color: '#721c24', 
                borderRadius: '8px',
                border: '1px solid #f5c6cb'
              }}>
                {errors.general}
              </div>
            )}
            
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '16px',
                marginTop: '20px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                color: 'white',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                opacity: loading ? 0.7 : 1
              }}
              disabled={loading}
              onMouseOver={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 12px 35px rgba(102, 126, 234, 0.4)';
                }
              }}
              onMouseOut={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.3)';
                }
              }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <p style={{ color: '#666', marginBottom: '10px' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#007bff', textDecoration: 'none' }}>
                Sign up here
              </Link>
            </p>
          </div>

          <div style={{ 
            background: '#f8f9fa', 
            padding: '16px', 
            borderRadius: '8px', 
            marginTop: '20px',
            fontSize: '14px',
            color: '#666'
          }}>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 