from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class CostEstimateRequest(BaseModel):
    plan: str
    cpt_code: str

@router.post("/estimate_cost")
def estimate_cost(request: CostEstimateRequest):
    plan = INSURANCE_PLANS.get(request.plan)
    procedure_cost = CPT_PRICING.get(request.cpt_code)
    if not plan or not procedure_cost:
        return {"error": "Invalid plan or CPT code"}

    # Simple rule-based logic
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

# Example mock data
INSURANCE_PLANS = {
    "PlanA": {"deductible": 500, "copay": 20, "coinsurance": 0.2, "max_out_of_pocket": 2000},
    "PlanB": {"deductible": 1000, "copay": 10, "coinsurance": 0.1, "max_out_of_pocket": 3000},
}

CPT_PRICING = {
    "99213": 150,  # Office visit
    "80050": 200,  # General health panel
    "93000": 100,  # EKG
}
