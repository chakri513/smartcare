#!/usr/bin/env python3
"""
Script to seed the database with sample healthcare providers
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

MONGODB_URI = "mongodb://localhost:27017"
DB_NAME = "smartcare"

providers = [
    {
        "name": "Dr. Rajesh Kumar",
        "specialty": "Cardiology",
        "address": "Apollo Hospital, Guntur",
        "city": "Guntur",
        "state": "AP",
        "pincode": "522001",
        "phone": "9876543210",
        "email": "rajesh.kumar@apollo.com",
        "rating": 4.8,
        "wait_time": "10 min",
        "accepted_insurances": ["Star Health", "Apollo Munich", "ICICI Lombard"],
        "experience": "15 years",
        "education": "AIIMS Delhi"
    },
    {
        "name": "Dr. Priya Sharma",
        "specialty": "Dermatology",
        "address": "Care Hospital, Vijayawada",
        "city": "Vijayawada",
        "state": "AP",
        "pincode": "520010",
        "phone": "9123456780",
        "email": "priya.sharma@care.com",
        "rating": 4.6,
        "wait_time": "5 min",
        "accepted_insurances": ["Star Health", "Max Bupa"],
        "experience": "10 years",
        "education": "CMC Vellore"
    },
    {
        "name": "Dr. Amit Patel",
        "specialty": "Orthopedics",
        "address": "KIMS Hospital, Mangalagiri",
        "city": "Mangalagiri",
        "state": "AP",
        "pincode": "522503",
        "phone": "8765432109",
        "email": "amit.patel@kims.com",
        "rating": 4.7,
        "wait_time": "15 min",
        "accepted_insurances": ["Star Health", "Bajaj Allianz", "HDFC ERGO"],
        "experience": "12 years",
        "education": "JIPMER Puducherry"
    },
    {
        "name": "Dr. Sunita Reddy",
        "specialty": "Gynecology",
        "address": "Fernandez Hospital, Tadepalli",
        "city": "Tadepalli",
        "state": "AP",
        "pincode": "522501",
        "phone": "7654321098",
        "email": "sunita.reddy@fernandez.com",
        "rating": 4.9,
        "wait_time": "8 min",
        "accepted_insurances": ["Star Health", "Apollo Munich", "ICICI Lombard"],
        "experience": "18 years",
        "education": "Osmania Medical College"
    },
    {
        "name": "Dr. Krishna Rao",
        "specialty": "Neurology",
        "address": "NIMS Hospital, Guntur",
        "city": "Guntur",
        "state": "AP",
        "pincode": "522001",
        "phone": "6543210987",
        "email": "krishna.rao@nims.com",
        "rating": 4.5,
        "wait_time": "20 min",
        "accepted_insurances": ["Star Health", "Max Bupa", "Bajaj Allianz"],
        "experience": "14 years",
        "education": "NIMHANS Bangalore"
    },
    {
        "name": "Dr. Lakshmi Devi",
        "specialty": "Pediatrics",
        "address": "Rainbow Children's Hospital, Vijayawada",
        "city": "Vijayawada",
        "state": "AP",
        "pincode": "520010",
        "phone": "5432109876",
        "email": "lakshmi.devi@rainbow.com",
        "rating": 4.8,
        "wait_time": "12 min",
        "accepted_insurances": ["Star Health", "Apollo Munich", "HDFC ERGO"],
        "experience": "11 years",
        "education": "KGMU Lucknow"
    },
    {
        "name": "Dr. Venkatesh Iyer",
        "specialty": "General Surgery",
        "address": "Medicover Hospital, Mangalagiri",
        "city": "Mangalagiri",
        "state": "AP",
        "pincode": "522503",
        "phone": "4321098765",
        "email": "venkatesh.iyer@medicover.com",
        "rating": 4.4,
        "wait_time": "25 min",
        "accepted_insurances": ["Star Health", "ICICI Lombard", "Bajaj Allianz"],
        "experience": "16 years",
        "education": "MAMC Delhi"
    },
    {
        "name": "Dr. Anjali Gupta",
        "specialty": "Psychiatry",
        "address": "Mind Wellness Center, Tadepalli",
        "city": "Tadepalli",
        "state": "AP",
        "pincode": "522501",
        "phone": "3210987654",
        "email": "anjali.gupta@mindwellness.com",
        "rating": 4.6,
        "wait_time": "30 min",
        "accepted_insurances": ["Star Health", "Max Bupa"],
        "experience": "9 years",
        "education": "NIMHANS Bangalore"
    }
]

async def seed():
    try:
        print("Connecting to MongoDB...")
        client = AsyncIOMotorClient(MONGODB_URI)
        db = client[DB_NAME]
        
        # Test connection
        await client.admin.command('ping')
        print("✓ Connected to MongoDB successfully!")
        
        # Clear existing providers
        print("Clearing existing providers...")
        result = await db.providers.delete_many({})
        print(f"✓ Deleted {result.deleted_count} existing providers")
        
        # Insert new providers
        print("Inserting new providers...")
        result = await db.providers.insert_many(providers)
        print(f"✓ Successfully inserted {len(result.inserted_ids)} providers")
        
        # Verify insertion
        count = await db.providers.count_documents({})
        print(f"✓ Total providers in database: {count}")
        
        print("\n🎉 Providers seeded successfully!")
        print("You can now use the frontend to search for providers.")
        
        client.close()
        
    except Exception as e:
        print(f"❌ Error seeding providers: {e}")
        print("Make sure MongoDB is running and accessible.")

if __name__ == "__main__":
    asyncio.run(seed()) 