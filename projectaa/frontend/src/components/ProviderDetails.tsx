import React from 'react';
import { Provider, Review } from '../types';
import { Star, MapPin, Phone, Clock, Languages, GraduationCap, Award, ArrowLeft } from 'lucide-react';
import { mockReviews } from '../data/mockData';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

interface ProviderDetailsProps {
  provider: Provider;
  onBack: () => void;
  onBookAppointment: (provider: Provider) => void;
}

export const ProviderDetails: React.FC<ProviderDetailsProps> = ({
  provider,
  onBack,
  onBookAppointment,
}) => {
  const providerReviews = mockReviews.filter(review => review.providerId === provider.id);

  const formatNextAvailable = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {Array.from({ length: 5 }, (_, index) => (
          <Star
            key={index}
            size={16}
            className={`${
              index < rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  // Google Maps setup
  const containerStyle = {
    width: '100%',
    height: '250px',
    marginTop: '1rem',
    borderRadius: '0.75rem',
    overflow: 'hidden',
  };
  // For demo, use static coordinates. Replace with real geocoding if available.
  const center = provider.lat && provider.lng ? { lat: provider.lat, lng: provider.lng } : { lat: 37.7749, lng: -122.4194 };

  async function askQuestion(question: string) {
    const response = await fetch("http://localhost:8000/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question })
    });
    const data = await response.json();
    console.log(data.answer);
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-blue-100 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Results</span>
          </button>
          
          <div className="flex items-start space-x-6">
            <img
              src={provider.imageUrl}
              alt={provider.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-white"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{provider.name}</h1>
              <p className="text-xl text-blue-100 mb-3">{provider.specialty}</p>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {renderStars(Math.floor(provider.rating))}
                  <span className="font-medium">{provider.rating}</span>
                  <span className="text-blue-200">({provider.reviewCount} reviews)</span>
                </div>
                
                {provider.inNetwork && (
                  <div className="bg-green-500 px-3 py-1 rounded-full text-sm font-medium">
                    In-Network
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Information */}
            <div className="lg:col-span-2 space-y-8">
              {/* Contact & Location */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Contact & Location</h2>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-gray-600">
                    <MapPin size={20} />
                    <div>
                      <p className="font-medium">{provider.address}</p>
                      <p className="text-sm">{provider.distance} miles from your location</p>
                    </div>
                  </div>
                  {/* Google Map */}
                  <div style={containerStyle}>
                    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
                      <GoogleMap
                        mapContainerStyle={{ width: '100%', height: '100%' }}
                        center={center}
                        zoom={14}
                      >
                        <Marker position={center} />
                      </GoogleMap>
                    </LoadScript>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-gray-600">
                    <Phone size={20} />
                    <p>{provider.phone}</p>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-gray-600">
                    <Clock size={20} />
                    <div>
                      <p className="font-medium">Next Available</p>
                      <p className="text-sm">{formatNextAvailable(provider.nextAvailable)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-gray-600">
                    <Languages size={20} />
                    <p>Languages: {provider.languages.join(', ')}</p>
                  </div>
                </div>
              </div>

              {/* Education & Certifications */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Education & Certifications</h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <GraduationCap className="text-blue-600" size={20} />
                      <h3 className="font-medium text-gray-900">Education</h3>
                    </div>
                    <ul className="space-y-1 ml-7">
                      {provider.education.map((edu, index) => (
                        <li key={index} className="text-gray-600">{edu}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Award className="text-blue-600" size={20} />
                      <h3 className="font-medium text-gray-900">Certifications</h3>
                    </div>
                    <ul className="space-y-1 ml-7">
                      {provider.certifications.map((cert, index) => (
                        <li key={index} className="text-gray-600">{cert}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Reviews */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Patient Reviews</h2>
                <div className="space-y-4">
                  {providerReviews.map((review) => (
                    <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <span className="font-medium text-gray-900">{review.patientName}</span>
                          {review.verified && (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                              Verified Patient
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          {renderStars(review.rating)}
                          <span className="text-sm text-gray-500">
                            {new Date(review.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-bold text-gray-900 mb-3">Quick Stats</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rating</span>
                    <span className="font-medium">{provider.rating}/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Distance</span>
                    <span className="font-medium">{provider.distance} miles</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Wait Time</span>
                    <span className="font-medium">{provider.waitTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">New Patients</span>
                    <span className={`font-medium ${
                      provider.acceptingNewPatients ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {provider.acceptingNewPatients ? 'Accepting' : 'Not Accepting'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Book Appointment */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-bold text-gray-900 mb-2">Ready to Book?</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Next available appointment is {formatNextAvailable(provider.nextAvailable)}
                </p>
                <button
                  onClick={() => onBookAppointment(provider)}
                  disabled={!provider.acceptingNewPatients}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {provider.acceptingNewPatients ? 'Book Appointment' : 'Not Available'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};