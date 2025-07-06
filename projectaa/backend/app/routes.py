from fastapi import APIRouter
from app.models import Entry, QuestionRequest, AppointmentDetails, ButtonClickEvent, AIQueryLog, CareTipAccess, ErrorLog
from app.database import entry_collection
from langchain_huggingface import HuggingFaceEndpoint
import os
from pydantic import BaseModel
from app.database import appointment_collection
from app.database import cost_estimation_collection
from app.database import button_click_collection
from app.database import ai_query_log_collection
from app.database import care_tip_access_collection
from app.database import error_log_collection

# Mock data for insurance plans and CPT pricing
INSURANCE_PLANS = {
    "PlanA": {"deductible": 500, "copay": 20, "coinsurance": 0.2, "max_out_of_pocket": 2000},
    "PlanB": {"deductible": 1000, "copay": 10, "coinsurance": 0.1, "max_out_of_pocket": 3000},
}

CPT_PRICING = {
    "99213": 150,  # Office visit
    "80050": 200,  # General health panel
    "93000": 100,  # EKG
}

class CostEstimateRequest(BaseModel):
    plan: str
    cpt_code: str

router = APIRouter()

@router.post("/")
async def submit_entry(entry: Entry):
    result = await entry_collection.insert_one(entry.dict())
    return {"message": "Entry saved!", "id": str(result.inserted_id)}

@router.get("/")
async def get_entries():
    entries = []
    cursor = entry_collection.find()
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        entries.append(doc)
    return entries

@router.post("/ask")
async def ask_langchain(request: QuestionRequest):
    try:
        question = request.question
        hf_token = "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"
        llm = HuggingFaceEndpoint(
            repo_id="google/flan-t5-base",
            huggingfacehub_api_token=hf_token
        )
        answer = llm.invoke(question)
        return {"answer": answer}
    except Exception as e:
        return {"error": str(e)}

@router.post("/estimate_cost")
def estimate_cost(request: CostEstimateRequest):
    plan = INSURANCE_PLANS.get(request.plan)
    procedure_cost = CPT_PRICING.get(request.cpt_code)
    if not plan or not procedure_cost:
        return {"error": "Invalid plan or CPT code"}

    deductible = plan["deductible"]
    copay = plan["copay"]
    coinsurance = plan["coinsurance"]

    # For simplicity, assume deductible not met
    out_of_pocket = min(procedure_cost, deductible) + copay + (procedure_cost - deductible) * coinsurance
    out_of_pocket = min(out_of_pocket, plan["max_out_of_pocket"])

    return {
        "plan": request.plan,
        "cpt_code": request.cpt_code,
        "procedure_cost": procedure_cost,
        "estimated_out_of_pocket": out_of_pocket
    }

@router.post("/save_appointment")
async def save_appointment(details: AppointmentDetails):
    result = await appointment_collection.insert_one(details.dict())
    return {"message": "Appointment saved!", "id": str(result.inserted_id)}

@router.post("/save_cost_estimation")
async def save_cost_estimation(data: CostEstimateRequest):
    result = await cost_estimation_collection.insert_one(data.dict())
    return {"message": "Cost estimation saved!", "id": str(result.inserted_id)}

@router.get("/care_navigation_tip")
def get_care_navigation_tip():
    # You can randomize or rotate tips if you want!
    return {
        "tip": "Bring your insurance card and a list of current medications to your appointment."
    }

@router.post("/log_button_click")
async def log_button_click(event: ButtonClickEvent):
    result = await button_click_collection.insert_one(event.dict())
    return {"message": "Button click logged!", "id": str(result.inserted_id)}

@router.post("/log_ai_query")
async def log_ai_query(log: AIQueryLog):
    result = await ai_query_log_collection.insert_one(log.dict())
    return {"message": "AI query logged!", "id": str(result.inserted_id)}

@router.post("/log_care_tip_access")
async def log_care_tip_access(log: CareTipAccess):
    result = await care_tip_access_collection.insert_one(log.dict())
    return {"message": "Care tip access logged!", "id": str(result.inserted_id)}

@router.post("/log_error")
async def log_error(log: ErrorLog):
    result = await error_log_collection.insert_one(log.dict())
    return {"message": "Error logged!", "id": str(result.inserted_id)}
