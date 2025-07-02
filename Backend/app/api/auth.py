from fastapi import APIRouter, HTTPException, Depends, status
from app.models.user import UserCreate, UserLogin, UserInDB, UserPublic, UserDetails
from app.core.security import hash_password, verify_password, create_access_token, get_current_user
from app.db.client import get_db
from motor.motor_asyncio import AsyncIOMotorDatabase

from datetime import datetime, timezone, timedelta
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
@router.get("/me", response_model=UserPublic)
async def get_me(current_user: dict = Depends(get_current_user)):
    db = get_db()
    user_id = ObjectId(current_user["_id"])

    details = await db['user_details'].find_one({"user_id": user_id})

    
    from datetime import datetime, timezone

    now = datetime.now(timezone.utc)
    day_plan = details.get("day_plan")
    day_plan_generated_at = details.get("day_plan_generated_at")

    if day_plan and day_plan_generated_at:
        if day_plan_generated_at.tzinfo is None:
            day_plan_generated_at = day_plan_generated_at.replace(tzinfo=timezone.utc)
        if (now - day_plan_generated_at).total_seconds() > 86400:
            await db["user_details"].update_one(
                {"user_id": user_id},
                {"$set": {"day_plan": [], "day_plan_generated_at": None}}
            )
            day_plan = []
            day_plan_generated_at = None

    #print(details)

    return {
        "id": str(current_user["_id"]),
        "username": current_user["username"],
        "email": current_user.get("email") if current_user else None,
        "age": details.get("age"),
        "gender": details.get("gender"),
        "height_cm": details.get("height_cm"),
        "weight_kg": details.get("weight_kg"),
        "goal": details.get("goal"),
        "calorie_target": details.get("calorie_target"),
        "selected_meals": details.get("selected_meals"),
        "cal_remaining": details.get("cal_remaining"),
        "day_plan": day_plan,
        "day_plan_generated_at": day_plan_generated_at,
        "week_plan": details.get("week_plan", {})  # <-- Include week plan here
    }

