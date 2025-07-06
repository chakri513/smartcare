from fastapi import APIRouter, HTTPException, Query
from database import db
from models import Provider
from typing import List, Optional
import re

router = APIRouter()

@router.get("/", response_model=list[Provider])
async def list_providers():
    providers = []
    async for p in db.providers.find():
        p["_id"] = str(p["_id"])
        providers.append(Provider(**p))
    return providers

@router.get("/match/", response_model=list[Provider])
async def match_providers(
    symptoms: Optional[str] = Query(None, description="Comma-separated symptoms"),
    insurance: Optional[str] = Query(None, description="Insurance provider"),
    location: Optional[str] = Query(None, description="City or location"),
    urgency: Optional[str] = Query(None, description="Urgency level"),
    limit: int = Query(3, description="Number of providers to return")
):
    """
    Match providers based on symptoms, insurance, and location.
    Returns top 3 providers that best match the criteria.
    """
    try:
        # Get all providers
        all_providers = []
        async for p in db.providers.find():
            p["_id"] = str(p["_id"])
            all_providers.append(p)
        
        if not all_providers:
            return []
        
        # Score providers based on matching criteria
        scored_providers = []
        
        for provider in all_providers:
            score = 0
            reasons = []
            
            # Insurance matching (highest priority)
            if insurance and provider.get("accepted_insurances"):
                insurance_lower = insurance.lower()
                provider_insurances = [ins.lower() for ins in provider["accepted_insurances"]]
                
                # Check for exact match
                if insurance_lower in provider_insurances:
                    score += 50
                    reasons.append(f"Accepts {insurance}")
                # Check for partial match (e.g., "Care Health" matches "Care")
                elif any(insurance_lower in ins or ins in insurance_lower for ins in provider_insurances):
                    score += 30
                    reasons.append(f"Accepts similar insurance")
            
            # Location matching
            if location and provider.get("city"):
                location_lower = location.lower()
                provider_city = provider["city"].lower()
                
                if location_lower == provider_city:
                    score += 30
                    reasons.append(f"Located in {provider['city']}")
                elif location_lower in provider_city or provider_city in location_lower:
                    score += 20
                    reasons.append(f"Near {provider['city']}")
            
            # Symptom matching based on specialty
            if symptoms and provider.get("specialty"):
                # Handle symptoms whether they come as comma-separated string or already as list
                if isinstance(symptoms, str):
                    symptoms_list = [s.strip().lower() for s in symptoms.split(",")]
                else:
                    symptoms_list = [s.strip().lower() for s in symptoms]
                specialty_lower = provider["specialty"].lower()
                
                # Define symptom-specialty mappings
                symptom_specialty_map = {
                    "rash": ["dermatology", "general physician", "internal medicine"],
                    "diarrhea": ["gastroenterology", "internal medicine", "general physician", "family medicine"],
                    "fever": ["internal medicine", "general physician", "family medicine", "pediatrics"],
                    "cough": ["pulmonologist", "internal medicine", "general physician", "family medicine"],
                    "headache": ["neurology", "internal medicine", "general physician"],
                    "chest pain": ["cardiology", "internal medicine", "general physician"],
                    "back pain": ["orthopedics", "general physician", "internal medicine"],
                    "joint pain": ["orthopedics", "rheumatology", "general physician"],
                    "fatigue": ["internal medicine", "general physician", "family medicine"],
                    "shortness of breath": ["pulmonologist", "cardiology", "internal medicine"],
                    "abdominal pain": ["gastroenterology", "internal medicine", "general physician"],
                    "dizziness": ["neurology", "internal medicine", "general physician"],
                    "sore throat": ["ent", "internal medicine", "general physician"],
                    "vomiting": ["gastroenterology", "internal medicine", "general physician"],
                    "nausea": ["gastroenterology", "internal medicine", "general physician"]
                }
                
                for symptom in symptoms_list:
                    if symptom in symptom_specialty_map:
                        if specialty_lower in symptom_specialty_map[symptom]:
                            score += 25
                            reasons.append(f"Specializes in {symptom} treatment")
                        elif any(spec in specialty_lower for spec in ["general physician", "internal medicine", "family medicine"]):
                            score += 15
                            reasons.append(f"Can treat {symptom}")
            
            # Rating bonus
            if provider.get("rating"):
                score += provider["rating"] * 2
                reasons.append(f"High rating: {provider['rating']}")
            
            # Wait time bonus (lower wait time = higher score)
            if provider.get("wait_time"):
                wait_time_str = provider["wait_time"]
                # Extract minutes from wait time string
                wait_minutes = re.findall(r'\d+', wait_time_str)
                if wait_minutes:
                    wait_time = int(wait_minutes[0])
                    if wait_time <= 10:
                        score += 10
                        reasons.append("Quick wait time")
                    elif wait_time <= 20:
                        score += 5
                        reasons.append("Reasonable wait time")
            
            # Experience bonus
            if provider.get("experience"):
                exp_str = provider["experience"]
                exp_years = re.findall(r'\d+', exp_str)
                if exp_years:
                    years = int(exp_years[0])
                    if years >= 15:
                        score += 8
                        reasons.append("Highly experienced")
                    elif years >= 10:
                        score += 5
                        reasons.append("Experienced")
            
            # Add provider with score and reasons
            if score > 0:  # Only include providers with some match
                scored_providers.append({
                    **provider,
                    "match_score": score,
                    "match_reasons": reasons
                })
        
        # Sort by score (highest first) and return top providers
        scored_providers.sort(key=lambda x: x["match_score"], reverse=True)
        
        # Return top providers (limit to requested number)
        top_providers = scored_providers[:limit]
        
        return top_providers
        
    except Exception as e:
        print(f"Error in provider matching: {e}")
        # Fallback: return all providers if matching fails
        providers = []
        async for p in db.providers.find():
            p["_id"] = str(p["_id"])
            providers.append(Provider(**p))
        return providers[:limit]

@router.get("/{provider_id}", response_model=Provider)
async def get_provider(provider_id: str):
    provider = await db.providers.find_one({"_id": provider_id})
    if not provider:
        raise HTTPException(status_code=404, detail="Provider not found")
    provider["_id"] = str(provider["_id"])
    return Provider(**provider) 