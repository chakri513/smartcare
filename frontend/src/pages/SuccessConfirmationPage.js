import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserData } from '../context/UserDataContext';
import { format } from 'date-fns';

const SuccessConfirmationPage = () => {
  const navigate = useNavigate();
  const { state } = useUserData();

  const handleStartOver = () => {
    navigate('/dashboard');
  };

  const handleViewBooking = () => {
    // In a real app, this would navigate to a booking management page
    alert('Booking management feature would be implemented here');
  };

  if (!state.selectedProvider || !state.bookingData) {
    return (
      <div className="container">
        <div className="card">
          <div className="error">
            <h3>No booking information found</h3>
            <p>Please start over to book an appointment.</p>
            <button 
              className="btn btn-primary" 
              onClick={handleStartOver}
              style={{ marginTop: '16px' }}
            >
              Start Over
            </button>
          </div>
        </div>
      </div>
    );
  }

  const appointmentDate = new Date(state.bookingData.appointment_time);
  const confirmationNumber = `CONF-${Date.now().toString().slice(-8)}`;

  // Fallback logic for estimated cost
  const estimatedCost =
    state.costEstimate?.outOfPocketCost ??
    state.bookingData?.cost ??
    state.bookingData?.outOfPocketCost ??
    null;

  return (
    <div className="container">
      <div className="card" style={{ textAlign: 'center' }}>
        <div style={{ 
          background: '#d4edda', 
          color: '#155724', 
          padding: '20px', 
          borderRadius: '50%', 
          width: '80px', 
          height: '80px', 
          margin: '0 auto 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem'
        }}>
          ✓
        </div>

        <h1 style={{ marginBottom: '10px', color: '#155724' }}>
          Booking Confirmed!
        </h1>
        
        <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '30px' }}>
          Your appointment has been successfully scheduled
        </p>

        <div style={{ 
          background: '#f8f9fa', 
          padding: '24px', 
          borderRadius: '12px', 
          marginBottom: '30px',
          textAlign: 'left'
        }}>
          <h2 style={{ marginBottom: '20px', color: '#333' }}>Appointment Details</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <h3 style={{ color: '#666', marginBottom: '8px' }}>Confirmation Number</h3>
              <p style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#007bff' }}>
                {confirmationNumber}
              </p>
            </div>
            <div>
              <h3 style={{ color: '#666', marginBottom: '8px' }}>Provider</h3>
              <p style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                {state.selectedProvider.name}
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <h3 style={{ color: '#666', marginBottom: '8px' }}>Date & Time</h3>
              <p style={{ fontSize: '1.1rem' }}>
                {format(appointmentDate, 'EEEE, MMMM d, yyyy')}
              </p>
              <p style={{ fontSize: '1.1rem' }}>
                {format(appointmentDate, 'h:mm a')}
              </p>
            </div>
            <div>
              <h3 style={{ color: '#666', marginBottom: '8px' }}>Location</h3>
              <p style={{ fontSize: '1rem' }}>
                {state.selectedProvider.address}
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <h3 style={{ color: '#666', marginBottom: '8px' }}>Specialty</h3>
              <p style={{ fontSize: '1.1rem' }}>
                {state.selectedProvider.specialty}
              </p>
            </div>
            <div>
              <h3 style={{ color: '#666', marginBottom: '8px' }}>Estimated Cost</h3>
              <p style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#dc3545' }}>
                {estimatedCost !== null ? `$${Number(estimatedCost).toFixed(2)}` : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <div style={{ 
          background: '#e3f2fd', 
          padding: '16px', 
          borderRadius: '8px', 
          marginBottom: '30px',
          border: '1px solid #2196f3'
        }}>
          <h3 style={{ color: '#1976d2', marginBottom: '8px' }}>📧 What's Next?</h3>
          <p style={{ color: '#1976d2', margin: 0 }}>
            You'll receive a confirmation email with appointment details and preparation instructions. 
            Please arrive 15 minutes before your scheduled time.
          </p>
        </div>

        <div style={{ 
          background: '#fff3cd', 
          padding: '16px', 
          borderRadius: '8px', 
          marginBottom: '30px',
          border: '1px solid #ffc107'
        }}>
          <h3 style={{ color: '#856404', marginBottom: '8px' }}>📞 Need to Reschedule?</h3>
          <p style={{ color: '#856404', margin: 0 }}>
            Call {state.selectedProvider.phone} or email {state.selectedProvider.email} 
            at least 24 hours before your appointment.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <button
            className="btn btn-secondary"
            onClick={handleStartOver}
          >
            Book Another Appointment
          </button>
          <button
            className="btn btn-primary"
            onClick={handleViewBooking}
          >
            View My Bookings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessConfirmationPage; 