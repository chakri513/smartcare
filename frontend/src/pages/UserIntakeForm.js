import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserData } from '../context/UserDataContext';
import { 
  validateName, 
  validatePhoneNumber, 
  validateEmail,
  validateAge,
  validateSymptoms, 
  validateLocation, 
  validatePincode, 
  validateInsurance,
  sanitizeInput 
} from '../utils/validation';

const UserIntakeForm = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useUserData();
  const [formData, setFormData] = useState({
    name: state.userData.name || '',
    phoneNumber: state.userData.phoneNumber || '',
    age: state.userData.age || '',
    email: state.userData.email || '',
    primarySymptoms: state.userData.primarySymptoms || '',
    duration: state.userData.duration || '',
    urgencyLevel: state.userData.urgencyLevel || '',
    severity: state.userData.severity || '',
    detailedDescription: state.userData.detailedDescription || '',
    address: state.userData.address || '',
    city: state.userData.city || '',
    state: state.userData.state || '',
    pincode: state.userData.pincode || '',
    insuranceProvider: state.userData.insuranceProvider || '',
    insurancePlan: state.userData.insurancePlan || '',
    memberId: state.userData.memberId || ''
  });
  const [errors, setErrors] = useState({});

  // Check if user is authenticated
  useEffect(() => {
    if (!state.user) {
      navigate('/login');
    }
  }, [state.user, navigate]);

  const insuranceOptions = [
    { value: '', label: 'Select your insurance provider' },
    { value: 'Apollo Munich', label: 'Apollo Munich' },
    { value: 'Bajaj Allianz', label: 'Bajaj Allianz' },
    { value: 'ICICI Lombard', label: 'ICICI Lombard' },
    { value: 'Star Health', label: 'Star Health' },
    { value: 'HDFC ERGO', label: 'HDFC ERGO' },
    { value: 'Max Bupa', label: 'Max Bupa' },
    { value: 'Religare', label: 'Religare' },
    { value: 'Cigna TTK', label: 'Cigna TTK' }
  ];

  const insurancePlans = {
    'Apollo Munich': [
      { value: '', label: 'Select plan' },
      { value: 'Optima Restore', label: 'Optima Restore' },
      { value: 'Optima Secure', label: 'Optima Secure' },
      { value: 'Easy Health', label: 'Easy Health' }
    ],
    'Bajaj Allianz': [
      { value: '', label: 'Select plan' },
      { value: 'Health Guard', label: 'Health Guard' },
      { value: 'Silver Health', label: 'Silver Health' },
      { value: 'Family Floater', label: 'Family Floater' }
    ],
    'ICICI Lombard': [
      { value: '', label: 'Select plan' },
      { value: 'Health Booster', label: 'Health Booster' },
      { value: 'Complete Health', label: 'Complete Health' },
      { value: 'Health Advantage', label: 'Health Advantage' }
    ],
    'Star Health': [
      { value: '', label: 'Select plan' },
      { value: 'Medi Classic', label: 'Medi Classic' },
      { value: 'Senior Citizen', label: 'Senior Citizen' },
      { value: 'Family Health', label: 'Family Health' }
    ],
    'HDFC ERGO': [
      { value: '', label: 'Select plan' },
      { value: 'Health Suraksha', label: 'Health Suraksha' },
      { value: 'My Health', label: 'My Health' },
      { value: 'Optima Restore', label: 'Optima Restore' }
    ],
    'Max Bupa': [
      { value: '', label: 'Select plan' },
      { value: 'Health Companion', label: 'Health Companion' },
      { value: 'Heartbeat', label: 'Heartbeat' },
      { value: 'GoActive', label: 'GoActive' }
    ],
    'Religare': [
      { value: '', label: 'Select plan' },
      { value: 'Care', label: 'Care' },
      { value: 'Care Freedom', label: 'Care Freedom' },
      { value: 'Care Plus', label: 'Care Plus' }
    ],
    'Cigna TTK': [
      { value: '', label: 'Select plan' },
      { value: 'ProHealth', label: 'ProHealth' },
      { value: 'HealthFirst', label: 'HealthFirst' },
      { value: 'Family First', label: 'Family First' }
    ]
  };

  const urgencyLevels = [
    { value: '', label: 'Select urgency level' },
    { value: 'Low', label: 'Low - Can wait a few days' },
    { value: 'Medium', label: 'Medium - Should see doctor soon' },
    { value: 'High', label: 'High - Need immediate attention' },
    { value: 'Emergency', label: 'Emergency - Call 108 immediately' }
  ];

  const durationOptions = [
    { value: '', label: 'Select duration' },
    { value: '1-2 Hours', label: '1-2 Hours' },
    { value: '3-4 Hours', label: '3-4 Hours' },
    { value: 'Less than 1 Day', label: 'Less than 1 Day' },
    { value: '1-2 days', label: '1-2 days' },
    { value: '3-6 days', label: '3-6 days' },
    { value: 'More than 1 weak', label: 'More than 3 weak' }
  ];

  const severityLevels = [
    { value: '', label: 'Select severity (1-10)' },
    { value: '1', label: '1 - Very mild, barely noticeable' },
    { value: '2', label: '2 - Mild, slightly bothersome' },
    { value: '3', label: '3 - Mild to moderate' },
    { value: '4', label: '4 - Moderate, noticeable' },
    { value: '5', label: '5 - Moderate, affecting daily activities' },
    { value: '6', label: '6 - Moderate to severe' },
    { value: '7', label: '7 - Severe, significantly affecting life' },
    { value: '8', label: '8 - Very severe, very difficult to bear' },
    { value: '9', label: '9 - Extremely severe, unbearable' },
    { value: '10', label: '10 - Worst possible pain/symptom' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = sanitizeInput(value);
    
    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Personal Details Validation
    const nameValidation = validateName(formData.name);
    if (!nameValidation.isValid) {
      newErrors.name = nameValidation.error;
    }
    
    const phoneValidation = validatePhoneNumber(formData.phoneNumber);
    if (!phoneValidation.isValid) {
      newErrors.phoneNumber = phoneValidation.error;
    }

    const ageValidation = validateAge(formData.age);
    if (!ageValidation.isValid) {
      newErrors.age = ageValidation.error;
    }

    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.error;
    }
    
    // Symptoms & Concerns Validation
    const symptomsValidation = validateSymptoms(formData.primarySymptoms);
    if (!symptomsValidation.isValid) {
      newErrors.primarySymptoms = symptomsValidation.error;
    }

    if (!formData.duration) {
      newErrors.duration = 'Duration is required';
    }

    if (!formData.urgencyLevel) {
      newErrors.urgencyLevel = 'Urgency level is required';
    }

    if (!formData.severity) {
      newErrors.severity = 'Severity level is required';
    }

    // Detailed Description: require at least one space
    if (!formData.detailedDescription.trim()) {
      newErrors.detailedDescription = 'Detailed description is required';
    } else if (!formData.detailedDescription.includes(' ')) {
      newErrors.detailedDescription = 'Please enter a valid description with spaces.';
    }
    
    // Location Information Validation (all mandatory)
    const addressValidation = validateLocation(formData.address);
    if (!addressValidation.isValid) {
      newErrors.address = addressValidation.error;
    } else if (formData.address.length < 5) {
      newErrors.address = 'Please enter a valid address (at least 5 characters).';
    }
    
    const cityValidation = validateLocation(formData.city);
    if (!cityValidation.isValid) {
      newErrors.city = cityValidation.error;
    }

    // State: only allow alphabetic characters and spaces, mandatory
    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    } else if (!/^[A-Za-z ]+$/.test(formData.state)) {
      newErrors.state = 'State must contain only letters and spaces.';
    }

    const pincodeValidation = validatePincode(formData.pincode);
    if (!pincodeValidation.isValid) {
      newErrors.pincode = pincodeValidation.error;
    }
    
    // Insurance Information Validation (all mandatory)
    if (!formData.insuranceProvider) {
      newErrors.insuranceProvider = 'Insurance provider is required';
    }
    if (!formData.insurancePlan) {
      newErrors.insurancePlan = 'Please select your insurance plan';
    }
    if (!formData.memberId || !formData.memberId.trim()) {
      newErrors.memberId = 'Member ID is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // Get user ID from context or localStorage
      const user = state.user;
      if (!user || !user.id) {
        alert('Please login first');
        navigate('/login');
        return;
      }

      // Prepare data for backend
      const intakeData = {
        user_id: user.id,
        primarySymptoms: formData.primarySymptoms,
        duration: formData.duration,
        urgencyLevel: formData.urgencyLevel,
        severity: formData.severity,
        detailedDescription: formData.detailedDescription,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        insuranceProvider: formData.insuranceProvider,
        insurancePlan: formData.insurancePlan,
        memberId: formData.memberId || null
      };

      // Real API call to backend
      const response = await fetch('http://127.0.0.1:8000/api/intake/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(intakeData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to submit intake form');
      }

      const result = await response.json();
      console.log('Intake form submitted successfully:', result);

      // Store in context for frontend use
      dispatch({
        type: 'SET_USER_DATA',
        payload: formData
      });

      // Navigate to results page
      navigate('/results');
      
    } catch (error) {
      console.error('Intake form submission error:', error);
      alert('Failed to submit form: ' + error.message);
    }
  };

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
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            width: '70px',
            height: '70px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            color: 'white',
            fontWeight: 'bold',
            boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
            margin: '0 auto 20px',
            position: 'relative',
            overflow: 'hidden'
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
              bottom: '10px',
              right: '10px',
              width: '10px',
              height: '10px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '50%'
            }}></div>
            <span style={{ fontSize: '28px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>
              ⚕️
            </span>
          </div>
          <h1 style={{ color: '#333', marginBottom: '15px', fontSize: '32px', fontWeight: '700' }}>Patient Intake Form</h1>
          <p style={{ color: '#666', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
            {state.user?.isNewUser 
              ? "Welcome! Let's get to know you better to find the perfect healthcare provider."
              : "Please update your information to help us find the best healthcare providers for you."
            }
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          {/* Personal Details */}
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ 
              color: '#333', 
              marginBottom: '25px', 
              fontSize: '24px',
              fontWeight: '700',
              position: 'relative',
              paddingBottom: '15px'
            }}>
              <span style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                width: '4px',
                height: '30px',
                position: 'absolute',
                left: '-20px',
                top: '0',
                borderRadius: '2px'
              }}></span>
              Personal Details
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="form-group">
                <label htmlFor="name">Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className={errors.name ? 'error' : ''}
                />
                {errors.name && <div className="error" style={{ marginTop: '8px' }}>{errors.name}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="phoneNumber">Mobile Number *</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="Enter your mobile number"
                  className={errors.phoneNumber ? 'error' : ''}
                />
                {errors.phoneNumber && <div className="error" style={{ marginTop: '8px' }}>{errors.phoneNumber}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="age">Age *</label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  placeholder="Enter your age"
                  min="1"
                  max="120"
                  className={errors.age ? 'error' : ''}
                />
                {errors.age && <div className="error" style={{ marginTop: '8px' }}>{errors.age}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email ID *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <div className="error" style={{ marginTop: '8px' }}>{errors.email}</div>}
              </div>
            </div>
          </div>

          {/* Symptoms & Concerns */}
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ 
              color: '#333', 
              marginBottom: '25px', 
              fontSize: '24px',
              fontWeight: '700',
              position: 'relative',
              paddingBottom: '15px'
            }}>
              <span style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                width: '4px',
                height: '30px',
                position: 'absolute',
                left: '-20px',
                top: '0',
                borderRadius: '2px'
              }}></span>
              Symptoms & Concerns
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div className="form-group">
                <label htmlFor="primarySymptoms">Primary Symptom or Concern *</label>
                <input
                  type="text"
                  id="primarySymptoms"
                  name="primarySymptoms"
                  value={formData.primarySymptoms}
                  onChange={handleInputChange}
                  placeholder="e.g., chest pain, fever, headache"
                  className={errors.primarySymptoms ? 'error' : ''}
                />
                {errors.primarySymptoms && <div className="error" style={{ marginTop: '8px' }}>{errors.primarySymptoms}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="duration">Duration *</label>
                <select
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className={errors.duration ? 'error' : ''}
                >
                  {durationOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                {errors.duration && <div className="error" style={{ marginTop: '8px' }}>{errors.duration}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="urgencyLevel">Urgency Level *</label>
                <select
                  id="urgencyLevel"
                  name="urgencyLevel"
                  value={formData.urgencyLevel}
                  onChange={handleInputChange}
                  className={errors.urgencyLevel ? 'error' : ''}
                >
                  {urgencyLevels.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.urgencyLevel && <div className="error" style={{ marginTop: '8px' }}>{errors.urgencyLevel}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="severity">Severity (1-10 scale) *</label>
                <select
                  id="severity"
                  name="severity"
                  value={formData.severity}
                  onChange={handleInputChange}
                  className={errors.severity ? 'error' : ''}
                >
                  {severityLevels.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.severity && <div className="error" style={{ marginTop: '8px' }}>{errors.severity}</div>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="detailedDescription">Detailed Description *</label>
              <textarea
                id="detailedDescription"
                name="detailedDescription"
                value={formData.detailedDescription}
                onChange={handleInputChange}
                placeholder="Please provide a detailed description of your symptoms, when they started, what makes them better or worse, and any other relevant information..."
                rows="4"
                className={errors.detailedDescription ? 'error' : ''}
              />
              {errors.detailedDescription && <div className="error" style={{ marginTop: '8px' }}>{errors.detailedDescription}</div>}
            </div>
          </div>

          {/* Location Information */}
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ 
              color: '#333', 
              marginBottom: '25px', 
              fontSize: '24px',
              fontWeight: '700',
              position: 'relative',
              paddingBottom: '15px'
            }}>
              <span style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                width: '4px',
                height: '30px',
                position: 'absolute',
                left: '-20px',
                top: '0',
                borderRadius: '2px'
              }}></span>
              Location Information
            </h2>
            
            <div className="form-group">
              <label htmlFor="address">Street Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter your street address"
                className={errors.address ? 'error' : ''}
              />
              {errors.address && <div className="error" style={{ marginTop: '8px' }}>{errors.address}</div>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Enter your city"
                  className={errors.city ? 'error' : ''}
                />
                {errors.city && <div className="error" style={{ marginTop: '8px' }}>{errors.city}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="state">State</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="Enter your state"
                  className={errors.state ? 'error' : ''}
                />
                {errors.state && <div className="error" style={{ marginTop: '8px' }}>{errors.state}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="pincode">Pincode</label>
                <input
                  type="text"
                  id="pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  placeholder="Enter pincode"
                  className={errors.pincode ? 'error' : ''}
                />
                {errors.pincode && <div className="error" style={{ marginTop: '8px' }}>{errors.pincode}</div>}
              </div>
            </div>
          </div>

          {/* Insurance Information */}
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ 
              color: '#333', 
              marginBottom: '25px', 
              fontSize: '24px',
              fontWeight: '700',
              position: 'relative',
              paddingBottom: '15px'
            }}>
              <span style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                width: '4px',
                height: '30px',
                position: 'absolute',
                left: '-20px',
                top: '0',
                borderRadius: '2px'
              }}></span>
              Insurance Information
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="form-group">
                <label htmlFor="insuranceProvider">Insurance Provider</label>
                <select
                  id="insuranceProvider"
                  name="insuranceProvider"
                  value={formData.insuranceProvider}
                  onChange={handleInputChange}
                  className={errors.insuranceProvider ? 'error' : ''}
                >
                  {insuranceOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.insuranceProvider && <div className="error" style={{ marginTop: '8px' }}>{errors.insuranceProvider}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="insurancePlan">Plan Type *</label>
                <select
                  id="insurancePlan"
                  name="insurancePlan"
                  value={formData.insurancePlan}
                  onChange={handleInputChange}
                  className={errors.insurancePlan ? 'error' : ''}
                  disabled={!formData.insuranceProvider}
                >
                  {formData.insuranceProvider 
                    ? insurancePlans[formData.insuranceProvider].map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))
                    : <option value="">Select insurance provider first</option>
                  }
                </select>
                {errors.insurancePlan && <div className="error" style={{ marginTop: '8px' }}>{errors.insurancePlan}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="memberId">Member ID</label>
                <input
                  type="text"
                  id="memberId"
                  name="memberId"
                  value={formData.memberId}
                  onChange={handleInputChange}
                  placeholder="Enter your member ID"
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', marginTop: '40px' }}>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              style={{
                background: 'rgba(102, 126, 234, 0.1)',
                border: '2px solid #667eea',
                color: '#667eea',
                padding: '15px 30px',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                flex: '1'
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'rgba(102, 126, 234, 0.2)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'rgba(102, 126, 234, 0.1)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Back to Dashboard
            </button>
            <button
              type="submit"
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
                flex: '2',
                boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 12px 35px rgba(102, 126, 234, 0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.3)';
              }}
            >
              Find Healthcare Providers
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserIntakeForm; 