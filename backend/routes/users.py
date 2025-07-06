from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import EmailStr
from passlib.context import CryptContext
from jose import jwt, JWTError
from datetime import datetime, timedelta
from database import db
from models import UserCreate, UserLogin, UserOut
import os
import logging

# Configure logging
logger = logging.getLogger(__name__)

router = APIRouter()
security = HTTPBearer()

SECRET_KEY = os.getenv("SECRET_KEY", "supersecret")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

# Use a simpler password hashing method to avoid bcrypt issues
pwd_context = CryptContext(schemes=["sha256_crypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = await db.users.find_one({"_id": user_id})
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    
    user["_id"] = str(user["_id"])
    return UserOut(**user)

@router.get("/me", response_model=UserOut)
async def get_current_user_info(current_user: UserOut = Depends(get_current_user)):
    return current_user

@router.post("/register", response_model=UserOut)
async def register(user: UserCreate):
    try:
        logger.info(f"Attempting to register user: {user.email}")
        
        # Check if user already exists
        existing = await db.users.find_one({"email": user.email})
        if existing:
            logger.warning(f"Registration failed: Email already exists - {user.email}")
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Prepare user data
        user_dict = user.dict()
        user_dict["password"] = get_password_hash(user.password)
        user_dict["created_at"] = datetime.utcnow()
        
        # Insert user into database
        result = await db.users.insert_one(user_dict)
        user_dict["_id"] = str(result.inserted_id)
        
        logger.info(f"User registered successfully: {user.email}")
        return UserOut(**user_dict)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Registration error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error during registration")

@router.post("/login")
async def login(user: UserLogin):
    try:
        logger.info(f"Login attempt for user: {user.email}")
        
        # Find user in database
        db_user = await db.users.find_one({"email": user.email})
        if not db_user:
            logger.warning(f"Login failed: User not found - {user.email}")
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # Verify password
        if not verify_password(user.password, db_user["password"]):
            logger.warning(f"Login failed: Invalid password - {user.email}")
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # Create access token
        token = create_access_token({"sub": str(db_user["_id"])})
        logger.info(f"User logged in successfully: {user.email}")
        
        return {"access_token": token, "token_type": "bearer"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error during login")

@router.get("/{user_id}", response_model=UserOut)
async def get_user(user_id: str):
    try:
        user = await db.users.find_one({"_id": user_id})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        user["_id"] = str(user["_id"])
        return UserOut(**user)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get user error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error") 