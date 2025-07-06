import React, { createContext, useContext, useReducer } from 'react';

const UserDataContext = createContext();

const initialState = {
  user: null,
  registeredUsers: [], // Store registered users for login
  userData: {
    name: '',
    phoneNumber: '',
    age: '',
    email: '',
    primarySymptoms: '',
    duration: '',
    urgencyLevel: '',
    severity: '',
    detailedDescription: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    insuranceProvider: '',
    insurancePlan: '',
    memberId: ''
  },
  selectedProvider: null,
  bookingData: null,
  costEstimate: null,
  careSummary: null
};

const userDataReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload
      };
    case 'REGISTER_USER':
      return {
        ...state,
        registeredUsers: [...state.registeredUsers, action.payload]
      };
    case 'LOGIN_USER':
      const user = state.registeredUsers.find(u => 
        u.email === action.payload.email && u.password === action.payload.password
      );
      return {
        ...state,
        user: user ? { ...user, isAuthenticated: true } : null
      };
    case 'SET_USER_DATA':
      return {
        ...state,
        userData: { ...state.userData, ...action.payload }
      };
    case 'SET_SELECTED_PROVIDER':
      return {
        ...state,
        selectedProvider: action.payload
      };
    case 'SET_BOOKING_DATA':
      return {
        ...state,
        bookingData: action.payload
      };
    case 'SET_COST_ESTIMATE':
      return {
        ...state,
        costEstimate: action.payload
      };
    case 'SET_CARE_SUMMARY':
      return {
        ...state,
        careSummary: action.payload
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null
      };
    case 'RESET_DATA':
      return initialState;
    default:
      return state;
  }
};

export const UserDataProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userDataReducer, initialState);

  return (
    <UserDataContext.Provider value={{ state, dispatch }}>
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = () => {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
}; 