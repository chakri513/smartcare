// Sample data based on the MongoDB collections from the documentation

export const providers = [
  {
    id: "prov_001",
    name: "Dr. Jayanth Kotte",
    specialty: "Cardiologist",
    accepted_insurances: ["Apollo Munich", "Bajaj Allianz", "ICICI Lombard"],
    location: { lat: 16.3067, lng: 80.4365 },
    address: "Apollo Hospital, MG Road, Guntur, Andhra Pradesh",
    rating: 4.8,
    wait_time: "20 mins",
    phone: "+91 863 234 5678",
    email: "dr.rajesh@apollohospital.com",
    experience: "15 years",
    education: "AIIMS Delhi",
    hospital: "Apollo Hospital, Guntur"
  },
  {
    id: "prov_002",
    name: "Dr. Priya Reddy",
    specialty: "Dermatologist",
    accepted_insurances: ["Star Health", "HDFC ERGO", "Max Bupa"],
    location: { lat: 16.5062, lng: 80.6480 },
    address: "Care Hospital, Benz Circle, Vijayawada, Andhra Pradesh",
    rating: 4.9,
    wait_time: "15 mins",
    phone: "+91 866 345 6789",
    email: "dr.priya@carehospital.com",
    experience: "12 years",
    education: "CMC Vellore",
    hospital: "Care Hospital, Vijayawada"
  },
  {
    id: "prov_003",
    name: "Dr. Harish Annem",
    specialty: "Orthopedic Surgeon",
    accepted_insurances: ["Apollo Munich", "Religare", "Cigna TTK"],
    location: { lat: 16.4300, lng: 80.5500 },
    address: "KIMS Hospital, Mangalagiri, Andhra Pradesh",
    rating: 4.7,
    wait_time: "30 mins",
    phone: "+91 864 456 7890",
    email: "dr.suresh@kimshospital.com",
    experience: "18 years",
    education: "Osmania Medical College",
    hospital: "KIMS Hospital, Mangalagiri"
  },
  {
    id: "prov_004",
    name: "Dr. Lakshmi Devi",
    specialty: "Gynecologist",
    accepted_insurances: ["Bajaj Allianz", "Star Health", "HDFC ERGO"],
    location: { lat: 16.4800, lng: 80.6000 },
    address: "Fernandez Hospital, Tadepalli, Andhra Pradesh",
    rating: 4.6,
    wait_time: "25 mins",
    phone: "+91 865 567 8901",
    email: "dr.lakshmi@fernandezhospital.com",
    experience: "14 years",
    education: "Gandhi Medical College",
    hospital: "Fernandez Hospital, Tadepalli"
  },
  {
    id: "prov_005",
    name: "Dr. Visesh Gurram",
    specialty: "Neurologist",
    accepted_insurances: ["ICICI Lombard", "Max Bupa", "Religare"],
    location: { lat: 16.3067, lng: 80.4365 },
    address: "NIMS Hospital, Brodipet, Guntur, Andhra Pradesh",
    rating: 4.9,
    wait_time: "40 mins",
    phone: "+91 863 678 9012",
    email: "dr.venkatesh@nimshospital.com",
    experience: "22 years",
    education: "NIMS Hyderabad",
    hospital: "NIMS Hospital, Guntur"
  },
  {
    id: "prov_006",
    name: "Dr. Anjali Bollapalli",
    specialty: "Pediatrician",
    accepted_insurances: ["Apollo Munich", "Star Health", "Cigna TTK"],
    location: { lat: 16.5062, lng: 80.6480 },
    address: "Rainbow Children's Hospital, Vijayawada, Andhra Pradesh",
    rating: 4.8,
    wait_time: "20 mins",
    phone: "+91 866 789 0123",
    email: "dr.anjali@rainbowhospital.com",
    experience: "16 years",
    education: "KEM Hospital Mumbai",
    hospital: "Rainbow Children's Hospital, Vijayawada"
  },
  {
    id: "prov_007",
    name: "Dr. Arjun Reddy",
    specialty: "General Surgeon",
    accepted_insurances: ["Bajaj Allianz", "HDFC ERGO", "Max Bupa"],
    location: { lat: 16.4300, lng: 80.5500 },
    address: "Sri Sai Hospital, Mangalagiri, Andhra Pradesh",
    rating: 5.0,
    wait_time: "15 mins",
    phone: "+91 864 890 1234",
    email: "dr.mohan@srisaihospital.com",
    experience: "20 years",
    education: "AIIMS Delhi",
    hospital: "AIIMS ,Mangalagiri"
  },
  {
    id: "prov_008",
    name: "Dr. Geetha Kumari",
    specialty: "Ophthalmologist",
    accepted_insurances: ["Apollo Munich", "ICICI Lombard", "Religare"],
    location: { lat: 16.4800, lng: 80.6000 },
    address: "Lakshmi Eye Hospital, Tadepalli, Andhra Pradesh",
    rating: 4.7,
    wait_time: "30 mins",
    phone: "+91 865 901 2345",
    email: "dr.geetha@lakshmieyehospital.com",
    experience: "13 years",
    education: "Sankara Nethralaya",
    hospital: "Lakshmi Eye Hospital, Tadepalli"
  },
  {
    id: "prov_009",
    name: "Dr. Ramesh Babu",
    specialty: "ENT Specialist",
    accepted_insurances: ["Star Health", "Bajaj Allianz", "Cigna TTK"],
    location: { lat: 16.3067, lng: 80.4365 },
    address: "ENT Care Center, Guntur, Andhra Pradesh",
    rating: 4.6,
    wait_time: "25 mins",
    phone: "+91 863 012 3456",
    email: "dr.ramesh@entcarecenter.com",
    experience: "17 years",
    education: "MAMC Delhi",
    hospital: "ENT Care Center, Guntur"
  },
  {
    id: "prov_010",
    name: "Dr. Sunita Reddy",
    specialty: "Psychiatrist",
    accepted_insurances: ["HDFC ERGO", "Max Bupa", "Religare"],
    location: { lat: 16.5062, lng: 80.6480 },
    address: "Mind Wellness Clinic, Vijayawada, Andhra Pradesh",
    rating: 4.8,
    wait_time: "45 mins",
    phone: "+91 866 123 4567",
    email: "dr.sunita@mindwellnessclinic.com",
    experience: "19 years",
    education: "NIMHANS Bangalore",
    hospital: "Mind Wellness Clinic, Vijayawada"
  },
  {
    id: "prov_011",
    name: "Dr. Suresh Kumar",
    specialty: "Cardiologist",
    accepted_insurances: ["Apollo Munich", "ICICI Lombard", "Star Health"],
    location: { lat: 16.3067, lng: 80.4365 },
    address: "Heart Care Clinic, Guntur, Andhra Pradesh",
    rating: 4.9,
    wait_time: "10 mins",
    phone: "+91 863 111 2222",
    email: "dr.suresh@heartcare.com",
    experience: "18 years",
    education: "AIIMS Delhi",
    hospital: "Heart Care Clinic, Guntur"
  },
  {
    id: "prov_012",
    name: "Dr. Meena Sharma",
    specialty: "Dermatologist",
    accepted_insurances: ["Star Health", "Max Bupa", "Religare"],
    location: { lat: 16.5062, lng: 80.6480 },
    address: "Skin Clinic, Benz Circle, Vijayawada, Andhra Pradesh",
    rating: 4.8,
    wait_time: "12 mins",
    phone: "+91 866 222 3333",
    email: "dr.meena@skinclinic.com",
    experience: "14 years",
    education: "CMC Vellore",
    hospital: "Skin Clinic, Vijayawada"
  },
  {
    id: "prov_013",
    name: "Dr. Ravi Teja",
    specialty: "General Physician",
    accepted_insurances: ["HDFC ERGO", "Apollo Munich", "Bajaj Allianz"],
    location: { lat: 16.4300, lng: 80.5500 },
    address: "City Health Center, Mangalagiri, Andhra Pradesh",
    rating: 4.7,
    wait_time: "18 mins",
    phone: "+91 864 333 4444",
    email: "dr.ravi@cityhealth.com",
    experience: "10 years",
    education: "Osmania Medical College",
    hospital: "City Health Center, Mangalagiri"
  },
  {
    id: "prov_014",
    name: "Dr. Anitha Rao",
    specialty: "Neurologist",
    accepted_insurances: ["Max Bupa", "Religare", "ICICI Lombard"],
    location: { lat: 16.3067, lng: 80.4365 },
    address: "NIMS Hospital, Guntur, Andhra Pradesh",
    rating: 4.8,
    wait_time: "22 mins",
    phone: "+91 863 444 5555",
    email: "dr.anitha@nims.com",
    experience: "16 years",
    education: "NIMS Hyderabad",
    hospital: "NIMS Hospital, Guntur"
  },
  {
    id: "prov_015",
    name: "Dr. Kiran Bala",
    specialty: "Pediatrician",
    accepted_insurances: ["Cigna TTK", "Apollo Munich", "Star Health"],
    location: { lat: 16.5062, lng: 80.6480 },
    address: "Rainbow Children's Hospital, Vijayawada, Andhra Pradesh",
    rating: 4.9,
    wait_time: "15 mins",
    phone: "+91 866 555 6666",
    email: "dr.kiran@rainbow.com",
    experience: "12 years",
    education: "KEM Hospital Mumbai",
    hospital: "Rainbow Children's Hospital, Vijayawada"
  },
  {
    id: "prov_016",
    name: "Dr. Prasad Iyer",
    specialty: "ENT Specialist",
    accepted_insurances: ["Bajaj Allianz", "HDFC ERGO", "Star Health"],
    location: { lat: 16.4800, lng: 80.6000 },
    address: "ENT Care Center, Tadepalli, Andhra Pradesh",
    rating: 4.7,
    wait_time: "20 mins",
    phone: "+91 865 666 7777",
    email: "dr.prasad@entcare.com",
    experience: "15 years",
    education: "MAMC Delhi",
    hospital: "ENT Care Center, Tadepalli"
  },
  {
    id: "prov_017",
    name: "Dr. Swathi Reddy",
    specialty: "Gastroenterologist",
    accepted_insurances: ["Religare", "Max Bupa", "ICICI Lombard"],
    location: { lat: 16.3067, lng: 80.4365 },
    address: "Gastro Clinic, Guntur, Andhra Pradesh",
    rating: 4.8,
    wait_time: "17 mins",
    phone: "+91 863 777 8888",
    email: "dr.swathi@gastroclinic.com",
    experience: "11 years",
    education: "JIPMER Puducherry",
    hospital: "Gastro Clinic, Guntur"
  },
  {
    id: "prov_018",
    name: "Dr. Manoj Kumar",
    specialty: "Pulmonologist",
    accepted_insurances: ["Apollo Munich", "Star Health", "HDFC ERGO"],
    location: { lat: 16.5062, lng: 80.6480 },
    address: "Lung Care Center, Vijayawada, Andhra Pradesh",
    rating: 4.9,
    wait_time: "13 mins",
    phone: "+91 866 888 9999",
    email: "dr.manoj@lungcare.com",
    experience: "13 years",
    education: "AIIMS Delhi",
    hospital: "Lung Care Center, Vijayawada"
  },
  {
    id: "prov_019",
    name: "Dr. Sneha Patil",
    specialty: "General Physician",
    accepted_insurances: ["Care Health", "Apollo Munich", "Bajaj Allianz"],
    location: { lat: 16.4300, lng: 80.5500 },
    address: "Care Health Clinic, Mangalagiri, Andhra Pradesh",
    rating: 4.6,
    wait_time: "16 mins",
    phone: "+91 864 999 0000",
    email: "dr.sneha@carehealth.com",
    experience: "9 years",
    education: "Osmania Medical College",
    hospital: "Care Health Clinic, Mangalagiri"
  },
  {
    id: "prov_101",
    name: "Dr. Priya Sharma",
    specialty: "Dermatologist",
    accepted_insurances: ["HDFC ERGO", "My Health", "Star Health"],
    location: { lat: 16.3067, lng: 80.4365 },
    address: "Skin Wellness Clinic, Guntur, Andhra Pradesh - 522034",
    rating: 4.9,
    wait_time: "10 mins",
    phone: "+91 863 123 4567",
    email: "dr.priya@skinwellness.com",
    experience: "15 years",
    education: "AIIMS Delhi",
    hospital: "Skin Wellness Clinic, Guntur"
  },
  {
    id: "prov_102",
    name: "Dr. Ravi Kumar",
    specialty: "General Physician",
    accepted_insurances: ["HDFC ERGO", "My Health", "Apollo Munich"],
    location: { lat: 16.3070, lng: 80.4370 },
    address: "City Health Center, Guntur, Andhra Pradesh - 522034",
    rating: 4.8,
    wait_time: "12 mins",
    phone: "+91 863 234 5678",
    email: "dr.ravi@cityhealth.com",
    experience: "12 years",
    education: "Osmania Medical College",
    hospital: "City Health Center, Guntur"
  },
  {
    id: "prov_103",
    name: "Dr. Sneha Reddy",
    specialty: "Pulmonologist",
    accepted_insurances: ["HDFC ERGO", "My Health", "Max Bupa"],
    location: { lat: 16.3080, lng: 80.4380 },
    address: "Lung Care Clinic, Guntur, Andhra Pradesh - 522034",
    rating: 4.7,
    wait_time: "15 mins",
    phone: "+91 863 345 6789",
    email: "dr.sneha@lungcare.com",
    experience: "10 years",
    education: "CMC Vellore",
    hospital: "Lung Care Clinic, Guntur"
  }
];

