from fastapi import APIRouter, HTTPException, Query
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
    # First, try to find an existing booking for this user and provider
    existing_booking = await db.bookings.find_one({
        "user_id": booking.user_id,
        "provider_id": booking.provider_id
    })
    
    if existing_booking:
        # Update the existing booking status to confirmed
        result = await db.bookings.update_one(
            {"_id": existing_booking["_id"]},
            {"$set": {
                "status": "confirmed", 
                "confirmed_at": datetime.utcnow(),
                "appointment_time": booking.appointment_time
            }}
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=400, detail="Failed to confirm booking")
        
        return {"message": "Booking confirmed successfully", "booking_id": str(existing_booking["_id"])}
    else:
        # Create a new booking if none exists
        booking_dict = booking.dict()
        booking_dict["status"] = "confirmed"
        booking_dict["confirmed_at"] = datetime.utcnow()
        booking_dict["created_at"] = datetime.utcnow()
        
        result = await db.bookings.insert_one(booking_dict)
        booking_dict["_id"] = str(result.inserted_id)
        
        return {"message": "Booking created and confirmed successfully", "booking_id": booking_dict["_id"]}

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






@router.delete("/cancel/{booking_id}")
async def cancel_booking(booking_id: str):
    result = await db.bookings.delete_one({"_id": booking_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Booking not found or already cancelled")
    return {"message": "Booking cancelled and deleted successfully"}

@router.put("/reschedule/{booking_id}")
async def reschedule_booking(booking_id: str, new_time: str = Query(..., description="New appointment time in ISO format")):
    try:
        new_time_dt = datetime.fromisoformat(new_time)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid date/time format. Use ISO format: YYYY-MM-DDTHH:MM:SS")
    result = await db.bookings.update_one(
        {"_id": booking_id},
        {"$set": {"appointment_time": new_time_dt, "status": "pending", "rescheduled_at": datetime.utcnow()}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Booking not found or could not be rescheduled")
    return {"message": "Booking rescheduled successfully"} 