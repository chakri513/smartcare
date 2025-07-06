from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: Optional[str] = None
    #age: Optional[int] = None

class UserOut(BaseModel):
    id: str = Field(..., alias="_id")
    name: str
    email: EmailStr
    phone: Optional[str] = None
    age: Optional[int] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Provider(BaseModel):
    id: str = Field(..., alias="_id")
    name: str
    specialty: str
    address: str
    city: str
    state: str
    pincode: str
    phone: str
    email: str
    rating: float
    wait_time: str
    accepted_insurances: List[str]
    experience: Optional[str] = None
    education: Optional[str] = None
    match_score: Optional[float] = None
    match_reasons: Optional[List[str]] = None

class IntakeForm(BaseModel):
    user_id: str
    primarySymptoms: str  # Keep as str to match frontend, will be converted to list in the route
    duration: str
    urgencyLevel: str
    severity: str
    detailedDescription: str
    address: str
    city: str
    state: str
    pincode: str
    insuranceProvider: str
    insurancePlan: str
    memberId: Optional[str] = None

class Booking(BaseModel):
    user_id: str
    provider_id: str
    appointment_time: datetime
    status: str = "pending" 