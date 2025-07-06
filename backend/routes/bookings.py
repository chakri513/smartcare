from fastapi import APIRouter, HTTPException
from database import db
from models import Booking
from typing import List
from datetime import datetime

router = APIRouter()

@router.post("/", response_model=Booking)
async def create_booking(booking: Booking):
    booking_dict = booking.dict()
    result = await db.bookings.insert_one(booking_dict)
    booking_dict["_id"] = str(result.inserted_id)
    return booking_dict

@router.put("/confirm")
async def confirm_booking(booking: Booking):
    # Find the existing booking and update its status
    existing_booking = await db.bookings.find_one({
        "user_id": booking.user_id,
        "provider_id": booking.provider_id,
        "appointment_time": booking.appointment_time
    })
    
    if not existing_booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    # Update the booking status to confirmed
    result = await db.bookings.update_one(
        {"_id": existing_booking["_id"]},
        {"$set": {"status": "confirmed", "confirmed_at": datetime.utcnow()}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=400, detail="Failed to confirm booking")
    
    return {"message": "Booking confirmed successfully"}

@router.get("/user/{user_id}", response_model=List[Booking])
async def get_user_bookings(user_id: str):
    bookings = []
    async for b in db.bookings.find({"user_id": user_id}):
        b["_id"] = str(b["_id"])
        bookings.append(Booking(**b))
    return bookings

@router.get("/provider/{provider_id}", response_model=List[Booking])
async def get_provider_bookings(provider_id: str):
    bookings = []
    async for b in db.bookings.find({"provider_id": provider_id}):
        b["_id"] = str(b["_id"])
        bookings.append(Booking(**b))
    return bookings 