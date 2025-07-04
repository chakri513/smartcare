import React, { useState } from 'react';
import { User, MapPin, Shield, Stethoscope, AlertCircle } from 'lucide-react';
import { User as UserType, InsuranceInfo, Symptoms } from '../types';
import { insuranceProviders, planTypes, symptoms as symptomsList } from '../data/mockData';

interface IntakeFormProps {
  onSubmit: (user: Partial<UserType>, insurance: Partial<InsuranceInfo>, symptoms: Partial<Symptoms>) => void;
}

interface ValidationErrors {
  [key: string]: string;
}

export const IntakeForm: React.FC<IntakeFormProps> = ({ onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [user, setUser] = useState<Partial<UserType>>({});
  const [insurance, setInsurance] = useState<Partial<InsuranceInfo>>({});
  const [symptoms, setSymptoms] = useState<Partial<Symptoms>>({
    additionalSymptoms: [],
    severity: 5,
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [customSymptom, setCustomSymptom] = useState('');
  const [selectedSymptom, setSelectedSymptom] = useState('');

  const validatePersonalInfo = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!user.name?.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!user.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!user.phone?.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\(\d{3}\)\s\d{3}-\d{4}$|^\d{10}$|^\d{3}-\d{3}-\d{4}$/.test(user.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!user.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else {
      const birthDate = new Date(user.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 0 || age > 120) {
        newErrors.dateOfBirth = 'Please enter a valid date of birth';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateLocationInfo = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!user.address?.trim()) {
      newErrors.address = 'Street address is required';
    }

    if (!user.city?.trim()) {
      newErrors.city = 'City is required';
    }

    if (!user.state?.trim()) {
      newErrors.state = 'State is required';
    }

   if (!user.zipCode?.trim()) {
  newErrors.zipCode = 'PIN code is required';
} else if (!/^[1-9][0-9]{5}$/.test(user.zipCode)) {
  newErrors.zipCode = 'Please enter a valid 6-digit Indian PIN code (e.g., 520001)';
}

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateInsuranceInfo = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!insurance.provider?.trim()) {
      newErrors.provider = 'Insurance provider is required';
    }

    if (!insurance.planType?.trim()) {
      newErrors.planType = 'Plan type is required';
    }

    if (!insurance.memberId?.trim()) {
      newErrors.memberId = 'Member ID is required';
    }

    if (!insurance.groupId?.trim()) {
      newErrors.groupId = 'Group ID is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSymptomsInfo = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!symptoms.primarySymptom || (Array.isArray(symptoms.primarySymptom) && symptoms.primarySymptom.length === 0)) {
      newErrors.primarySymptom = 'Primary symptom is required';
    }

    if (!symptoms.duration?.trim()) {
      newErrors.duration = 'Duration is required';
    }

    if (!symptoms.urgency?.trim()) {
      newErrors.urgency = 'Urgency level is required';
    }

    if (!symptoms.description?.trim()) {
      newErrors.description = 'Please provide a description of your symptoms';
    } else if (symptoms.description.length < 10) {
      newErrors.description = 'Please provide a more detailed description (at least 10 characters)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    let isValid = false;

    switch (currentStep) {
      case 1:
        isValid = validatePersonalInfo();
        break;
      case 2:
        isValid = validateLocationInfo();
        break;
      case 3:
        isValid = validateInsuranceInfo();
        break;
      case 4:
        isValid = validateSymptomsInfo();
        break;
      default:
        isValid = true;
    }

    if (isValid) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
        setErrors({});
      } else {
        onSubmit(user, insurance, symptoms);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  const renderFieldError = (fieldName: string) => {
    if (errors[fieldName]) {
      return (
        <div className="flex items-center space-x-1 mt-1">
          <AlertCircle className="text-red-500" size={14} />
          <span className="text-red-500 text-sm">{errors[fieldName]}</span>
        </div>
      );
    }
    return null;
  };

  const getFieldClassName = (fieldName: string) => {
    const baseClass = "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors";
    return errors[fieldName] 
      ? `${baseClass} border-red-300 bg-red-50` 
      : `${baseClass} border-gray-300`;
  };

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <User className="text-blue-600" size={24} />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
          <p className="text-gray-600">All fields are required to find the best providers for you</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={user.name || ''}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            className={getFieldClassName('name')}
            placeholder="Enter your full name"
          />
          {renderFieldError('name')}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={user.email || ''}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            className={getFieldClassName('email')}
            placeholder="Enter your email"
          />
          {renderFieldError('email')}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={user.phone || ''}
            onChange={(e) => setUser({ ...user, phone: e.target.value })}
            className={getFieldClassName('phone')}
            placeholder="(555) 123-4567"
          />
          {renderFieldError('phone')}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date of Birth <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={user.dateOfBirth || ''}
            onChange={(e) => setUser({ ...user, dateOfBirth: e.target.value })}
            className={getFieldClassName('dateOfBirth')}
            max={new Date().toISOString().split('T')[0]}
          />
          {renderFieldError('dateOfBirth')}
        </div>
      </div>
    </div>
  );

  const renderLocationInfo = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <MapPin className="text-blue-600" size={24} />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Location Information</h2>
          <p className="text-gray-600">We need your address to find nearby providers</p>
        </div>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Street Address <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={user.address || ''}
            onChange={(e) => setUser({ ...user, address: e.target.value })}
            className={getFieldClassName('address')}
            placeholder="123 Main Street"
          />
          {renderFieldError('address')}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={user.city || ''}
              onChange={(e) => setUser({ ...user, city: e.target.value })}
              className={getFieldClassName('city')}
              placeholder="City"
            />
            {renderFieldError('city')}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={user.state || ''}
              onChange={(e) => setUser({ ...user, state: e.target.value })}
              className={getFieldClassName('state')}
              placeholder="State"
            />
            {renderFieldError('state')}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ZIP Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={user.zipCode || ''}
              onChange={(e) => setUser({ ...user, zipCode: e.target.value })}
              className={getFieldClassName('zipCode')}
              placeholder="12345"
            />
            {renderFieldError('zipCode')}
          </div>
        </div>
      </div>
    </div>
  );

  const renderInsuranceInfo = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <Shield className="text-blue-600" size={24} />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Insurance Information</h2>
          <p className="text-gray-600">Insurance details help us find in-network providers and estimate costs</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Insurance Provider <span className="text-red-500">*</span>
          </label>
          <select
            value={insurance.provider || ''}
            onChange={(e) => setInsurance({ ...insurance, provider: e.target.value })}
            className={getFieldClassName('provider')}
          >
            <option value="">Select your insurance provider</option>
            {insuranceProviders.map((provider) => (
              <option key={provider} value={provider}>
                {provider}
              </option>
            ))}
          </select>
          {renderFieldError('provider')}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Plan Type <span className="text-red-500">*</span>
          </label>
          <select
            value={insurance.planType || ''}
            onChange={(e) => setInsurance({ ...insurance, planType: e.target.value })}
            className={getFieldClassName('planType')}
          >
            <option value="">Select plan type</option>
            {planTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {renderFieldError('planType')}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Member ID <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={insurance.memberId || ''}
            onChange={(e) => setInsurance({ ...insurance, memberId: e.target.value })}
            className={getFieldClassName('memberId')}
            placeholder="Enter member ID"
          />
          {renderFieldError('memberId')}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Group ID <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={insurance.groupId || ''}
            onChange={(e) => setInsurance({ ...insurance, groupId: e.target.value })}
            className={getFieldClassName('groupId')}
            placeholder="Enter group ID"
          />
          {renderFieldError('groupId')}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <Shield className="text-blue-600 flex-shrink-0" size={20} />
          <div className="text-sm">
            <p className="font-medium text-blue-800 mb-1">Insurance Information Security</p>
            <p className="text-blue-700">
              Your insurance information is used only to find in-network providers and estimate costs. 
              We do not store or share this information with third parties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSymptomsInfo = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <Stethoscope className="text-blue-600" size={24} />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Symptoms & Concerns</h2>
          <p className="text-gray-600">Help us understand your health concerns to recommend the right care</p>
        </div>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Primary Symptom or Concern <span className="text-red-500">*</span>
          </label>
          <div className="flex space-x-2 mb-2">
            <select
              value={selectedSymptom}
              onChange={e => setSelectedSymptom(e.target.value)}
              className={getFieldClassName('primarySymptom')}
            >
              <option value="">Select symptom</option>
              {symptomsList.map((symptom) => (
                <option key={symptom} value={symptom}>
                  {symptom}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={customSymptom}
              onChange={e => setCustomSymptom(e.target.value)}
              placeholder="Add custom symptom"
              className="border rounded px-2 py-1 flex-1"
            />
            <button
              type="button"
              className="bg-blue-600 text-white px-3 py-1 rounded"
              onClick={() => {
                const current = Array.isArray(symptoms.primarySymptom) ? symptoms.primarySymptom : (symptoms.primarySymptom ? [symptoms.primarySymptom] : []);
                if (selectedSymptom && !current.includes(selectedSymptom)) {
                  setSymptoms({ ...symptoms, primarySymptom: [...current, selectedSymptom] });
                  setSelectedSymptom('');
                } else if (customSymptom.trim() && !current.includes(customSymptom.trim())) {
                  setSymptoms({ ...symptoms, primarySymptom: [...current, customSymptom.trim()] });
                  setCustomSymptom('');
                }
              }}
            >Add</button>
          </div>
          <div className="flex flex-wrap mt-2 gap-2">
            {(Array.isArray(symptoms.primarySymptom) ? symptoms.primarySymptom : (symptoms.primarySymptom ? [symptoms.primarySymptom] : [])).map((symptom, idx) => (
              <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center">
                {symptom}
                <button
                  type="button"
                  className="ml-2 text-blue-600 hover:text-red-600"
                  onClick={() => {
                    const current = Array.isArray(symptoms.primarySymptom) ? symptoms.primarySymptom : (symptoms.primarySymptom ? [symptoms.primarySymptom] : []);
                    setSymptoms({ ...symptoms, primarySymptom: current.filter(s => s !== symptom) });
                  }}
                >×</button>
              </span>
            ))}
          </div>
          {renderFieldError('primarySymptom')}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration <span className="text-red-500">*</span>
            </label>
            <select
              value={symptoms.duration || ''}
              onChange={e => setSymptoms({ ...symptoms, duration: e.target.value })}
              className={getFieldClassName('duration')}
            >
              <option value="">Select duration</option>
              <option value="1-2 hours">1-2 hours</option>
              <option value="3-7 hours">3-7 hours</option>
              <option value="1-2 days">1-2 days</option>
              <option value="3-7 days">3-7 days</option>
              <option value="1-2 weeks">1-2 weeks</option>
              <option value="2-4 weeks">2-4 weeks</option>
              <option value="1+ months">1+ months</option>
            </select>
            {renderFieldError('duration')}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Urgency Level <span className="text-red-500">*</span>
            </label>
            <select
              value={symptoms.urgency || ''}
              onChange={(e) => setSymptoms({ ...symptoms, urgency: e.target.value as 'routine' | 'urgent' | 'emergency' })}
              className={getFieldClassName('urgency')}
            >
              <option value="">Select urgency</option>
              <option value="routine">Routine (can wait)</option>
              <option value="urgent">Urgent (within few days)</option>
              <option value="emergency">Emergency</option>
            </select>
            {renderFieldError('urgency')}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Severity (1-10 scale) <span className="text-red-500">*</span>
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={symptoms.severity || 5}
            onChange={(e) => setSymptoms({ ...symptoms, severity: parseInt(e.target.value) })}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500 mt-1">
            <span>Mild (1)</span>
            <span className="font-medium">Current: {symptoms.severity}</span>
            <span>Severe (10)</span>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Detailed Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={symptoms.description || ''}
            onChange={(e) => setSymptoms({ ...symptoms, description: e.target.value })}
            rows={4}
            className={getFieldClassName('description')}
            placeholder="Please describe your symptoms in detail, including when they started, what makes them better or worse, and any other relevant information..."
          />
          <div className="flex justify-between items-center mt-1">
            {renderFieldError('description')}
            <span className="text-sm text-gray-500">
              {symptoms.description?.length || 0} characters (minimum 10 required)
            </span>
          </div>
        </div>

        {symptoms.urgency === 'emergency' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
              <div className="text-sm">
                <p className="font-medium text-red-800 mb-1">Emergency Symptoms Detected</p>
                <p className="text-red-700 mb-2">
                  If you are experiencing a medical emergency, please call 911 or go to your nearest emergency room immediately.
                </p>
                <p className="text-red-700">
                  This tool is designed for non-emergency healthcare needs. Emergency symptoms require immediate medical attention.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderPersonalInfo();
      case 2:
        return renderLocationInfo();
      case 3:
        return renderInsuranceInfo();
      case 4:
        return renderSymptomsInfo();
      default:
        return renderPersonalInfo();
    }
  };

  const getStepCompletionStatus = () => {
    switch (currentStep) {
      case 1:
        return user.name && user.email && user.phone && user.dateOfBirth;
      case 2:
        return user.address && user.city && user.state && user.zipCode;
      case 3:
        return insurance.provider && insurance.planType && insurance.memberId && insurance.groupId;
      case 4:
        return symptoms.primarySymptom && symptoms.duration && symptoms.urgency && symptoms.description && symptoms.description.length >= 10;
      default:
        return false;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg">
        <div className="p-8">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {Array.from({ length: 4 }, (_, index) => {
                const stepNumber = index + 1;
                const isCompleted = stepNumber < currentStep;
                const isCurrent = stepNumber === currentStep;
                
                return (
                  <React.Fragment key={stepNumber}>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                        isCompleted
                          ? 'bg-green-500 text-white'
                          : isCurrent
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {stepNumber}
                    </div>
                    
                    {index < 3 && (
                      <div
                        className={`flex-1 h-1 mx-4 rounded transition-all duration-200 ${
                          isCompleted ? 'bg-green-500' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
            <p className="text-sm text-gray-600">
              Step {currentStep} of 4 - Complete all required fields to find the best providers for you
            </p>
          </div>

          {renderCurrentStep()}

          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            
            <button
              onClick={handleNext}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                getStepCompletionStatus()
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {currentStep === 4 ? 'Find Providers' : 'Next'}
            </button>
          </div>

          {Object.keys(errors).length > 0 && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertCircle className="text-red-600" size={20} />
                <p className="text-red-800 font-medium">Please correct the errors above to continue</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};