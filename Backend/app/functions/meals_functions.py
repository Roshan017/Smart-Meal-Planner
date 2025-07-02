from fastapi import HTTPException
from bson import ObjectId

async def get_details(current_user, db):
    user_id = ObjectId(current_user["_id"])

    prefs = await db["user_details"].find_one({"user_id": user_id})
    
    

    if not prefs:
        raise HTTPException(
            status_code=400,
            detail="User preferences not found. Please set your preferences first."
        )

        

    calorie_target = prefs.get("calorie_target", 2000)
    diet = prefs.get("dietary_preferences")  # optional
    selected_meals = prefs.get("selected_meals", [])  # optional

    return user_id, prefs, calorie_target, diet, selected_meals
