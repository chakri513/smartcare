import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserData } from '../context/UserDataContext';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useUserData();
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);

  useEffect(() => {
    fetchUserBookings();
  }, []);

  const fetchUserBookings = async () => {
    try {
      // Get user ID from context
      const user = state.user;
      if (!user || !user.id) {
        navigate('/login');
        return;
      }

      // Fetch user's bookings from backend
      const response = await fetch(`http://127.0.0.1:8000/api/bookings/user/${user.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        let bookings = await response.json();
        // Filter for future appointments only
        const now = new Date();
        bookings = bookings.filter(b => new Date(b.appointment_time) > now);
        // Fetch provider details for each booking
        const enriched = await Promise.all(bookings.map(async (booking) => {
          try {
            const providerRes = await fetch(`http://127.0.0.1:8000/api/providers/${booking.provider_id}`);
            if (providerRes.ok) {
              const provider = await providerRes.json();
              return {
                ...booking,
                providerName: provider.name,
                specialty: provider.specialty,
                location: provider.address,
                date: booking.appointment_time,
                time: new Date(booking.appointment_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              };
            }
          } catch (e) {}
          return {
            ...booking,
            providerName: 'Unknown',
            specialty: '',
            location: '',
            date: booking.appointment_time,
            time: new Date(booking.appointment_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
        }));
        setUpcomingAppointments(enriched);
      } else {
        setUpcomingAppointments([]);
      }
    } catch (error) {
      setUpcomingAppointments([]);
    }
  };

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/');
  };

  const handleStartIntake = () => {
    navigate('/intake');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return '#28a745';
      case 'pending': return '#ffc107';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed': return 'Confirmed';
      case 'pending': return 'Pending';
      case 'cancelled': return 'Cancelled';
      default: return 'Unknown';
    }
  };

  if (!state.user) {
    console.log('No user found in state, redirecting to login');
    console.log('Current state:', state);
    navigate('/login');
    return null;
  }

  console.log('Dashboard rendering with user:', state.user);

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '20px 0',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div className="container">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
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
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <span style={{ fontSize: '14px' }}>
                Welcome, {state.user.name}!
              </span>
              <button
                onClick={handleLogout}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
                onMouseOut={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container" style={{ padding: '40px 20px' }}>
        {/* Welcome Section */}
        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '30px',
          marginBottom: '30px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <h2 style={{ color: '#333', marginBottom: '10px', fontSize: '28px' }}>
                Welcome back, {state.user.name}! 👋
              </h2>
              <p style={{ color: '#666', fontSize: '16px', marginBottom: '20px' }}>
                Manage your healthcare appointments and find the best providers for your needs.
              </p>
            </div>
            <button
              onClick={handleStartIntake}
              style={{
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
              Find Healthcare Provider
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '25px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            borderLeft: '4px solid #4CAF50'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{
                width: '50px',
                height: '50px',
                background: '#e8f5e8',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px'
              }}>
                📅
              </div>
              <div>
                <h3 style={{ margin: 0, color: '#333', fontSize: '24px' }}>
                  {upcomingAppointments.length}
                </h3>
                <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                  Upcoming Appointments
                </p>
              </div>
            </div>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '25px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            borderLeft: '4px solid #2196F3'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{
                width: '50px',
                height: '50px',
                background: '#e3f2fd',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px'
              }}>
                🏥
              </div>
              <div>
                <h3 style={{ margin: 0, color: '#333', fontSize: '24px' }}>
                  15+
                </h3>
                <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                  Available Providers
                </p>
              </div>
            </div>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '25px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            borderLeft: '4px solid #FF9800'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{
                width: '50px',
                height: '50px',
                background: '#fff3e0',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px'
              }}>
                💰
              </div>
              <div>
                <h3 style={{ margin: 0, color: '#333', fontSize: '24px' }}>
                  ₹2,500
                </h3>
                <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                  Estimated Savings
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '30px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#333', marginBottom: '20px', fontSize: '20px' }}>
            Upcoming Appointments
          </h3>
          
          {upcomingAppointments.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: '#666'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '15px' }}>📅</div>
              <h4 style={{ marginBottom: '10px', color: '#333' }}>No upcoming appointments</h4>
              <p style={{ marginBottom: '20px' }}>
                Start by finding a healthcare provider that matches your needs.
              </p>
              <button
                onClick={handleStartIntake}
                style={{
                  background: '#4CAF50',
                  border: 'none',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Book Appointment
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {upcomingAppointments.map(appointment => (
                <div key={appointment._id || appointment.id} style={{
                  border: '1px solid #e9ecef',
                  borderRadius: '10px',
                  padding: '20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '15px'
                }}>
                  <div style={{ flex: 1, minWidth: '250px' }}>
                    <h4 style={{ margin: '0 0 5px 0', color: '#333', fontSize: '16px' }}>
                      {appointment.providerName}
                    </h4>
                    <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '14px' }}>
                      {appointment.specialty}
                    </p>
                    <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                      📍 {appointment.location}
                    </p>
                  </div>
                  
                  <div style={{ textAlign: 'center', minWidth: '120px' }}>
                    <div style={{ fontWeight: '600', color: '#333', fontSize: '14px' }}>
                      {formatDate(appointment.date)}
                    </div>
                    <div style={{ color: '#666', fontSize: '14px' }}>
                      {appointment.time}
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'center', minWidth: '100px' }}>
                    <span style={{
                      background: getStatusColor(appointment.status),
                      color: 'white',
                      padding: '6px 12px',
                      borderRadius: '15px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {getStatusText(appointment.status)}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button style={{
                      background: '#007bff',
                      border: 'none',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '15px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => e.target.style.background = '#0056b3'}
                    onMouseOut={(e) => e.target.style.background = '#007bff'}
                    >
                      Reschedule
                    </button>
                    <button style={{
                      background: '#dc3545',
                      border: 'none',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '15px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => e.target.style.background = '#c82333'}
                    onMouseOut={(e) => e.target.style.background = '#dc3545'}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 