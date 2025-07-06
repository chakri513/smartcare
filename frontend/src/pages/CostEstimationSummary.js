import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserData } from '../context/UserDataContext';
import { insurance_plans, cpt_codes } from '../data/sampleData';

const CostEstimationSummary = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useUserData();
  const [costEstimate, setCostEstimate] = useState(null);
  const [loading, setLoading] = useState(true);

  const calculateCostEstimate = useCallback(() => {
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
    
    // Handle symptoms whether they come as array or string
    let symptomsText = '';
    if (Array.isArray(userData.primarySymptoms)) {
      symptomsText = userData.primarySymptoms.join(' ').toLowerCase();
    } else {
      symptomsText = userData.primarySymptoms.toLowerCase();
    }
    
    if (symptomsText.includes('chest pain')) {
      cptCode = '99214'; // More complex visit
    } else if (symptomsText.includes('rash') || symptomsText.includes('skin')) {
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
  }, [state]);

  useEffect(() => {
    const estimate = calculateCostEstimate();
    if (estimate) {
      setCostEstimate(estimate);
    }
    setLoading(false);
  }, [calculateCostEstimate]);

  const handleContinue = () => {
    navigate('/summary');
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
              💰
            </span>
          </div>
          <h2 style={{ color: '#333', marginBottom: '15px', fontSize: '24px', fontWeight: '700' }}>
            Calculating your cost estimate...
          </h2>
          <p style={{ color: '#666', fontSize: '16px', marginBottom: '20px' }}>
            Analyzing your insurance coverage and provider rates
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

  if (!costEstimate) {
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
            Unable to calculate cost estimate
          </h3>
          <p style={{ color: '#666', fontSize: '16px', marginBottom: '25px' }}>
            We couldn't determine your cost estimate. Please check your insurance information.
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
            onClick={() => navigate('/intake')}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
            }}
          >
            Update Insurance Info
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
            onClick={() => navigate(`/provider/${costEstimate.provider.id}`)}
            onMouseOver={(e) => {
              e.target.style.background = 'rgba(102, 126, 234, 0.2)';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'rgba(102, 126, 234, 0.1)';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            Back to Provider
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
            onClick={handleContinue}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 12px 35px rgba(102, 126, 234, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.3)';
            }}
          >
            Continue to Care Summary
          </button>
        </div>
      </div>
    </div>
  );
};

export default CostEstimationSummary; 