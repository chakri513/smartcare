from fastapi import APIRouter, HTTPException
from database import db
from models import IntakeForm

router = APIRouter()

@router.post("/", response_model=IntakeForm)
async def submit_intake(form: IntakeForm):
    form_dict = form.dict()
    existing = await db.intake.find_one({"user_id": form.user_id})
    if existing:
        await db.intake.update_one({"user_id": form.user_id}, {"$set": form_dict})
        return form
    result = await db.intake.insert_one(form_dict)
    form_dict["_id"] = str(result.inserted_id)
    return form

@router.get("/{user_id}", response_model=IntakeForm)
async def get_intake(user_id: str):
    form = await db.intake.find_one({"user_id": user_id})
    if not form:
        raise HTTPException(status_code=404, detail="Intake form not found")
    return IntakeForm(**form) 