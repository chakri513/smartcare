import React from 'react';
import { Star, MapPin, Clock, Phone, CheckCircle, Languages } from 'lucide-react';
import { Provider } from '../types';

interface ProviderCardProps {
  provider: Provider;
  onSelect: (provider: Provider) => void;
  onViewDetails: (provider: Provider) => void;
}

export const ProviderCard: React.FC<ProviderCardProps> = ({ 
  provider, 
  onSelect, 
  onViewDetails 
}) => {
  const formatNextAvailable = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden">
      <div className="p-6">
        {/* Header with photo and basic info */}
        <div className="flex items-start space-x-4 mb-4">
          <img
            src={provider.imageUrl}
            alt={provider.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">{provider.name}</h3>
              {provider.inNetwork && (
                <div className="flex items-center space-x-1 text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  <CheckCircle size={14} />
                  <span className="text-xs font-medium">In-Network</span>
                </div>
              )}
            </div>
            <p className="text-gray-600 font-medium">{provider.specialty}</p>
            
            {/* Rating */}
            <div className="flex items-center space-x-2 mt-2">
              <div className="flex items-center space-x-1">
                <Star className="text-yellow-400 fill-current" size={16} />
                <span className="font-medium text-gray-900">{provider.rating}</span>
              </div>
              <span className="text-gray-500">({provider.reviewCount} reviews)</span>
            </div>
          </div>
        </div>

        {/* Key information */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center space-x-2 text-gray-600">
            <MapPin size={16} />
            <span className="text-sm">{provider.distance} miles away</span>
            <span className="text-gray-400">•</span>
            <span className="text-sm">{provider.address}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-gray-600">
            <Clock size={16} />
            <span className="text-sm">Next available: {formatNextAvailable(provider.nextAvailable)}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-gray-600">
            <Phone size={16} />
            <span className="text-sm">{provider.phone}</span>
          </div>

          {provider.languages.length > 1 && (
            <div className="flex items-center space-x-2 text-gray-600">
              <Languages size={16} />
              <span className="text-sm">Speaks: {provider.languages.join(', ')}</span>
            </div>
          )}
        </div>

        {/* Status indicators */}
        <div className="flex items-center space-x-4 mb-4">
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            provider.acceptingNewPatients 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {provider.acceptingNewPatients ? 'Accepting New Patients' : 'Not Accepting New Patients'}
          </div>
          <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
            ~{provider.waitTime} wait
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex space-x-3">
          <button
            onClick={() => onViewDetails(provider)}
            className="flex-1 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
          >
            View Details
          </button>
          <button
            onClick={() => onSelect(provider)}
            disabled={!provider.acceptingNewPatients}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Select Provider
          </button>
        </div>
      </div>
    </div>
  );
};