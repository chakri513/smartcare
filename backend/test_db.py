#!/usr/bin/env python3
"""
Test script to verify database functionality
"""
import asyncio
import sys
import os

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import db
from models import UserCreate
from routes.users import get_password_hash

async def test_database():
    """Test database functionality"""
    print("Testing database functionality...")
    
    try:
        # Test 1: Check if database is accessible
        print("1. Testing database access...")
        if hasattr(db, 'users'):
            print("   ✓ Database is accessible")
        else:
            print("   ✗ Database is not accessible")
            return False
        
        # Test 2: Test user insertion
        print("2. Testing user insertion...")
        test_user = {
            "email": "test@example.com",
            "password": get_password_hash("testpassword"),
            "name": "Test User",
            "phone": "1234567890"
        }
        
        result = await db.users.insert_one(test_user)
        print(f"   ✓ User inserted with ID: {result.inserted_id}")
        
        # Test 3: Test user retrieval
        print("3. Testing user retrieval...")
        found_user = await db.users.find_one({"email": "test@example.com"})
        if found_user:
            print(f"   ✓ User found: {found_user['name']}")
        else:
            print("   ✗ User not found")
            return False
        
        # Test 4: Test user listing
        print("4. Testing user listing...")
        all_users = await db.users.find()
        print(f"   ✓ Found {len(all_users)} users in database")
        
        print("\n✅ All database tests passed!")
        return True
        
    except Exception as e:
        print(f"❌ Database test failed: {e}")
        return False

def main():
    """Main function to run the test"""
    try:
        # Create a new event loop
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
        # Run the test
        result = loop.run_until_complete(test_database())
        
        # Clean up
        loop.close()
        
        return result
    except Exception as e:
        print(f"❌ Test execution failed: {e}")
        return False

if __name__ == "__main__":
    main() 