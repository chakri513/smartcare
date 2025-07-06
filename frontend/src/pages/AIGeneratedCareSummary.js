import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserData } from '../context/UserDataContext';

const AIGeneratedCareSummary = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useUserData();
  const [careSummary, setCareSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const generateCareSummary = useCallback(() => {
    const { userData, selectedProvider, costEstimate } = state;
    const { primarySymptoms, insuranceProvider } = userData;
    
    // Handle symptoms whether they come as array or string
    let symptomsText = '';
    if (Array.isArray(primarySymptoms)) {
      symptomsText = primarySymptoms.join(' ').toLowerCase();
    } else {
      symptomsText = primarySymptoms.toLowerCase();
    }
    
    // Generate AI-like summary based on symptoms and provider
    let whyThisProvider = '';
    let careExpectations = '';
    let preparationTips = '';

    if (symptomsText.includes('rash') || symptomsText.includes('skin')) {
      whyThisProvider = `${selectedProvider.name} is an excellent choice for your skin concerns. As a board-certified dermatologist with ${selectedProvider.experience} of experience, they specialize in diagnosing and treating various skin conditions. Their high rating of ${selectedProvider.rating}/5 and short wait time of ${selectedProvider.wait_time} make them an ideal match for your needs.`;
      
      careExpectations = `During your visit, Dr. ${selectedProvider.name.split(' ')[1]} will conduct a thorough examination of your skin condition. They may take photographs for documentation, perform a skin biopsy if necessary, and discuss treatment options. The appointment typically lasts 20-30 minutes, and you'll receive a detailed treatment plan.`;
      
      preparationTips = `Before your appointment: 1) Avoid applying any creams or makeup to the affected area, 2) Bring a list of any medications you're currently taking, 3) Wear loose-fitting clothing that allows easy access to the affected area, 4) Consider taking photos of your condition if it changes before the appointment.`;
    } else if (symptomsText.includes('chest pain')) {
      whyThisProvider = `${selectedProvider.name} is highly qualified to address your cardiac concerns. As a cardiologist with ${selectedProvider.experience} of experience and training from ${selectedProvider.education}, they have extensive expertise in evaluating chest pain and related symptoms. Their excellent rating and quick availability ensure you'll receive prompt, quality care.`;
      
      careExpectations = `Your cardiology consultation will include a comprehensive medical history review, physical examination, and potentially diagnostic tests like an EKG or stress test. Dr. ${selectedProvider.name.split(' ')[1]} will assess your symptoms and develop a personalized treatment plan. The visit typically takes 45-60 minutes.`;
      
      preparationTips = `Before your appointment: 1) Bring a list of all current medications and dosages, 2) Wear comfortable clothing that allows easy access for examination, 3) Avoid eating or drinking for 2-3 hours before if tests are scheduled, 4) Bring any previous cardiac test results or medical records.`;
    } else {
      whyThisProvider = `${selectedProvider.name} is well-suited to address your health concerns. With ${selectedProvider.experience} of experience in ${selectedProvider.specialty.toLowerCase()}, they have the expertise to properly diagnose and treat your symptoms. Their high patient satisfaction rating and convenient location make them an excellent choice for your care.`;
      
      careExpectations = `Your appointment will begin with a comprehensive review of your symptoms and medical history. Dr. ${selectedProvider.name.split(' ')[1]} will perform a physical examination and may order diagnostic tests if needed. You'll receive a clear diagnosis and treatment plan tailored to your specific needs.`;
      
      preparationTips = `Before your appointment: 1) Write down your symptoms and when they started, 2) Bring a list of all medications and supplements, 3) Wear comfortable clothing, 4) Arrive 15 minutes early to complete any necessary paperwork.`;
    }

    return {
      whyThisProvider,
      careExpectations,
      preparationTips,
      provider: selectedProvider,
      costEstimate,
      symptoms: primarySymptoms,
      insurance: insuranceProvider
    };
  }, [state]);

  useEffect(() => {
    const summary = generateCareSummary();
    if (summary) {
      setCareSummary(summary);
    }
    setLoading(false);
  }, [generateCareSummary]);

  const handleConfirmBooking = async () => {
    try {
      // Get user ID from context
      const user = state.user;
      if (!user || !user.id) {
        alert('Please login first');
        navigate('/login');
        return;
      }

      // Update the booking status to confirmed
      const bookingData = {
        user_id: user.id,
        provider_id: careSummary.provider.id,
        appointment_time: careSummary.costEstimate?.appointment_time || new Date().toISOString(),
        status: "confirmed"
      };

      // Real API call to update booking status
      const response = await fetch('http://127.0.0.1:8000/api/bookings/confirm', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to confirm booking');
      }

      const result = await response.json();
      console.log('Booking confirmed successfully:', result);

      // Save cost estimate and booking data to context before navigating
      dispatch({ type: 'SET_COST_ESTIMATE', payload: careSummary.costEstimate });
      dispatch({ type: 'SET_BOOKING_DATA', payload: bookingData });

      // Fetch latest bookings and update context for dashboard
      const bookingsRes = await fetch(`http://127.0.0.1:8000/api/bookings/user/${user.id}`);
      if (bookingsRes.ok) {
        const bookings = await bookingsRes.json();
        dispatch({ type: 'SET_UPCOMING_APPOINTMENTS', payload: bookings });
      }

      // Navigate to confirmation page
      navigate('/confirmation');
      
    } catch (error) {
      console.error('Booking confirmation error:', error);
      alert('Failed to confirm booking: ' + error.message);
    }
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
            <span style={{ fontSize: '32px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>
              🤖
            </span>
          </div>
          <h2 style={{ color: '#333', marginBottom: '15px', fontSize: '24px', fontWeight: '700' }}>
            Generating your personalized care summary...
          </h2>
          <p style={{ color: '#666', fontSize: '16px', marginBottom: '20px' }}>
            Our AI is analyzing your symptoms and provider match
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

  if (!careSummary) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.95)', 
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '40px',
          maxWidth: '500px',
          width: '100%',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
            borderRadius: '15px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            color: 'white',
            fontWeight: 'bold',
            boxShadow: '0 8px 25px rgba(220, 53, 69, 0.4)',
            margin: '0 auto 20px'
          }}>
            ⚠️
          </div>
          <h3 style={{ color: '#333', marginBottom: '15px', fontSize: '20px', fontWeight: '700' }}>
            Unable to generate care summary
          </h3>
          <p style={{ color: '#666', fontSize: '16px', marginBottom: '25px' }}>
            We couldn't create your personalized care summary. Please try again.
          </p>
          <button 
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
            }}
            onClick={() => window.location.reload()}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
            }}
          >
            Try Again
          </button>
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
        maxWidth: '800px',
        margin: '0 auto',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <h1 style={{ marginBottom: '30px', color: '#333' }}>
          Your Personalized Care Summary
        </h1>

        <div style={{ 
          background: '#f8f9fa', 
          padding: '20px', 
          borderRadius: '8px', 
          marginBottom: '30px' 
        }}>
          <h3 style={{ marginBottom: '16px' }}>Appointment Overview</h3>
          <p><strong>Provider:</strong> {careSummary.provider.name}</p>
          <p><strong>Specialty:</strong> {careSummary.provider.specialty}</p>
          <p><strong>Date:</strong> {new Date(careSummary.costEstimate?.appointment_time || Date.now()).toLocaleDateString()}</p>
          <p><strong>Estimated Cost:</strong> ${careSummary.costEstimate?.outOfPocketCost?.toFixed(2)}</p>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ marginBottom: '20px', color: '#333' }}>🤖 AI Analysis</h2>
          
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ color: '#007bff', marginBottom: '12px' }}>Why This Provider?</h3>
            <div style={{ 
              background: '#e3f2fd', 
              padding: '16px', 
              borderRadius: '8px',
              borderLeft: '4px solid #007bff'
            }}>
              <p style={{ margin: 0, lineHeight: '1.6' }}>{careSummary.whyThisProvider}</p>
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ color: '#28a745', marginBottom: '12px' }}>What to Expect</h3>
            <div style={{ 
              background: '#e8f5e8', 
              padding: '16px', 
              borderRadius: '8px',
              borderLeft: '4px solid #28a745'
            }}>
              <p style={{ margin: 0, lineHeight: '1.6' }}>{careSummary.careExpectations}</p>
            </div>
          </div>

          <div>
            <h3 style={{ color: '#ffc107', marginBottom: '12px' }}>Preparation Tips</h3>
            <div style={{ 
              background: '#fff3cd', 
              padding: '16px', 
              borderRadius: '8px',
              borderLeft: '4px solid #ffc107'
            }}>
              <p style={{ margin: 0, lineHeight: '1.6' }}>{careSummary.preparationTips}</p>
            </div>
          </div>
        </div>

        <div style={{ 
          background: '#d1ecf1', 
          padding: '16px', 
          borderRadius: '8px', 
          marginBottom: '30px',
          border: '1px solid #bee5eb'
        }}>
          <h3 style={{ color: '#0c5460', marginBottom: '8px' }}>💡 Smart Care Insights</h3>
          <p style={{ color: '#0c5460', margin: 0 }}>
            Based on your symptoms and {careSummary.insurance} coverage, this provider offers the best 
            combination of expertise, availability, and cost-effectiveness for your specific needs.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          <button
            style={{
              background: 'rgba(102, 126, 234, 0.1)',
              border: '2px solid #667eea',
              color: '#667eea',
              padding: '15px 30px',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
            onClick={() => navigate('/cost-estimate')}
            onMouseOver={(e) => {
              e.target.style.background = 'rgba(102, 126, 234, 0.2)';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'rgba(102, 126, 234, 0.1)';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            Back to Cost Estimate
          </button>
          <button
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              color: 'white',
              padding: '15px 30px',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              flex: '1',
              boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'
            }}
            onClick={handleConfirmBooking}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 12px 35px rgba(102, 126, 234, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.3)';
            }}
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIGeneratedCareSummary; 