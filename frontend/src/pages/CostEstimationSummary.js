import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserData } from '../context/UserDataContext';
import { insurance_plans, cpt_codes } from '../data/sampleData';

const CostEstimationSummary = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useUserData();
  const [costEstimate, setCostEstimate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    calculateCostEstimate();
  }, [calculateCostEstimate]);

  const calculateCostEstimate = () => {
    const { userData, selectedProvider } = state;
    
    // Find the user's insurance plan
    const userInsurance = insurance_plans.find(plan => 
      plan.company === userData.insuranceProvider
    );

    if (!userInsurance) {
      return null;
    }

    // Determine appropriate CPT code based on symptoms
    let cptCode = '99213'; // Default to basic office visit
    if (userData.primarySymptoms.toLowerCase().includes('chest pain')) {
      cptCode = '99214'; // More complex visit
    } else if (userData.primarySymptoms.toLowerCase().includes('rash') || 
               userData.primarySymptoms.toLowerCase().includes('skin')) {
      cptCode = '80050'; // Lab work for skin conditions
    }

    // Find the CPT code details
    const cptDetails = cpt_codes.find(code => code.code === cptCode);
    if (!cptDetails) {
      return null;
    }

    // Calculate coverage percentage
    const coveragePercentage = userInsurance.cpt_coverage[cptCode] || 0.8;
    const basePrice = cptDetails.base_price;
    const coveredAmount = basePrice * coveragePercentage;
    const outOfPocketCost = basePrice - coveredAmount;

    return {
      cptCode,
      cptDescription: cptDetails.description,
      basePrice,
      coveragePercentage: coveragePercentage * 100,
      coveredAmount,
      outOfPocketCost,
              insurance: userData.insuranceProvider,
      provider: selectedProvider
    };
  };

  const handleContinue = () => {
    navigate('/summary');
  };

  if (loading) {
    return (
      <div className="container">
        <div className="card">
          <div className="loading">
            <h2>Calculating your cost estimate...</h2>
            <p>Analyzing your insurance coverage and provider rates</p>
          </div>
        </div>
      </div>
    );
  }

  if (!costEstimate) {
    return (
      <div className="container">
        <div className="card">
          <div className="error">
            <h3>Unable to calculate cost estimate</h3>
            <p>We couldn't determine your cost estimate. Please check your insurance information.</p>
            <button 
              className="btn btn-primary" 
              onClick={() => navigate('/intake')}
              style={{ marginTop: '16px' }}
            >
              Update Insurance Info
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
          Cost Estimate Summary
        </h1>

        <div style={{ 
          background: '#f8f9fa', 
          padding: '20px', 
          borderRadius: '8px', 
          marginBottom: '30px' 
        }}>
          <h3 style={{ marginBottom: '16px' }}>Appointment Details</h3>
          <p><strong>Provider:</strong> {costEstimate.provider.name}</p>
          <p><strong>Specialty:</strong> {costEstimate.provider.specialty}</p>
          <p><strong>Insurance:</strong> {costEstimate.insurance}</p>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ marginBottom: '20px', color: '#333' }}>Cost Breakdown</h2>
          
          <div style={{ 
            border: '2px solid #e1e5e9', 
            borderRadius: '12px', 
            padding: '24px',
            background: 'white'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <h3 style={{ color: '#666', marginBottom: '8px' }}>CPT Code</h3>
                <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{costEstimate.cptCode}</p>
              </div>
              <div>
                <h3 style={{ color: '#666', marginBottom: '8px' }}>Service Description</h3>
                <p style={{ fontSize: '1rem' }}>{costEstimate.cptDescription}</p>
              </div>
            </div>

            <div style={{ 
              borderTop: '1px solid #e1e5e9', 
              paddingTop: '20px',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span>Base Price:</span>
                <span style={{ fontWeight: 'bold' }}>${costEstimate.basePrice}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span>Insurance Coverage ({costEstimate.coveragePercentage}%):</span>
                <span style={{ color: '#28a745', fontWeight: 'bold' }}>
                  -${costEstimate.coveredAmount.toFixed(2)}
                </span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                paddingTop: '12px',
                borderTop: '2px solid #e1e5e9',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                color: '#dc3545'
              }}>
                <span>Your Cost:</span>
                <span>${costEstimate.outOfPocketCost.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ 
          background: '#e8f5e8', 
          padding: '16px', 
          borderRadius: '8px', 
          marginBottom: '30px',
          border: '1px solid #28a745'
        }}>
          <h3 style={{ color: '#155724', marginBottom: '8px' }}>💡 Cost Savings Tip</h3>
          <p style={{ color: '#155724', margin: 0 }}>
            Your insurance covers {costEstimate.coveragePercentage}% of this visit. 
            This is a typical coverage rate for {costEstimate.insurance} plans.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          <button
            className="btn btn-secondary"
            onClick={() => navigate(`/provider/${costEstimate.provider.id}`)}
          >
            Back to Provider
          </button>
          <button
            className="btn btn-primary"
            onClick={handleContinue}
            style={{ flex: '1' }}
          >
            Continue to Care Summary
          </button>
        </div>
      </div>
    </div>
  );
};

export default CostEstimationSummary; 