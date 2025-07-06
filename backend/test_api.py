#!/usr/bin/env python3
"""
Test script to verify API endpoints are working
"""
import asyncio
import aiohttp
import json

BASE_URL = "http://127.0.0.1:8000"

async def test_api_endpoints():
    """Test all API endpoints"""
    async with aiohttp.ClientSession() as session:
        print("Testing API endpoints...")
        
        # Test 1: Health check
        print("\n1. Testing health endpoint...")
        try:
            async with session.get(f"{BASE_URL}/health") as response:
                if response.status == 200:
                    data = await response.json()
                    print(f"   ✓ Health check passed: {data}")
                else:
                    print(f"   ✗ Health check failed: {response.status}")
        except Exception as e:
            print(f"   ✗ Health check error: {e}")
        
        # Test 2: User registration
        print("\n2. Testing user registration...")
        try:
            user_data = {
                "name": "Test User",
                "email": "test@example.com",
                "password": "testpassword123",
                "phone": "1234567890"
            }
            async with session.post(f"{BASE_URL}/api/users/register", json=user_data) as response:
                if response.status == 200:
                    data = await response.json()
                    print(f"   ✓ User registered: {data['name']}")
                    user_id = data['_id']
                else:
                    error_data = await response.json()
                    print(f"   ✗ Registration failed: {error_data}")
                    return
        except Exception as e:
            print(f"   ✗ Registration error: {e}")
            return
        
        # Test 3: Intake form submission
        print("\n3. Testing intake form submission...")
        try:
            intake_data = {
                "user_id": user_id,
                "primarySymptoms": "Headache",
                "duration": "2 days",
                "urgencyLevel": "moderate",
                "severity": "mild",
                "detailedDescription": "Mild headache for 2 days",
                "address": "123 Test St",
                "city": "Guntur",
                "state": "AP",
                "pincode": "522001",
                "insuranceProvider": "Test Insurance",
                "insurancePlan": "Basic Plan"
            }
            async with session.post(f"{BASE_URL}/api/intake/", json=intake_data) as response:
                if response.status == 200:
                    data = await response.json()
                    print(f"   ✓ Intake form submitted: {data['primarySymptoms']}")
                else:
                    error_data = await response.json()
                    print(f"   ✗ Intake submission failed: {error_data}")
        except Exception as e:
            print(f"   ✗ Intake submission error: {e}")
        
        # Test 4: Get providers
        print("\n4. Testing providers endpoint...")
        try:
            async with session.get(f"{BASE_URL}/api/providers/") as response:
                if response.status == 200:
                    data = await response.json()
                    print(f"   ✓ Found {len(data)} providers")
                    if len(data) > 0:
                        provider_id = data[0]['_id']
                    else:
                        print("   ⚠ No providers found in database")
                        return
                else:
                    error_data = await response.json()
                    print(f"   ✗ Providers fetch failed: {error_data}")
                    return
        except Exception as e:
            print(f"   ✗ Providers fetch error: {e}")
            return
        
        # Test 5: Create booking
        print("\n5. Testing booking creation...")
        try:
            booking_data = {
                "user_id": user_id,
                "provider_id": provider_id,
                "appointment_time": "2024-01-15T10:00:00Z",
                "status": "pending"
            }
            async with session.post(f"{BASE_URL}/api/bookings/", json=booking_data) as response:
                if response.status == 200:
                    data = await response.json()
                    print(f"   ✓ Booking created: {data['status']}")
                    booking_id = data['_id']
                else:
                    error_data = await response.json()
                    print(f"   ✗ Booking creation failed: {error_data}")
        except Exception as e:
            print(f"   ✗ Booking creation error: {e}")
        
        # Test 6: Get user bookings
        print("\n6. Testing user bookings fetch...")
        try:
            async with session.get(f"{BASE_URL}/api/bookings/user/{user_id}") as response:
                if response.status == 200:
                    data = await response.json()
                    print(f"   ✓ Found {len(data)} bookings for user")
                else:
                    error_data = await response.json()
                    print(f"   ✗ User bookings fetch failed: {error_data}")
        except Exception as e:
            print(f"   ✗ User bookings fetch error: {e}")
        
        print("\n✅ API testing completed!")

if __name__ == "__main__":
    asyncio.run(test_api_endpoints()) 