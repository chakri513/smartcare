import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUserData } from '../context/UserDataContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useUserData();

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* Header */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 40px',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '45px',
            height: '45px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            color: 'white',
            fontWeight: 'bold',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '2px',
              left: '2px',
              width: '8px',
              height: '8px',
              background: 'rgba(255, 255, 255, 0.3)',
              borderRadius: '50%'
            }}></div>
            <div style={{
              position: 'absolute',
              bottom: '6px',
              right: '6px',
              width: '6px',
              height: '6px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '50%'
            }}></div>
            <span style={{ fontSize: '20px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>
              ⚕️
            </span>
          </div>
          <div>
            <h1 style={{ 
              color: 'white', 
              margin: 0, 
              fontSize: '26px',
              fontWeight: '700',
              letterSpacing: '-0.5px'
            }}>
              MediConnect
            </h1>
            <div style={{
              fontSize: '10px',
              color: 'rgba(255, 255, 255, 0.8)',
              fontWeight: '500',
              letterSpacing: '1px',
              textTransform: 'uppercase'
            }}>
              Healthcare Simplified
            </div>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '16px' }}>
          {state.user ? (
            <>
              <span style={{ color: 'white', alignSelf: 'center', fontSize: '14px' }}>
                Welcome, {state.user.name}!
              </span>
              <button
                onClick={() => navigate('/dashboard')}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
                onMouseOut={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
              >
                Dashboard
              </button>
              <button
                onClick={handleLogout}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
                onMouseOut={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <button style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
                onMouseOut={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
                >
                  Login
                </button>
              </Link>
              <Link to="/register" style={{ textDecoration: 'none' }}>
                <button style={{
                  background: 'white',
                  border: 'none',
                  color: '#667eea',
                  padding: '10px 20px',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => e.target.style.background = '#f8f9fa'}
                onMouseOut={(e) => e.target.style.background = 'white'}
                >
                  Sign Up
                </button>
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 80px)',
        textAlign: 'center',
        padding: '40px 20px'
      }}>
        <div style={{ maxWidth: '800px' }}>
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: '700',
            color: 'white',
            marginBottom: '20px',
            lineHeight: '1.2'
          }}>
            Find Your Perfect
            <br />
            <span style={{ color: '#4CAF50' }}>Healthcare Provider</span>
          </h1>
          
          <p style={{
            fontSize: '1.3rem',
            color: 'rgba(255, 255, 255, 0.9)',
            marginBottom: '40px',
            lineHeight: '1.6',
            maxWidth: '800px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            Get personalized care recommendations based on your symptoms and insurance.
          </p>

          {/* Features Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)', // 3 columns always
            gap: '30px',
            marginBottom: '50px',
            justifyItems: 'center',
            alignItems: 'stretch',
            maxWidth: '900px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '30px',
              borderRadius: '20px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              minWidth: '220px',
              minHeight: '170px',
              textAlign: 'center',
              width: '100%',
              boxSizing: 'border-box',
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>🎯</div>
              <h3 style={{ color: 'white', marginBottom: '10px', fontSize: '1.2rem' }}>Smart Matching</h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}>
                AI-powered recommendations based on your symptoms and location
              </p>
            </div>
            
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '30px',
              borderRadius: '20px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              minWidth: '220px',
              minHeight: '170px',
              textAlign: 'center',
              width: '100%',
              boxSizing: 'border-box',
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>💰</div>
              <h3 style={{ color: 'white', marginBottom: '10px', fontSize: '1.2rem' }}>Cost Transparency</h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}>
                Know your out-of-pocket costs before booking appointments
              </p>
            </div>
            
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '30px',
              borderRadius: '20px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              minWidth: '220px',
              minHeight: '170px',
              textAlign: 'center',
              width: '100%',
              boxSizing: 'border-box',
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>⚡</div>
              <h3 style={{ color: 'white', marginBottom: '10px', fontSize: '1.2rem' }}>Instant Booking</h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}>
                Book appointments with top doctors in just a few clicks
              </p>
            </div>
          </div>
          {/* Responsive: stack vertically on small screens */}
          <style>{`
            @media (max-width: 900px) {
              .features-grid {
                grid-template-columns: 1fr !important;
              }
            }
          `}</style>

          {/* CTA Section */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '40px',
            borderRadius: '25px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            maxWidth: '500px',
            margin: '0 auto'
          }}>
            <h2 style={{ color: 'white', marginBottom: '15px', fontSize: '1.5rem' }}>
              Ready to Get Started?
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '25px' }}>
              Join thousands of patients who trust MediConnect for their healthcare needs
            </p>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/register" style={{ textDecoration: 'none' }}>
                <button style={{
                  background: '#4CAF50',
                  border: 'none',
                  color: 'white',
                  padding: '15px 30px',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => e.target.style.background = '#45a049'}
                onMouseOut={(e) => e.target.style.background = '#4CAF50'}
                >
                  Create Account
                </button>
              </Link>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <button style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  padding: '15px 30px',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '500',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
                onMouseOut={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
                >
                  Sign In
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage; 