export const insurance_plans = [
  {
    id: "ins_001",
    company: "Apollo Munich",
    plan: "Optima Restore",
    cpt_coverage: {
      "99213": 0.85,
      "80050": 0.75,
      "99214": 0.90,
      "99215": 0.95
    }
  },
  {
    id: "ins_002",
    company: "Bajaj Allianz",
    plan: "Health Guard",
    cpt_coverage: {
      "99213": 0.80,
      "80050": 0.70,
      "99214": 0.85,
      "99215": 0.90
    }
  },
  {
    id: "ins_003",
    company: "ICICI Lombard",
    plan: "Health Booster",
    cpt_coverage: {
      "99213": 0.75,
      "80050": 0.65,
      "99214": 0.80,
      "99215": 0.85
    }
  },
  {
    id: "ins_004",
    company: "Star Health",
    plan: "Medi Classic",
    cpt_coverage: {
      "99213": 0.90,
      "80050": 0.80,
      "99214": 0.95,
      "99215": 0.95
    }
  },
  {
    id: "ins_005",
    company: "HDFC ERGO",
    plan: "Health Suraksha",
    cpt_coverage: {
      "99213": 0.82,
      "80050": 0.72,
      "99214": 0.87,
      "99215": 0.92
    }
  },
  {
    id: "ins_006",
    company: "Max Bupa",
    plan: "Health Companion",
    cpt_coverage: {
      "99213": 0.78,
      "80050": 0.68,
      "99214": 0.83,
      "99215": 0.88
    }
  },
  {
    id: "ins_007",
    company: "Religare",
    plan: "Care",
    cpt_coverage: {
      "99213": 0.88,
      "80050": 0.78,
      "99214": 0.93,
      "99215": 0.93
    }
  },
  {
    id: "ins_008",
    company: "Cigna TTK",
    plan: "ProHealth",
    cpt_coverage: {
      "99213": 0.85,
      "80050": 0.75,
      "99214": 0.90,
      "99215": 0.90
    }
  },
  {
    id: "ins_009",
    company: "Care Health",
    plan: "Care Plus",
    cpt_coverage: {
      "99213": 0.88,
      "80050": 0.78,
      "99214": 0.93,
      "99215": 0.93
    }
  },
  {
    id: "ins_010",
    company: "ManipalCigna",
    plan: "ProHealth Plus",
    cpt_coverage: {
      "99213": 0.86,
      "80050": 0.76,
      "99214": 0.91,
      "99215": 0.91
    }
  },
  {
    id: "ins_011",
    company: "Aditya Birla",
    plan: "Activ Health",
    cpt_coverage: {
      "99213": 0.84,
      "80050": 0.74,
      "99214": 0.89,
      "99215": 0.89
    }
  },
  {
    id: "ins_012",
    company: "SBI Health",
    plan: "Arogya Plus",
    cpt_coverage: {
      "99213": 0.87,
      "80050": 0.77,
      "99214": 0.92,
      "99215": 0.92
    }
  },
  {
    id: "ins_013",
    company: "Future Generali",
    plan: "Health Total",
    cpt_coverage: {
      "99213": 0.83,
      "80050": 0.73,
      "99214": 0.88,
      "99215": 0.88
    }
  },
  {
    id: "ins_014",
    company: "Universal Sompo",
    plan: "Health Shield",
    cpt_coverage: {
      "99213": 0.85,
      "80050": 0.75,
      "99214": 0.90,
      "99215": 0.90
    }
  },
  {
    id: "ins_015",
    company: "National Insurance",
    plan: "Mediclaim",
    cpt_coverage: {
      "99213": 0.80,
      "80050": 0.70,
      "99214": 0.85,
      "99215": 0.85
    }
  },
  {
    id: "ins_016",
    company: "New India Assurance",
    plan: "Mediclaim Plus",
    cpt_coverage: {
      "99213": 0.82,
      "80050": 0.72,
      "99214": 0.87,
      "99215": 0.87
    }
  }
];

