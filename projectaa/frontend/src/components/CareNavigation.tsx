import React, { useState } from 'react';
import { Provider, Symptoms } from '../types';
import { Heart, FileText, Clock, Phone, MapPin, AlertTriangle } from 'lucide-react';

interface CareNavigationProps {
  provider: { name: string };
  symptoms: { primarySymptom?: string | string[] };
}

const CareNavigation: React.FC<CareNavigationProps> = ({ provider, symptoms }) => {
  const [tip, setTip] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTip = async () => {
    setLoading(true);
    setError('');
    setTip('');
    try {
      const primarySymptom = Array.isArray(symptoms.primarySymptom)
        ? symptoms.primarySymptom.join(', ')
        : symptoms.primarySymptom || 'your reason';
      const question = `Why is ${provider.name} a good choice for: ${primarySymptom}? What can the patient expect during the visit?`;
      const res = await fetch('/entries/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      setTip(data.answer || 'No tip available.');
    } catch (err) {
      setError('Failed to fetch care navigation tip.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow mt-6">
      <h2 className="text-xl font-bold mb-4">Care Navigation Tips</h2>
      <button onClick={fetchTip} className="bg-green-600 text-white px-4 py-2 rounded mb-2" disabled={loading}>
        {loading ? 'Loading...' : 'Get Care Navigation Tip'}
      </button>
      {tip && <div className="mt-2 p-3 bg-green-50 rounded">{tip}</div>}
      {error && <div className="mt-2 text-red-600">{error}</div>}
    </div>
  );
};

export default CareNavigation;