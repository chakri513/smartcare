export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface InsuranceInfo {
  provider: string;
  planType: string;
  memberId: string;
  groupId: string;
  copay: number;
  deductible: number;
  deductibleMet: number;
}

export interface Symptoms {
  primarySymptom: string | string[];
  duration: string;
  severity: number;
  additionalSymptoms: string[];
  urgency: 'routine' | 'urgent' | 'emergency';
  description: string;
}

export interface Provider {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviewCount: number;
  distance: number;
  address: string;
  phone: string;
  imageUrl: string;
  inNetwork: boolean;
  nextAvailable: string;
  languages: string[];
  education: string[];
  certifications: string[];
  waitTime: string;
  acceptingNewPatients: boolean;
  lat?: number;
  lng?: number;
}

export interface Review {
  id: string;
  providerId: string;
  patientName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export interface Appointment {
  id: string;
  providerId: string;
  patientId: string;
  date: string;
  time: string;
  type: string;
  status: 'scheduled' | 'confirmed' | 'cancelled';
  reason: string;
}

export interface CostEstimate {
  consultationFee: number;
  copay: number;
  deductibleApplied: number;
  insuranceCoverage: number;
  estimatedOutOfPocket: number;
  additionalTests?: {
    name: string;
    cost: number;
    covered: boolean;
  }[];
}

export interface AppState {
  currentStep: number;
  user: Partial<User>;
  insurance: Partial<InsuranceInfo>;
  symptoms: Partial<Symptoms>;
  selectedProviders: Provider[];
  selectedProvider?: Provider;
  appointment?: Appointment;
  costEstimate?: CostEstimate;
}