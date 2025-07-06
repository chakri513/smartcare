import { useEffect } from 'react';

// Analytics tracking for user interactions
export const trackEvent = (eventName, eventData = {}) => {
  // In a real implementation, this would send data to analytics service
  console.log('Analytics Event:', eventName, eventData);
  
  // Store in localStorage for demo purposes
  try {
    const analytics = JSON.parse(localStorage.getItem('analytics') || '[]');
    analytics.push({
      timestamp: new Date().toISOString(),
      event: eventName,
      data: eventData
    });
    localStorage.setItem('analytics', JSON.stringify(analytics.slice(-100))); // Keep last 100 events
  } catch (error) {
    console.error('Error tracking analytics:', error);
  }
};

// Hook for tracking page views
export const usePageTracking = (pageName) => {
  useEffect(() => {
    trackEvent('page_view', { page: pageName });
  }, [pageName]);
};

// Hook for tracking user interactions
export const useInteractionTracking = () => {
  const trackInteraction = (action, details = {}) => {
    trackEvent('user_interaction', {
      action,
      ...details,
      timestamp: new Date().toISOString()
    });
  };

  return { trackInteraction };
};

// Analytics component for admin view
export const Analytics = () => {
  const getAnalytics = () => {
    try {
      return JSON.parse(localStorage.getItem('analytics') || '[]');
    } catch (error) {
      return [];
    }
  };

  const clearAnalytics = () => {
    localStorage.removeItem('analytics');
    window.location.reload();
  };

  const analytics = getAnalytics();

  const eventCounts = analytics.reduce((acc, event) => {
    acc[event.event] = (acc[event.event] || 0) + 1;
    return acc;
  }, {});

  return (
    <div style={{ marginTop: '20px' }}>
      <h3>Analytics Data ({analytics.length} events)</h3>
      <div style={{ marginBottom: '16px' }}>
        <button 
          className="btn btn-secondary" 
          onClick={clearAnalytics}
          style={{ marginRight: '12px' }}
        >
          Clear Analytics
        </button>
        <button 
          className="btn btn-primary" 
          onClick={() => {
            const dataStr = JSON.stringify(analytics, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'analytics.json';
            link.click();
          }}
        >
          Export Analytics
        </button>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h4>Event Summary</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          {Object.entries(eventCounts).map(([event, count]) => (
            <div key={event} style={{ 
              background: '#f8f9fa', 
              padding: '12px', 
              borderRadius: '8px',
              border: '1px solid #e1e5e9'
            }}>
              <strong>{event}:</strong> {count}
            </div>
          ))}
        </div>
      </div>
      
      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
        <h4>Recent Events</h4>
        {analytics.slice(-10).reverse().map((event, index) => (
          <div key={index} style={{ 
            border: '1px solid #e1e5e9', 
            padding: '8px', 
            margin: '4px 0', 
            borderRadius: '4px',
            background: '#f9f9f9',
            fontSize: '12px'
          }}>
            <strong>{event.event}</strong> - {new Date(event.timestamp).toLocaleString()}
            {event.data && Object.keys(event.data).length > 0 && (
              <pre style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#666' }}>
                {JSON.stringify(event.data, null, 2)}
              </pre>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}; 