export const cpt_codes = [
  {
    code: "99213",
    description: "Office or other outpatient visit, established patient, 20-29 minutes",
    base_price: 800
  },
  {
    code: "99214",
    description: "Office or other outpatient visit, established patient, 30-39 minutes",
    base_price: 1200
  },
  {
    code: "99215",
    description: "Office or other outpatient visit, established patient, 40-54 minutes",
    base_price: 1600
  },
  {
    code: "80050",
    description: "General health panel",
    base_price: 600
  },
  {
    code: "99203",
    description: "Office or other outpatient visit, new patient, 30-44 minutes",
    base_price: 1000
  },
  {
    code: "99204",
    description: "Office or other outpatient visit, new patient, 45-59 minutes",
    base_price: 1400
  }
];

export const bookings = [
  {
    id: "book_001",
    user: {
      symptoms: "chest pain",
      location: "Guntur",
      insurance: "Apollo Munich"
    },
    provider_id: "prov_001",
    appointment_time: "2025-01-15T14:00:00Z",
    estimated_cost: 120,
    status: "confirmed"
  },
  {
    id: "book_002",
    user: {
      symptoms: "skin rash",
      location: "Vijayawada",
      insurance: "Star Health"
    },
    provider_id: "prov_002",
    appointment_time: "2025-01-16T10:00:00Z",
    estimated_cost: 180,
    status: "confirmed"
  }
]; 
