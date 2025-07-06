from fastapi import APIRouter, HTTPException
from database import db
from models import Provider

router = APIRouter()

@router.get("/", response_model=list[Provider])
async def list_providers():
    providers = []
    async for p in db.providers.find():
        p["_id"] = str(p["_id"])
        providers.append(Provider(**p))
    return providers

@router.get("/{provider_id}", response_model=Provider)
async def get_provider(provider_id: str):
    provider = await db.providers.find_one({"_id": provider_id})
    if not provider:
        raise HTTPException(status_code=404, detail="Provider not found")
    provider["_id"] = str(provider["_id"])
    return Provider(**provider) 