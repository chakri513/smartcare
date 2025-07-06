import React from 'react';

const LoadingSpinner = ({ message = "Loading...", showProgress = false }) => {
  return (
    <div className="loading" style={{ textAlign: 'center', padding: '40px' }}>
      {showProgress && (
        <div className="progress-bar">
          <div className="progress-fill"></div>
        </div>
      )}
      <div style={{ 
        width: '40px', 
        height: '40px', 
        border: '4px solid #e1e5e9', 
        borderTop: '4px solid #007bff',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 20px'
      }}></div>
      <h2 style={{ marginBottom: '10px', color: '#333' }}>{message}</h2>
      <p style={{ color: '#666', margin: 0 }}>Please wait while we process your request</p>
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner; 