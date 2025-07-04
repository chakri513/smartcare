import React, { useState, useEffect } from 'react';
import { Heart, ArrowLeft } from 'lucide-react';
import { IntakeForm } from './components/IntakeForm';
import { ProviderCard } from './components/ProviderCard';
import { ProviderDetails } from './components/ProviderDetails';
import { AppointmentBooking } from './components/AppointmentBooking';
import CostEstimator from './components/CostEstimator';
import CareNavigation from './components/CareNavigation';
import { AppState, Provider, Appointment } from './types';
import { mockProviders } from './data/mockData';
import { GoogleMap, LoadScript } from '@react-google-maps/api';

type ViewState = 'intake' | 'results' | 'details' | 'booking' | 'cost' | 'navigation' | 'confirmation';

function App() {
  const [appState, setAppState] = useState<AppState>({
    currentStep: 1,
    user: {},
    insurance: {},
    symptoms: {},
    selectedProviders: [],
  });
  
  const [currentView, setCurrentView] = useState<ViewState>('intake');
  const [entries, setEntries] = useState([]);

  const handleIntakeSubmit = async (user: any, insurance: any, symptoms: any) => {
    try {
      const primarySymptom = Array.isArray(symptoms.primarySymptom)
        ? symptoms.primarySymptom
        : symptoms.primarySymptom
          ? [symptoms.primarySymptom]
          : [];
      const additionalSymptoms = Array.isArray(symptoms.additionalSymptoms)
        ? symptoms.additionalSymptoms.filter((s: string) => typeof s === 'string')
        : (typeof symptoms.additionalSymptoms === 'string' && symptoms.additionalSymptoms ? [symptoms.additionalSymptoms] : []);
      const severity = typeof symptoms.severity === 'string' ? parseInt(symptoms.severity, 10) : symptoms.severity;

      const response = await fetch("http://localhost:8000/entries/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          phone: user.phone,
          dateOfBirth: user.dateOfBirth,
          address: user.address,
          city: user.city,
          state: user.state,
          zipCode: user.zipCode,
          provider: insurance.provider,
          planType: insurance.planType,
          memberId: insurance.memberId,
          groupId: insurance.groupId,
          primarySymptom,
          duration: symptoms.duration,
          urgency: symptoms.urgency,
          severity,
          description: symptoms.description,
          additionalSymptoms
        })
      });

      if (!response.ok) {
        throw new Error("Failed to submit intake form");
      }

      // After successful POST, update frontend state
      setAppState({
        ...appState,
        user,
        insurance,
        symptoms,
        selectedProviders: mockProviders.slice(0, 3), // or use real logic
      });
      setCurrentView("results");
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Something went wrong while submitting your form.");
    }
  };

  const handleProviderSelect = (provider: Provider) => {
    setAppState({
      ...appState,
      selectedProvider: provider,
    });
    setCurrentView('cost');
  };

  const handleViewDetails = (provider: Provider) => {
    setAppState({
      ...appState,
      selectedProvider: provider,
    });
    setCurrentView('details');
  };

  const handleBookAppointment = (provider: Provider) => {
    setAppState({
      ...appState,
      selectedProvider: provider,
    });
    setCurrentView('booking');
  };

  const handleAppointmentConfirm = async (appointment: Appointment) => {
    // Gather all necessary details for saving
    const details = {
      patient_name: appState.user.name,
      insurance_plan: appState.insurance.planType,
      estimated_cost: appState.symptoms.estimatedCost,
      cpt_code: appState.symptoms.cptCode,
      date: appointment.date,
      time: appointment.time,
      place: appState.user.address, // or another field for place
      doctor: appState.selectedProvider?.name,
      hospital: appState.selectedProvider?.hospital || "Unknown" // adjust as needed
    };

    try {
      const response = await fetch("http://localhost:8000/entries/save_appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(details)
      });

      if (!response.ok) {
        throw new Error("Failed to save appointment");
      }

      setAppState({
        ...appState,
        appointment,
      });
      setCurrentView('navigation');
    } catch (error) {
      alert("Failed to save appointment. Please try again.");
      console.error(error);
    }
  };

  const handleBackToResults = () => {
    setCurrentView('results');
  };

  const handleBackToIntake = () => {
    setCurrentView('intake');
  };

  const renderHeader = () => (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Heart className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">SmartCare Navigator</h1>
              <p className="text-sm text-gray-600">Find the right care, at the right cost</p>
            </div>
          </div>
          
          {currentView !== 'intake' && (
            <button
              onClick={handleBackToIntake}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Start Over</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );

  const renderCurrentView = () => {
    switch (currentView) {
      case 'intake':
        return <IntakeForm onSubmit={handleIntakeSubmit} />;
      
      case 'results':
        return (
          <div className="max-w-6xl mx-auto p-6">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Recommended Providers
              </h2>
              <p className="text-gray-600">
                Based on your symptoms, location, and insurance, here are the best providers for you:
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {appState.selectedProviders.map((provider) => (
                <ProviderCard
                  key={provider.id}
                  provider={provider}
                  onSelect={handleProviderSelect}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          </div>
        );
      
      case 'details':
        return appState.selectedProvider ? (
          <ProviderDetails
            provider={appState.selectedProvider}
            onBack={handleBackToResults}
            onBookAppointment={handleBookAppointment}
          />
        ) : null;
      
      case 'booking':
        return appState.selectedProvider ? (
          <AppointmentBooking
            provider={appState.selectedProvider}
            onBack={handleBackToResults}
            onConfirm={handleAppointmentConfirm}
          />
        ) : null;
      
      case 'cost':
        return appState.selectedProvider ? (
          <div className="max-w-6xl mx-auto p-6">
            <div className="mb-6">
              <button
                onClick={handleBackToResults}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors mb-4"
              >
                <ArrowLeft size={20} />
                <span>Back to Results</span>
              </button>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Cost Estimate & Booking
              </h2>
              <p className="text-gray-600">
                Review your estimated costs and book your appointment
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <CostEstimator />
              </div>
              
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Ready to Book?
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <img
                        src={appState.selectedProvider.imageUrl}
                        alt={appState.selectedProvider.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-bold text-gray-900">
                          {appState.selectedProvider.name}
                        </h4>
                        <p className="text-gray-600">
                          {appState.selectedProvider.specialty}
                        </p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleBookAppointment(appState.selectedProvider!)}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      Book Appointment
                    </button>
                  </div>
                </div>
                
                <CareNavigation providerName={appState.selectedProvider.name} reason={appState.symptoms.primarySymptom || "your reason"} />
              </div>
            </div>
          </div>
        ) : null;
      
      case 'navigation':
        return appState.selectedProvider ? (
          <div className="max-w-4xl mx-auto p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Your Care Plan
              </h2>
              <p className="text-gray-600">
                Everything you need to know for your upcoming visit
              </p>
            </div>
            
            <CareNavigation providerName={appState.selectedProvider.name} reason={appState.symptoms.primarySymptom || "your reason"} />
          </div>
        ) : null;
      
      default:
        return <IntakeForm onSubmit={handleIntakeSubmit} />;
    }
  };

  useEffect(() => {
    fetch("http://localhost:8000/entries/")
      .then(res => res.json())
      .then(data => setEntries(data))
      .catch(err => console.error("Failed to fetch entries:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {renderHeader()}
      <main className="py-8">
        {renderCurrentView()}
      </main>
    </div>
  );
}

const containerStyle = {
  width: '400px',
  height: '400px'
};

const center = {
  lat: 37.7749, // Example: San Francisco
  lng: -122.4194
};

function MyMap() {
  return (
    <LoadScript googleMapsApiKey="YOUR_API_KEY_HERE">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
      >
        {/* You can add markers or other components here */}
      </GoogleMap>
    </LoadScript>
  );
}

export default App;