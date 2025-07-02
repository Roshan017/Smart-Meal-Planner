from fastapi import APIRouter, HTTPException, Depends, status
from app.models.user import UserDetails
from app.core.security import   get_current_user
from app.db.client import get_db

from bson import ObjectId

router = APIRouter()

def calculate_bmr(weight,height,age,gender):
    if gender.lower() == "male":
        return 10 * weight + 6.25 * height - 5 * age + 5
    elif gender.lower() == "female":
        return 10 * weight + 6.25 * height - 5 * age - 161
    else:
        return 10 * weight + 6.25 * height - 5 * age
    
def activity_multiplier(level):
    return{
        "sedentary": 1.2,
        "light": 1.375,
        "moderate": 1.55,
        "active": 1.725,
        "very_active": 1.9
    }.get(level, 1.2)

def adjust_calories(tdee, goal):
    
    if goal == "Lose-Weight":
        return tdee - 500
    elif goal == "Gain-Weight":
        return tdee + 500
    return tdee

@router.post("/details", response_model=UserDetails)
async def set_user_details(prefs: UserDetails, current_user: dict = Depends(get_current_user)):
    db = get_db()

    user_id = ObjectId(current_user["_id"])

    bmr = calculate_bmr(prefs.weight_kg, prefs.height_cm,prefs.age,prefs.gender)
    tdee = bmr * activity_multiplier(prefs.activity_level)
    calorie_target = round(adjust_calories(tdee, prefs.goal))

    data = prefs.model_dump()

    data.update({
        
        "bmr": bmr,
        "tdee": tdee,
        "calorie_target": calorie_target
    })

    data["user_id"] = user_id

    await db['user_details'].update_one(
        {"user_id": user_id},
        {"$set": data},
        upsert=True
    )
    print("Details saved successfully")

    return prefs
