from fastapi import APIRouter, Depends,HTTPException, status
from app.core.security import get_current_user
from app.db.client import get_db
from app.services.spoonacular import get_meal_plan, get_meal_details_id, get_weekly_plan, SearchMeals
from app.functions.meals_functions import get_details
from datetime import datetime,timezone
from typing import Optional, Literal, List, Dict, Any
from pydantic import BaseModel, Field
router = APIRouter()


@router.post("/add-meal")
async def add_meal_to_plan(meal_id:int, current_user: dict= Depends(get_current_user)):
    db = get_db()
    
    user_id, prefs, calorie_target, diet, selected_meals = await get_details(current_user=current_user, db=db)
    if any(meal["id"] == meal_id for meal in selected_meals):
        raise HTTPException(status_code=409, detail="Meal already added to plan.")

    meal = await get_meal_details_id(meal_id)

    if "error" in meal:
        raise HTTPException(status_code=500, detail="Failed to Fetch Meal Details")
    
    nutrients = meal.get("nutrition", {}).get("nutrients",[])
    cal = 0
    for nutrient in nutrients:
        if nutrient.get("name","").lower() == "calories":
            cal = nutrient.get("amount",0)
            break
    total_calories = sum(m["calories"] for m in selected_meals)+cal

    cal_remaining = 0

    if total_calories == calorie_target:
        cal_remaining = 0
    else:
        cal_remaining = calorie_target - total_calories


    if total_calories > calorie_target:
        cal_remaining = 0
        raise HTTPException(status_code=400, detail="Adding this meal exceeds your calorie target")
    
    meal_entry= {
        "id": meal_id,
        "title": meal.get("title"),
        "image": meal.get("image"),
        "calories": round(cal,2)
    }
    await db["user_details"].update_one(
        {"user_id": user_id},
        {
            "$push": {"selected_meals": meal_entry},
            "$set": {"cal_remaining": round(cal_remaining)}
        }

    )
    return {
        "message": "Meal added successfully.",
        "calories_used": round(total_calories, 2),
        "calories_remaining": round(calorie_target - total_calories, 2)
}
@router.delete("/remove-meal/{meal_id}")
async def remove_meal_from_plan(meal_id:int, current_user: dict= Depends(get_current_user)):
    db = get_db()
    user_id, prefs, calorie_target, diet, selected_meals = await get_details(current_user=current_user, db=db)
    meal_to_remove = next((meal for meal in selected_meals if meal["id"]== meal_id), None )

    if not meal_to_remove:
        raise HTTPException(
            status_code=404,
            detail="Meal not found in plan"
        )

    updated_meals = [meal for meal in selected_meals if meal["id"] != meal_id]
    calories_used = sum(m["calories"] for m in updated_meals)

    cal_remaining = calorie_target - calories_used
    

    await db["user_details"].update_one(
        {"user_id": user_id},
        {
            "$set":{
                "selected_meals": updated_meals,
                "cal_remaining": cal_remaining
            }
        }
    )
    return {
        "res": "Meal Removed from plan",
        "id": meal_id

    }


@router.get("/generate-meal-plan")
async def generate_meal_plan(current_user: dict = Depends(get_current_user)):
    db = get_db()
    user_id, prefs, calorie_target, diet, selected_meals = await get_details(current_user=current_user, db=db)
    res = await get_meal_plan(calorie_target=calorie_target, diet=diet)

    if "error" in res:
        raise HTTPException(
            status_code=500,
            detail="Failed to fetch meals"
        )

    

    print(f"Fetched {len(res)} meals for user: {current_user['username']}")
    return res



@router.get("/smart-plan")
async def weekly_plan(time_frame: str = "day",current_user : dict= Depends(get_current_user)):
    db = get_db()
    user_id, prefs, calorie_target, diet, selected_meals = await get_details(current_user=current_user, db=db)

    res = await get_weekly_plan(calorie_target = calorie_target, diet = diet, timeFrame=time_frame)
    if time_frame not in ["day", "week"]:
        raise HTTPException(
            status_code=400,
            detail="Select Valid TimeFrame i.e day or week"
        )
    if "error" in res:
        raise HTTPException(
            status_code=500,
            detail="Failed to fetch meals"
        )
    return res

class SmartPlanRequest(BaseModel):
    time_frame: Literal["day", "week"]
    meals: Optional[List[Dict]] = Field(default_factory=list)  # for daily plan
    week: Optional[Dict[str, Dict[str, Any]]] = None  

@router.post("/store-smart-plan")
async def store_smart_plan(
    request: SmartPlanRequest,
    current_user: dict = Depends(get_current_user)
):
    db = get_db()
    user_id, prefs, calorie_target, diet, selected_meals = await get_details(current_user=current_user, db=db)

    if request.time_frame not in ["day", "week"]:
        raise HTTPException(status_code=400, detail="Select Valid Plan i.e day or week")

    update = {}

    if request.time_frame == "day":
        update = {
            "$set": {
                "day_plan": request.meals,
                "day_plan_generated_at": datetime.now(timezone.utc)
            }
        }
    else:
        update = {
            "$set": {
                "week_plan":  request.week  # optional: truncate manually if needed
            }
        }

    await db["user_details"].update_one({"user_id": user_id}, update)

    return {"message": f"{request.time_frame.capitalize()} Smart Plan saved."}


@router.get("/search-meals")
async def search_meals(title: str):
    return await SearchMeals(title=title)





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