from pydantic import BaseModel
from typing import List
from typing import Optional

class Entry(BaseModel):
    name: str
    email: str
    phone: str
    dateOfBirth: str
    address: str
    city: str
    state: str
    zipCode: str
    provider: str
    planType: str
    memberId: str
    groupId: str
    primarySymptom: List[str]
    duration: str
    urgency: str
    severity: int
    description: str
    additionalSymptoms: List[str]
    
class QuestionRequest(BaseModel):
    question: str

class AppointmentDetails(BaseModel):
    patient_name: str
    insurance_plan: str
    cpt_code: str
    estimated_cost: float
    date: str
    time: str
    place: str
    doctor: str
    hospital: str

from typing import Optional, Dict

class ButtonClickEvent(BaseModel):
    button_name: str
    timestamp: str
    user_id: Optional[str] = None
    extra_data: Optional[Dict] = None

class AIQueryLog(BaseModel):
    question: str
    answer: str
    timestamp: str
    user_id: Optional[str] = None

class CareTipAccess(BaseModel):
    tip: str
    timestamp: str
    user_id: Optional[str] = None

class ErrorLog(BaseModel):
    error_message: str
    context: Optional[Dict] = None
    timestamp: str
    user_id: Optional[str] = None