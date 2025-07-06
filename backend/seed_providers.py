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
        "name": "Dr. Raj Kumar",
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
    },
    # Top 3 relevant providers for Rash, Cough, HDFC ERGO - My Health, Guntur
    {
        "name": "Dr. Priya Sharma",
        "specialty": "Dermatology",
        "address": "Skin Wellness Clinic, Guntur, Andhra Pradesh - 522034",
        "city": "Guntur",
        "state": "AP",
        "pincode": "522034",
        "phone": "8631234567",
        "email": "dr.priya@skinwellness.com",
        "rating": 4.9,
        "wait_time": "10 min",
        "accepted_insurances": ["HDFC ERGO", "My Health", "Star Health"],
        "experience": "15 years",
        "education": "AIIMS Delhi"
    },
    {
        "name": "Dr. Ravi Kumar",
        "specialty": "General Physician",
        "address": "City Health Center, Guntur, Andhra Pradesh - 522034",
        "city": "Guntur",
        "state": "AP",
        "pincode": "522034",
        "phone": "8632345678",
        "email": "dr.ravi@cityhealth.com",
        "rating": 4.8,
        "wait_time": "12 min",
        "accepted_insurances": ["HDFC ERGO", "My Health", "Apollo Munich"],
        "experience": "12 years",
        "education": "Osmania Medical College"
    },
    {
        "name": "Dr. Sneha Reddy",
        "specialty": "Pulmonologist",
        "address": "Lung Care Clinic, Guntur, Andhra Pradesh - 522034",
        "city": "Guntur",
        "state": "AP",
        "pincode": "522034",
        "phone": "8633456789",
        "email": "dr.sneha@lungcare.com",
        "rating": 4.7,
        "wait_time": "15 min",
        "accepted_insurances": ["HDFC ERGO", "My Health", "Max Bupa"],
        "experience": "10 years",
        "education": "CMC Vellore"
    },
    # Providers for Care Health insurance and Rash/Diarrhea symptoms in Guntur
    {
        "name": "Dr. Meera Patel",
        "specialty": "Dermatology",
        "address": "Skin Care Specialists, Guntur, Andhra Pradesh - 522034",
        "city": "Guntur",
        "state": "AP",
        "pincode": "522034",
        "phone": "8634567890",
        "email": "dr.meera@skincare.com",
        "rating": 4.8,
        "wait_time": "8 min",
        "accepted_insurances": ["Care Health", "Care Plus", "Care Freedom", "Star Health"],
        "experience": "13 years",
        "education": "AIIMS Delhi"
    },
    {
        "name": "Dr. Arjun Reddy",
        "specialty": "General Physician",
        "address": "Guntur Medical Center, Guntur, Andhra Pradesh - 522034",
        "city": "Guntur",
        "state": "AP",
        "pincode": "522034",
        "phone": "8635678901",
        "email": "dr.arjun@gunturmedical.com",
        "rating": 4.6,
        "wait_time": "10 min",
        "accepted_insurances": ["Care Health", "Care Plus", "Care Freedom", "Apollo Munich"],
        "experience": "11 years",
        "education": "Osmania Medical College"
    },
    {
        "name": "Dr. Kavya Sharma",
        "specialty": "Gastroenterology",
        "address": "Digestive Health Clinic, Guntur, Andhra Pradesh - 522034",
        "city": "Guntur",
        "state": "AP",
        "pincode": "522034",
        "phone": "8636789012",
        "email": "dr.kavya@digestive.com",
        "rating": 4.9,
        "wait_time": "12 min",
        "accepted_insurances": ["Care Health", "Care Plus", "Care Freedom", "Max Bupa"],
        "experience": "14 years",
        "education": "CMC Vellore"
    },
    {
        "name": "Dr. Suresh Kumar",
        "specialty": "Internal Medicine",
        "address": "City Internal Medicine, Guntur, Andhra Pradesh - 522034",
        "city": "Guntur",
        "state": "AP",
        "pincode": "522034",
        "phone": "8637890123",
        "email": "dr.suresh@cityinternal.com",
        "rating": 4.7,
        "wait_time": "15 min",
        "accepted_insurances": ["Care Health", "Care Plus", "Care Freedom", "ICICI Lombard"],
        "experience": "16 years",
        "education": "JIPMER Puducherry"
    },
    {
        "name": "Dr. Ananya Das",
        "specialty": "Family Medicine",
        "address": "Family Care Clinic, Guntur, Andhra Pradesh - 522034",
        "city": "Guntur",
        "state": "AP",
        "pincode": "522034",
        "phone": "8638901234",
        "email": "dr.ananya@familycare.com",
        "rating": 4.5,
        "wait_time": "20 min",
        "accepted_insurances": ["Care Health", "Care Plus", "Care Freedom", "Bajaj Allianz"],
        "experience": "9 years",
        "education": "KGMU Lucknow"
    },
    # Providers for Religare insurance
    {
        "name": "Dr. Vikram Singh",
        "specialty": "Cardiology",
        "address": "Heart Care Institute, Guntur, Andhra Pradesh - 522034",
        "city": "Guntur",
        "state": "AP",
        "pincode": "522034",
        "phone": "8639012345",
        "email": "dr.vikram@heartcare.com",
        "rating": 4.9,
        "wait_time": "15 min",
        "accepted_insurances": ["Religare", "Care", "Care Freedom", "Care Plus", "Star Health"],
        "experience": "18 years",
        "education": "AIIMS Delhi"
    },
    {
        "name": "Dr. Priya Verma",
        "specialty": "Dermatology",
        "address": "Skin Solutions, Guntur, Andhra Pradesh - 522034",
        "city": "Guntur",
        "state": "AP",
        "pincode": "522034",
        "phone": "8639123456",
        "email": "dr.priya.verma@skinsolutions.com",
        "rating": 4.7,
        "wait_time": "10 min",
        "accepted_insurances": ["Religare", "Care", "Care Freedom", "Care Plus", "Max Bupa"],
        "experience": "12 years",
        "education": "CMC Vellore"
    },
    # Providers for Cigna TTK insurance
    {
        "name": "Dr. Rajesh Malhotra",
        "specialty": "Internal Medicine",
        "address": "Internal Medicine Associates, Guntur, Andhra Pradesh - 522034",
        "city": "Guntur",
        "state": "AP",
        "pincode": "522034",
        "phone": "8639234567",
        "email": "dr.rajesh@internalmedicine.com",
        "rating": 4.6,
        "wait_time": "12 min",
        "accepted_insurances": ["Cigna TTK", "ProHealth", "HealthFirst", "Family First", "Apollo Munich"],
        "experience": "15 years",
        "education": "JIPMER Puducherry"
    },
    {
        "name": "Dr. Sneha Iyer",
        "specialty": "Pediatrics",
        "address": "Children's Health Center, Guntur, Andhra Pradesh - 522034",
        "city": "Guntur",
        "state": "AP",
        "pincode": "522034",
        "phone": "8639345678",
        "email": "dr.sneha.iyer@childrenshealth.com",
        "rating": 4.8,
        "wait_time": "8 min",
        "accepted_insurances": ["Cigna TTK", "ProHealth", "HealthFirst", "Family First", "HDFC ERGO"],
        "experience": "11 years",
        "education": "KGMU Lucknow"
    },
    # Providers for ManipalCigna insurance
    {
        "name": "Dr. Arun Kumar",
        "specialty": "Orthopedics",
        "address": "Bone & Joint Clinic, Guntur, Andhra Pradesh - 522034",
        "city": "Guntur",
        "state": "AP",
        "pincode": "522034",
        "phone": "8639456789",
        "email": "dr.arun@bonejoint.com",
        "rating": 4.7,
        "wait_time": "20 min",
        "accepted_insurances": ["ManipalCigna", "ProHealth Plus", "HealthFirst", "Family First", "Star Health"],
        "experience": "16 years",
        "education": "AIIMS Delhi"
    },
    {
        "name": "Dr. Lakshmi Priya",
        "specialty": "Gynecology",
        "address": "Women's Health Clinic, Guntur, Andhra Pradesh - 522034",
        "city": "Guntur",
        "state": "AP",
        "pincode": "522034",
        "phone": "8639567890",
        "email": "dr.lakshmi@womenshealth.com",
        "rating": 4.9,
        "wait_time": "25 min",
        "accepted_insurances": ["ManipalCigna", "ProHealth Plus", "HealthFirst", "Family First", "Apollo Munich"],
        "experience": "14 years",
        "education": "Osmania Medical College"
    },
    # Providers for Aditya Birla insurance
    {
        "name": "Dr. Sanjay Gupta",
        "specialty": "Neurology",
        "address": "Neuro Care Center, Guntur, Andhra Pradesh - 522034",
        "city": "Guntur",
        "state": "AP",
        "pincode": "522034",
        "phone": "8639678901",
        "email": "dr.sanjay@neurocare.com",
        "rating": 4.8,
        "wait_time": "30 min",
        "accepted_insurances": ["Aditya Birla", "Activ Health", "Activ Care", "Activ Shield", "Max Bupa"],
        "experience": "17 years",
        "education": "NIMHANS Bangalore"
    },
    {
        "name": "Dr. Rekha Sharma",
        "specialty": "General Surgery",
        "address": "Surgical Excellence, Guntur, Andhra Pradesh - 522034",
        "city": "Guntur",
        "state": "AP",
        "pincode": "522034",
        "phone": "8639789012",
        "email": "dr.rekha@surgicalexcellence.com",
        "rating": 4.6,
        "wait_time": "45 min",
        "accepted_insurances": ["Aditya Birla", "Activ Health", "Activ Care", "Activ Shield", "ICICI Lombard"],
        "experience": "13 years",
        "education": "MAMC Delhi"
    },
    # Providers for SBI Health insurance
    {
        "name": "Dr. Venkat Rao",
        "specialty": "Cardiology",
        "address": "SBI Heart Institute, Guntur, Andhra Pradesh - 522034",
        "city": "Guntur",
        "state": "AP",
        "pincode": "522034",
        "phone": "8639890123",
        "email": "dr.venkat@sbiheart.com",
        "rating": 4.9,
        "wait_time": "18 min",
        "accepted_insurances": ["SBI Health", "Arogya Plus", "Arogya Top Up", "Arogya Premier", "Star Health"],
        "experience": "20 years",
        "education": "AIIMS Delhi"
    },
    {
        "name": "Dr. Anjali Reddy",
        "specialty": "Dermatology",
        "address": "SBI Skin Clinic, Guntur, Andhra Pradesh - 522034",
        "city": "Guntur",
        "state": "AP",
        "pincode": "522034",
        "phone": "8639901234",
        "email": "dr.anjali@sbihealth.com",
        "rating": 4.7,
        "wait_time": "12 min",
        "accepted_insurances": ["SBI Health", "Arogya Plus", "Arogya Top Up", "Arogya Premier", "Max Bupa"],
        "experience": "10 years",
        "education": "CMC Vellore"
    },
    # Providers for Future Generali insurance
    {
        "name": "Dr. Mohan Das",
        "specialty": "Internal Medicine",
        "address": "Future Health Center, Guntur, Andhra Pradesh - 522034",
        "city": "Guntur",
        "state": "AP",
        "pincode": "522034",
        "phone": "8639012345",
        "email": "dr.mohan@futurehealth.com",
        "rating": 4.5,
        "wait_time": "15 min",
        "accepted_insurances": ["Future Generali", "Health Total", "Health Plus", "Health Secure", "Apollo Munich"],
        "experience": "12 years",
        "education": "Osmania Medical College"
    },
    {
        "name": "Dr. Geeta Patel",
        "specialty": "Family Medicine",
        "address": "Generali Family Care, Guntur, Andhra Pradesh - 522034",
        "city": "Guntur",
        "state": "AP",
        "pincode": "522034",
        "phone": "8639123456",
        "email": "dr.geeta@generalifamily.com",
        "rating": 4.6,
        "wait_time": "20 min",
        "accepted_insurances": ["Future Generali", "Health Total", "Health Plus", "Health Secure", "HDFC ERGO"],
        "experience": "9 years",
        "education": "KGMU Lucknow"
    },
    # Providers for Universal Sompo insurance
    {
        "name": "Dr. Ramesh Kumar",
        "specialty": "Orthopedics",
        "address": "Sompo Bone Clinic, Guntur, Andhra Pradesh - 522034",
        "city": "Guntur",
        "state": "AP",
        "pincode": "522034",
        "phone": "8639234567",
        "email": "dr.ramesh@sompobone.com",
        "rating": 4.7,
        "wait_time": "25 min",
        "accepted_insurances": ["Universal Sompo", "Health Shield", "Health Guard", "Health Plus", "Star Health"],
        "experience": "15 years",
        "education": "AIIMS Delhi"
    },
    {
        "name": "Dr. Sunita Verma",
        "specialty": "Gynecology",
        "address": "Sompo Women's Health, Guntur, Andhra Pradesh - 522034",
        "city": "Guntur",
        "state": "AP",
        "pincode": "522034",
        "phone": "8639345678",
        "email": "dr.sunita@sompowomen.com",
        "rating": 4.8,
        "wait_time": "30 min",
        "accepted_insurances": ["Universal Sompo", "Health Shield", "Health Guard", "Health Plus", "Apollo Munich"],
        "experience": "13 years",
        "education": "Osmania Medical College"
    },
    # Providers for National Insurance
    {
        "name": "Dr. Prakash Reddy",
        "specialty": "General Physician",
        "address": "National Health Center, Guntur, Andhra Pradesh - 522034",
        "city": "Guntur",
        "state": "AP",
        "pincode": "522034",
        "phone": "8639456789",
        "email": "dr.prakash@nationalhealth.com",
        "rating": 4.4,
        "wait_time": "10 min",
        "accepted_insurances": ["National Insurance", "Mediclaim", "Family Floater", "Senior Citizen", "Star Health"],
        "experience": "11 years",
        "education": "JIPMER Puducherry"
    },
    {
        "name": "Dr. Madhavi Sharma",
        "specialty": "Pediatrics",
        "address": "National Children's Clinic, Guntur, Andhra Pradesh - 522034",
        "city": "Guntur",
        "state": "AP",
        "pincode": "522034",
        "phone": "8639567890",
        "email": "dr.madhavi@nationalchildren.com",
        "rating": 4.6,
        "wait_time": "15 min",
        "accepted_insurances": ["National Insurance", "Mediclaim", "Family Floater", "Senior Citizen", "Max Bupa"],
        "experience": "8 years",
        "education": "KGMU Lucknow"
    },
    # Providers for New India Assurance
    {
        "name": "Dr. Srinivas Rao",
        "specialty": "Cardiology",
        "address": "New India Heart Center, Guntur, Andhra Pradesh - 522034",
        "city": "Guntur",
        "state": "AP",
        "pincode": "522034",
        "phone": "8639678901",
        "email": "dr.srinivas@newindiaheart.com",
        "rating": 4.8,
        "wait_time": "20 min",
        "accepted_insurances": ["New India Assurance", "Mediclaim Plus", "Family Floater", "Senior Citizen", "Star Health"],
        "experience": "19 years",
        "education": "AIIMS Delhi"
    },
    {
        "name": "Dr. Kalpana Devi",
        "specialty": "Dermatology",
        "address": "New India Skin Clinic, Guntur, Andhra Pradesh - 522034",
        "city": "Guntur",
        "state": "AP",
        "pincode": "522034",
        "phone": "8639789012",
        "email": "dr.kalpana@newindiaskin.com",
        "rating": 4.7,
        "wait_time": "12 min",
        "accepted_insurances": ["New India Assurance", "Mediclaim Plus", "Family Floater", "Senior Citizen", "Max Bupa"],
        "experience": "12 years",
        "education": "CMC Vellore"
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