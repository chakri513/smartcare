import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserData } from '../context/UserDataContext';

const AIGeneratedCareSummary = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useUserData();
  const [careSummary, setCareSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateCareSummary();
  }, [generateCareSummary]);

  const generateCareSummary = () => {
    const { userData, selectedProvider, costEstimate } = state;
    const { primarySymptoms, insuranceProvider } = userData;
    
    // Generate AI-like summary based on symptoms and provider
    let whyThisProvider = '';
    let careExpectations = '';
    let preparationTips = '';

    if (primarySymptoms.toLowerCase().includes('rash') || primarySymptoms.toLowerCase().includes('skin')) {
      whyThisProvider = `${selectedProvider.name} is an excellent choice for your skin concerns. As a board-certified dermatologist with ${selectedProvider.experience} of experience, they specialize in diagnosing and treating various skin conditions. Their high rating of ${selectedProvider.rating}/5 and short wait time of ${selectedProvider.wait_time} make them an ideal match for your needs.`;
      
      careExpectations = `During your visit, Dr. ${selectedProvider.name.split(' ')[1]} will conduct a thorough examination of your skin condition. They may take photographs for documentation, perform a skin biopsy if necessary, and discuss treatment options. The appointment typically lasts 20-30 minutes, and you'll receive a detailed treatment plan.`;
      
      preparationTips = `Before your appointment: 1) Avoid applying any creams or makeup to the affected area, 2) Bring a list of any medications you're currently taking, 3) Wear loose-fitting clothing that allows easy access to the affected area, 4) Consider taking photos of your condition if it changes before the appointment.`;
    } else if (primarySymptoms.toLowerCase().includes('chest pain')) {
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
  };

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

      // Navigate to confirmation page
      navigate('/confirmation');
      
    } catch (error) {
      console.error('Booking confirmation error:', error);
      alert('Failed to confirm booking: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="card">
          <div className="loading">
            <h2>Generating your personalized care summary...</h2>
            <p>Our AI is analyzing your symptoms and provider match</p>
          </div>
        </div>
      </div>
    );
  }

  if (!careSummary) {
    return (
      <div className="container">
        <div className="card">
          <div className="error">
            <h3>Unable to generate care summary</h3>
            <p>We couldn't create your personalized care summary. Please try again.</p>
            <button 
              className="btn btn-primary" 
              onClick={() => window.location.reload()}
              style={{ marginTop: '16px' }}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
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
            className="btn btn-secondary"
            onClick={() => navigate('/cost-estimate')}
          >
            Back to Cost Estimate
          </button>
          <button
            className="btn btn-primary"
            onClick={handleConfirmBooking}
            style={{ flex: '1' }}
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIGeneratedCareSummary; 