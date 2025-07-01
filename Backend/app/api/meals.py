from fastapi import APIRouter, Depends,HTTPException, status

from bson import ObjectId

from app.core.security import get_current_user
from app.db.client import get_db
from app.services.spoonacular import get_meal_plan, get_meal_details_id


router = APIRouter()

@router.get("/generate-meal-plan")
async def generate_meal_plan(current_user: dict = Depends(get_current_user)):
    db = get_db()
    user_id = ObjectId(current_user["_id"])

    prefs = await db["user_details"].find_one({"user_id": user_id})

    if not prefs:
        raise HTTPException(
            status_code=400,
            detail="User preferences not found. Please set your preferences first."
        )

    calorie_target = prefs.get("calorie_target", 2000)
    diet = prefs.get("dietary_preferences", None)

    res = await get_meal_plan(calorie_target=calorie_target, diet=diet)

    if "error" in res:
        raise HTTPException(
            status_code=500,
            detail="Failed to fetch meals"
        )

    

    print(f"Fetched {len(res)} meals for user: {current_user['username']}")
    return res

@router.get("/{meal_id}")
async def get_meal_details(meal_id: int, current_user:dict = Depends(get_current_user)):
    meal = await get_meal_details_id(meal_id=meal_id)

    if "error" in meal:
        raise HTTPException(
            status_code=500,
            detail="Failed to fetch meal details. Please try again later."
        )
    
    steps = []

    if meal.get("analyzedInstructions"):
        steps = [
            step["step"] for instruction in meal["analyzedInstructions"]
            for step in instruction.get("steps", [])
        ]
    print(f"Fetched details for meal ID: {meal_id}")

    return {
        "id": meal.get("id"),
        "title": meal.get("title"),
        "image": meal.get("image"),
        "readyInMinutes": meal.get("readyInMinutes"),
        "servings": meal.get("servings"),
        "dishTypes": meal.get("dishTypes", []),
        "vegetarian": meal.get("vegetarian"),
        "calories": next((n["amount"] for n in meal.get("nutrition", {}).get("nutrients", []) if n["name"].lower() == "calories"),None),
        "ingredients": [
            {
                "name": ing.get("name"),
                "amount": ing.get("amount"),
                "unit": ing.get("unit")
            }
            for ing in meal.get("extendedIngredients", [])
        ],
        "instructions": steps if steps else meal.get("instructions", ""),
        "sourceUrl": meal.get("sourceUrl")
    }

    

