from fastapi import APIRouter, HTTPException, Depends, status
from app.models.user import UserCreate, UserLogin, UserInDB, UserPublic
from app.core.security import hash_password, verify_password, create_access_token
from app.db.client import get_db
from motor.motor_asyncio import AsyncIOMotorDatabase

from datetime import datetime
from bson import ObjectId

router = APIRouter()



@router.post("/signup", response_model=UserPublic)
async def signup(user_data: UserCreate):
   
    db = get_db()
    users_collection = db['users']
    existing_user = await users_collection.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    hashed = hash_password(user_data.password)

    new_user = {
        "username": user_data.username,
        "email": user_data.email,
        "hashed_password": hashed,
        "created_at": datetime.now()
    }

    result = await users_collection.insert_one(new_user)

    return UserPublic(
        id = str(result.inserted_id),
        username = new_user["username"],
        email=new_user["email"]
    )

@router.post("/signin")
async def signin(login_data: UserLogin, db: AsyncIOMotorDatabase = Depends(get_db)):
    
    users_collection = db['users']
    user = await users_collection.find_one({"email": login_data.email})

    if not user or not verify_password(login_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    access_token = create_access_token(data = {"sub": str(user["_id"])})

    return{
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": str(user["_id"]),
            "username": user["username"],
            "email": user["email"]
        }

            
    }
