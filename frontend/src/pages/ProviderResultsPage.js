import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserData } from '../context/UserDataContext';
import { providers } from '../data/sampleData';

const ProviderResultsPage = () => {
  const navigate = useNavigate();
  const { state } = useUserData();
  const [matchedProviders, setMatchedProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProviders();
  }, [state.userData]);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      
      // Real API call to get providers from backend
      const response = await fetch('http://127.0.0.1:8000/api/providers/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch providers');
      }

      const providers = await response.json();
      
      // Apply matching logic if user data exists
      if (state.userData) {
        const matched = findMatchingProviders(state.userData, providers);
        setMatchedProviders(matched);
      } else {
        setMatchedProviders(providers);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching providers:', error);
      // Fallback to sample data if API fails
      const matched = findMatchingProviders(state.userData);
      setMatchedProviders(matched);
      setLoading(false);
    }
  };

  const findMatchingProviders = (userData, providersList = providers) => {
    // Enhanced matching logic using the new algorithm
    const { matchProviders } = require('../utils/providerMatching');
    // Convert new user data structure to match the algorithm expectations
    const convertedData = {
      symptoms: userData.primarySymptoms,
      location: userData.city,
      insurance: userData.insuranceProvider,
      urgency: userData.urgencyLevel,
      severity: userData.severity
    };
    return matchProviders(convertedData, providersList);
  };

  const handleProviderSelect = (provider) => {
    const providerId = provider.id || provider._id;
    if (providerId) {
      navigate(`/provider/${providerId}`);
    } else {
      alert('Provider ID not found.');
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push('★');
    }
    if (hasHalfStar) {
      stars.push('☆');
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push('☆');
    }
    
    return stars.join('');
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.95)', 
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '60px 40px',
          maxWidth: '500px',
          width: '100%',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '36px',
            color: 'white',
            fontWeight: 'bold',
            boxShadow: '0 12px 35px rgba(102, 126, 234, 0.4)',
            margin: '0 auto 30px',
            position: 'relative',
            overflow: 'hidden',
            animation: 'pulse 2s infinite'
          }}>
            <div style={{
              position: 'absolute',
              top: '4px',
              left: '4px',
              width: '12px',
              height: '12px',
              background: 'rgba(255, 255, 255, 0.3)',
              borderRadius: '50%'
            }}></div>
            <div style={{
              position: 'absolute',
              bottom: '12px',
              right: '12px',
              width: '10px',
              height: '10px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '50%'
            }}></div>
            <span style={{ fontSize: '32px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>
              ⚕️
            </span>
          </div>
          <h2 style={{ color: '#333', marginBottom: '15px', fontSize: '24px', fontWeight: '700' }}>
            Finding the best providers for you...
          </h2>
          <p style={{ color: '#666', fontSize: '16px', marginBottom: '20px' }}>
            Analyzing your symptoms and insurance coverage
          </p>
          <div style={{
            width: '40px',
            height: '4px',
            background: 'linear-gradient(90deg, #667eea, #764ba2)',
            borderRadius: '2px',
            margin: '0 auto',
            animation: 'loading 1.5s ease-in-out infinite'
          }}></div>
          <style>{`
            @keyframes pulse {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.05); }
            }
            @keyframes loading {
              0% { width: 40px; }
              50% { width: 120px; }
              100% { width: 40px; }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '20px' }}>
      <div style={{ 
        background: 'rgba(255, 255, 255, 0.95)', 
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        padding: '40px',
        maxWidth: '1000px',
        margin: '0 auto',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
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
          <h1 style={{ marginBottom: '10px', color: '#333', fontSize: '32px', fontWeight: '700' }}>
            Top Providers for You
          </h1>
          <p style={{ color: '#666', fontSize: '16px' }}>We've found the best healthcare providers based on your needs</p>
        </div>
        
        <div style={{ 
          background: '#f8f9fa', 
          padding: '16px', 
          borderRadius: '8px', 
          marginBottom: '30px' 
        }}>
          <h3 style={{ marginBottom: '8px' }}>Your Search Criteria:</h3>
          <p><strong>Name:</strong> {state.userData.name}</p>
          <p><strong>Age:</strong> {state.userData.age} years</p>
          <p><strong>Primary Symptoms:</strong> {state.userData.primarySymptoms}</p>
          <p><strong>Duration:</strong> {state.userData.duration}</p>
          <p><strong>Urgency Level:</strong> {state.userData.urgencyLevel}</p>
          <p><strong>Severity:</strong> {state.userData.severity}/10</p>
          <p><strong>Location:</strong> {state.userData.city}, {state.userData.state} - {state.userData.pincode}</p>
          <p><strong>Insurance:</strong> {state.userData.insuranceProvider} - {state.userData.insurancePlan}</p>
        </div>

        {matchedProviders.length === 0 ? (
          <div className="error">
            <h3>No providers found</h3>
            <p>We couldn't find any providers matching your criteria. Please try adjusting your search.</p>
            <button 
              className="btn btn-primary" 
              onClick={() => navigate('/intake')}
              style={{ marginTop: '16px' }}
            >
              Modify Search
            </button>
          </div>
        ) : (
          <div>
            <p style={{ marginBottom: '20px', color: '#666' }}>
              We found {matchedProviders.length} providers that match your needs:
            </p>
            
            {matchedProviders.map((provider, index) => (
              <div key={provider.id || provider._id} className="provider-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: '1' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <h3 style={{ margin: 0, color: '#333' }}>
                        {index + 1}. {provider.name}
                      </h3>
                      {provider.specialtyMatch && (
                        <span style={{
                          background: '#28a745',
                          color: 'white',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '0.8rem',
                          fontWeight: 'bold'
                        }}>
                          Perfect Match
                        </span>
                      )}
                    </div>
                    <p style={{ color: '#666', marginBottom: '8px' }}>
                      <strong>{provider.specialty}</strong>
                    </p>
                    <p style={{ color: '#666', marginBottom: '8px' }}>
                      📍 {provider.address}
                    </p>
                    <div style={{ display: 'flex', gap: '20px', marginBottom: '12px' }}>
                      <span className="rating">
                        {renderStars(provider.rating)} {provider.rating}
                      </span>
                      <span>⏱️ {provider.wait_time} wait</span>
                      <span style={{ color: '#007bff', fontWeight: 'bold' }}>
                        Score: {provider.matchScore}
                      </span>
                    </div>
                    <p style={{ color: '#666', fontSize: '0.9rem' }}>
                      Accepts: {provider.accepted_insurances.join(', ')}
                    </p>
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleProviderSelect(provider)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: '16px', marginTop: '30px' }}>
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/intake')}
          >
            Back to Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProviderResultsPage; 