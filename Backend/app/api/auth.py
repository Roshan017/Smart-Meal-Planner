from fastapi import APIRouter, HTTPException, Depends, status
from app.models.user import UserCreate, UserLogin, UserInDB, UserPublic, UserDetails
from app.core.security import hash_password, verify_password, create_access_token, get_current_user
from app.db.client import get_db
from motor.motor_asyncio import AsyncIOMotorDatabase

from datetime import datetime, timezone, time
from bson import ObjectId

router = APIRouter()




@router.post("/signup")
async def signup(user_data: UserCreate, db: AsyncIOMotorDatabase = Depends(get_db)):
    users_collection = db['users']

    # Check if user already exists
    existing_user = await users_collection.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Hash password and insert
    hashed = hash_password(user_data.password)
    new_user = {
        "username": user_data.username,
        "email": user_data.email,
        "hashed_password": hashed,
        "created_at": datetime.now()
    }

    result = await users_collection.insert_one(new_user)

    # ✅ Fetch user after insert (important for consistency)
    user = await users_collection.find_one({"_id": result.inserted_id})
    
    if not user:
        raise HTTPException(status_code=500, detail="User creation failed.")

    # ✅ Generate token
    
    access_token = create_access_token(data={"sub": str(user["_id"])})
    

    # ✅ Return complete response
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": str(user["_id"]),
            "username": user["username"],
            "email": user["email"]
        }
    }

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
    if not details:
        details = {}

    now = datetime.now(timezone.utc)
    today_midnight = datetime.combine(now.date(), time.min, tzinfo=timezone.utc)

    # --- Reset cal_remaining if it's a new day ---
    calorie_target = details.get("calorie_target")
    cal_remaining_updated_at = details.get("cal_remaining_updated_at")

    if calorie_target is not None:
        reset_calories = False
        if not cal_remaining_updated_at:
            reset_calories = True
        else:
            if isinstance(cal_remaining_updated_at, datetime) and cal_remaining_updated_at.tzinfo is None:
                cal_remaining_updated_at = cal_remaining_updated_at.replace(tzinfo=timezone.utc)

            if cal_remaining_updated_at < today_midnight:
                reset_calories = True

        if reset_calories:
            await db["user_details"].update_one(
                {"user_id": user_id},
                {"$set": {
                    "cal_remaining": calorie_target,
                    "cal_remaining_updated_at": now
                }}
            )
            details["cal_remaining"] = calorie_target
            details["cal_remaining_updated_at"] = now

    # --- Remove meals added before today's midnight ---
    updated_meals = []
    for meal in details.get("selected_meals", []):
        added = meal.get("date_added")

        if isinstance(added, datetime):
            if added.tzinfo is None:
                added = added.replace(tzinfo=timezone.utc)

            if added >= today_midnight:
                meal["date_added"] = added.isoformat()
                updated_meals.append(meal)
        else:
            updated_meals.append(meal)

    if len(updated_meals) != len(details.get("selected_meals", [])):
        await db["user_details"].update_one(
            {"user_id": user_id},
            {"$set": {"selected_meals": updated_meals}}
        )

    # --- Clear day plan if expired ---
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

    return {
        "id": str(current_user["_id"]),
        "image_url": details["image_url"],
        "username": current_user["username"],
        "email": current_user.get("email"),
        "age": details.get("age"),
        "gender": details.get("gender"),
        "diet": details.get("dietary_preferences"),
        "activity_level": details.get("activity_level"),
        "height_cm": details.get("height_cm"),
        "weight_kg": details.get("weight_kg"),
        "goal": details.get("goal"),
        "calorie_target": calorie_target,
        "selected_meals": updated_meals,
        "cal_remaining": details.get("cal_remaining"),
        "day_plan": day_plan,
        "day_plan_generated_at": day_plan_generated_at,
        "week_plan": details.get("week_plan") if isinstance(details.get("week_plan"), dict) else {},
        "created_at": details.get("created_at"),
    }

