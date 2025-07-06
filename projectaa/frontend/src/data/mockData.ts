import { Provider, Review, InsuranceInfo } from '../types';

export const mockProviders: Provider[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    specialty: 'Internal Medicine',
    rating: 4.8,
    reviewCount: 127,
    distance: 1.2,
    address: '123 Medical Plaza, Suite 200, Downtown',
    phone: '(555) 123-4567',
    imageUrl: 'https://images.pexels.com/photos/5407206/pexels-photo-5407206.jpeg?auto=compress&cs=tinysrgb&w=400',
    inNetwork: true,
    nextAvailable: '2024-01-15T09:00:00',
    languages: ['English', 'Spanish'],
    education: ['Harvard Medical School', 'Johns Hopkins Residency'],
    certifications: ['Board Certified Internal Medicine', 'Advanced Cardiac Life Support'],
    waitTime: '15 minutes',
    acceptingNewPatients: true,
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    specialty: 'Family Medicine',
    rating: 4.6,
    reviewCount: 89,
    distance: 2.1,
    address: '456 Health Center Dr, Medical District',
    phone: '(555) 234-5678',
    imageUrl: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=400',
    inNetwork: true,
    nextAvailable: '2024-01-16T14:30:00',
    languages: ['English', 'Mandarin'],
    education: ['Stanford Medical School', 'UCSF Residency'],
    certifications: ['Board Certified Family Medicine', 'Geriatric Medicine Certificate'],
    waitTime: '20 minutes',
    acceptingNewPatients: true,
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    specialty: 'Urgent Care',
    rating: 4.7,
    reviewCount: 203,
    distance: 0.8,
    address: '789 Quick Care Blvd, Urgent Care Center',
    phone: '(555) 345-6789',
    imageUrl: 'https://images.pexels.com/photos/5407764/pexels-photo-5407764.jpeg?auto=compress&cs=tinysrgb&w=400',
    inNetwork: true,
    nextAvailable: '2024-01-15T11:15:00',
    languages: ['English', 'Spanish', 'Portuguese'],
    education: ['UCLA Medical School', 'Emergency Medicine Residency'],
    certifications: ['Board Certified Emergency Medicine', 'Advanced Trauma Life Support'],
    waitTime: '45 minutes',
    acceptingNewPatients: true,
  },
];

export const mockReviews: Review[] = [
  {
    id: '1',
    providerId: '1',
    patientName: 'Jennifer M.',
    rating: 5,
    comment: 'Dr. Johnson is incredibly thorough and takes time to listen. She explained my condition clearly and provided excellent care.',
    date: '2024-01-01T00:00:00',
    verified: true,
  },
  {
    id: '2',
    providerId: '1',
    patientName: 'Robert K.',
    rating: 5,
    comment: 'Outstanding physician! Very professional and knowledgeable. The office staff is also wonderful.',
    date: '2023-12-28T00:00:00',
    verified: true,
  },
  {
    id: '3',
    providerId: '2',
    patientName: 'Maria L.',
    rating: 4,
    comment: 'Dr. Chen is very caring and patient. Great bedside manner with children and adults alike.',
    date: '2024-01-03T00:00:00',
    verified: true,
  },
];

export const insuranceProviders = [
  'Blue Cross Blue Shield',
  'Aetna',
  'UnitedHealth',
  'Cigna',
  'Humana',
  'Kaiser Permanente',
  'Anthem',
  'Molina Healthcare',
];

export const planTypes = [
  'HMO',
  'PPO',
  'EPO',
  'POS',
  'HDHP',
];

export const symptoms = [
  'Fever',
  'Cough',
  'Headache',
  'Fatigue',
  'Nausea',
  'Chest Pain',
  'Back Pain',
  'Joint Pain',
  'Shortness of Breath',
  'Dizziness',
  'Abdominal Pain',
  'Skin Rash',
];

export const specialties = [
  'Internal Medicine',
  'Family Medicine',
  'Urgent Care',
  'Cardiology',
  'Dermatology',
  'Orthopedics',
  'Gastroenterology',
  'Neurology',
  'Oncology',
  'Psychiatry',
];

// Insurance plans
export const insurancePlans = [
  { id: 'planA', name: 'Plan A', deductible: 500, copay: 20, coinsurance: 0.2 },
  { id: 'planB', name: 'Plan B', deductible: 1000, copay: 10, coinsurance: 0.1 },
];

// CPT codes (procedures)
export const cptCodes = [
  { code: '99213', description: 'Office visit', price: 150 },
  { code: '80050', description: 'General health panel', price: 200 },
  { code: '93000', description: 'Electrocardiogram', price: 100 },
];

// Plan + CPT pricing (mock logic)
export const planCptPricing: Record<string, Record<string, { allowed: number; patientPays: number }>> = {
  planA: {
    '99213': { allowed: 120, patientPays: 44 },
    '80050': { allowed: 180, patientPays: 56 },
    '93000': { allowed: 90, patientPays: 32 },
  },
  planB: {
    '99213': { allowed: 100, patientPays: 30 },
    '80050': { allowed: 150, patientPays: 40 },
    '93000': { allowed: 80, patientPays: 20 },
  },
};