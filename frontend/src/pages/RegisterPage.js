import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUserData } from '../context/UserDataContext';
import { validateName, validateEmail, validatePassword } from '../utils/validation';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { dispatch } = useUserData();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // For phone, only allow numbers
    if (name === 'phone') {
      // Remove non-numeric characters
      const numericValue = value.replace(/[^0-9]/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: numericValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
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
    
    const nameValidation = validateName(formData.name);
    if (!nameValidation.isValid) {
      newErrors.name = nameValidation.error;
    }
    
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.error;
    }
    
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.error;
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Phone validation: only allow 10-digit numbers or empty (optional)
    if (formData.phone) {
      if (!/^[0-9]{10}$/.test(formData.phone)) {
        newErrors.phone = 'Invalid phone number format. Please enter a 10-digit number.';
      }
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
      // Real API call to backend
      const response = await fetch('http://127.0.0.1:8000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        password: formData.password,
          phone: formData.phone
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        // Check for email already exists error
        if (errorData.detail && errorData.detail.toLowerCase().includes('email')) {
          setErrors({ email: 'This email is already used. Please use a different email address.' });
        } else {
          setErrors({ submit: errorData.detail || 'Registration failed' });
        }
        setLoading(false);
        return;
      }

      const userData = await response.json();
      
      // Store user data and set as authenticated user
      dispatch({
        type: 'REGISTER_USER',
        payload: {
          id: userData._id,
          name: userData.name,
          email: userData.email,
          isAuthenticated: true,
          isNewUser: true
        }
      });
      
      // Set the user as logged in
      dispatch({
        type: 'SET_USER',
        payload: {
          id: userData._id,
          name: userData.name,
          email: userData.email,
          isAuthenticated: true,
          isNewUser: true
        }
      });
      
      setLoading(false);
      // Redirect directly to dashboard
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ submit: error.message });
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
        maxWidth: '550px',
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
            <h1 style={{ color: '#333', marginBottom: '10px', fontSize: '28px', fontWeight: '700' }}>Create Account</h1>
            <p style={{ color: '#666', fontSize: '16px' }}>Join MediConnect - Healthcare Simplified</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className={errors.name ? 'error' : ''}
                disabled={loading}
              />
              {errors.name && <div className="error" style={{ marginTop: '8px' }}>{errors.name}</div>}
            </div>

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
              <label htmlFor="phone">Phone Number (Optional)</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
                className={errors.phone ? 'error' : ''}
                disabled={loading}
                maxLength={10}
                pattern="[0-9]{10}"
                inputMode="numeric"
                autoComplete="tel"
              />
              {errors.phone && <div className="error" style={{ marginTop: '8px' }}>{errors.phone}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Create a password"
                className={errors.password ? 'error' : ''}
                disabled={loading}
              />
              {errors.password && <div className="error" style={{ marginTop: '8px' }}>{errors.password}</div>}
              <small style={{ color: '#666', marginTop: '4px', display: 'block' }}>
                Password must be at least 8 characters long
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                className={errors.confirmPassword ? 'error' : ''}
                disabled={loading}
              />
              {errors.confirmPassword && <div className="error" style={{ marginTop: '8px' }}>{errors.confirmPassword}</div>}
            </div>

            {/* Display submit error */}
            {errors.submit && (
              <div style={{
                background: '#f8d7da',
                color: '#721c24',
                padding: '12px',
                borderRadius: '8px',
                marginTop: '16px',
                border: '1px solid #f5c6cb',
                fontSize: '14px'
              }}>
                {errors.submit}
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
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <p style={{ color: '#666', marginBottom: '10px' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#007bff', textDecoration: 'none' }}>
                Sign in here
              </Link>
            </p>
          </div>

          <div style={{ 
            background: '#e8f5e8', 
            padding: '16px', 
            borderRadius: '8px', 
            marginTop: '20px',
            border: '1px solid #28a745'
          }}>
            <h4 style={{ color: '#155724', marginBottom: '8px' }}>🎉 Welcome!</h4>
            <p style={{ color: '#155724', margin: 0, fontSize: '14px' }}>
              After registration, you'll be taken directly to your dashboard where you can start finding healthcare providers for your needs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage; 