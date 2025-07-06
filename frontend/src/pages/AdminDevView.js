import React, { useState } from 'react';
import { providers, insurance_plans, cpt_codes, bookings } from '../data/sampleData';
import { Analytics } from '../components/Analytics';

const AdminDevView = () => {
  const [activeTab, setActiveTab] = useState('providers');

  const renderProviders = () => (
    <div>
      <h3>Providers Collection ({providers.length} records)</h3>
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {providers.map((provider, index) => (
          <div key={provider.id} style={{ 
            border: '1px solid #ddd', 
            padding: '12px', 
            margin: '8px 0', 
            borderRadius: '4px',
            background: '#f9f9f9'
          }}>
            <h4>Record {index + 1}: {provider.name}</h4>
            <pre style={{ fontSize: '12px', overflow: 'auto' }}>
              {JSON.stringify(provider, null, 2)}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );

  const renderInsurancePlans = () => (
    <div>
      <h3>Insurance Plans Collection ({insurance_plans.length} records)</h3>
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {insurance_plans.map((plan, index) => (
          <div key={plan.id} style={{ 
            border: '1px solid #ddd', 
            padding: '12px', 
            margin: '8px 0', 
            borderRadius: '4px',
            background: '#f9f9f9'
          }}>
            <h4>Record {index + 1}: {plan.company} - {plan.plan}</h4>
            <pre style={{ fontSize: '12px', overflow: 'auto' }}>
              {JSON.stringify(plan, null, 2)}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCptCodes = () => (
    <div>
      <h3>CPT Codes Collection ({cpt_codes.length} records)</h3>
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {cpt_codes.map((code, index) => (
          <div key={code.code} style={{ 
            border: '1px solid #ddd', 
            padding: '12px', 
            margin: '8px 0', 
            borderRadius: '4px',
            background: '#f9f9f9'
          }}>
            <h4>Record {index + 1}: {code.code}</h4>
            <pre style={{ fontSize: '12px', overflow: 'auto' }}>
              {JSON.stringify(code, null, 2)}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );

  const renderBookings = () => (
    <div>
      <h3>Bookings Collection ({bookings.length} records)</h3>
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {bookings.map((booking, index) => (
          <div key={booking.id} style={{ 
            border: '1px solid #ddd', 
            padding: '12px', 
            margin: '8px 0', 
            borderRadius: '4px',
            background: '#f9f9f9'
          }}>
            <h4>Record {index + 1}: {booking.id}</h4>
            <pre style={{ fontSize: '12px', overflow: 'auto' }}>
              {JSON.stringify(booking, null, 2)}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );

  const tabs = [
    { id: 'providers', label: 'Providers', count: providers.length },
    { id: 'insurance', label: 'Insurance Plans', count: insurance_plans.length },
    { id: 'cpt', label: 'CPT Codes', count: cpt_codes.length },
    { id: 'bookings', label: 'Bookings', count: bookings.length },
    { id: 'analytics', label: 'Analytics', count: 'Live' }
  ];

  return (
    <div className="container">
      <div className="card">
        <h1 style={{ marginBottom: '30px', color: '#333' }}>
          Admin / Developer View
        </h1>
        
        <div style={{ 
          background: '#f8f9fa', 
          padding: '16px', 
          borderRadius: '8px', 
          marginBottom: '30px' 
        }}>
          <h3 style={{ marginBottom: '8px' }}>📊 Database Collections</h3>
          <p style={{ margin: 0, color: '#666' }}>
            This view shows the raw data from all MongoDB collections for testing and development purposes.
          </p>
        </div>

        {/* Tab Navigation */}
        <div style={{ 
          display: 'flex', 
          borderBottom: '2px solid #e1e5e9',
          marginBottom: '20px'
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 20px',
                border: 'none',
                background: activeTab === tab.id ? '#007bff' : 'transparent',
                color: activeTab === tab.id ? 'white' : '#666',
                cursor: 'pointer',
                borderBottom: activeTab === tab.id ? '2px solid #007bff' : 'none',
                marginBottom: '-2px'
              }}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ minHeight: '400px' }}>
          {activeTab === 'providers' && renderProviders()}
          {activeTab === 'insurance' && renderInsurancePlans()}
          {activeTab === 'cpt' && renderCptCodes()}
          {activeTab === 'bookings' && renderBookings()}
          {activeTab === 'analytics' && <Analytics />}
        </div>

        <div style={{ 
          background: '#e8f5e8', 
          padding: '16px', 
          borderRadius: '8px', 
          marginTop: '30px',
          border: '1px solid #28a745'
        }}>
          <h3 style={{ color: '#155724', marginBottom: '8px' }}>🔧 Development Notes</h3>
          <ul style={{ color: '#155724', margin: 0, paddingLeft: '20px' }}>
            <li>All data is currently stored in static JavaScript files</li>
            <li>In production, this would connect to MongoDB collections</li>
            <li>Provider matching logic is simplified for demo purposes</li>
            <li>Cost calculations use sample insurance coverage rates</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDevView; 