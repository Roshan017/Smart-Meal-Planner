import httpx
import asyncio

from app.core.security import settings

API_KEY = settings.SPOONACULAR_API_KEY

BASE_URL_MEALS = "https://api.spoonacular.com/mealplanner/generate"


async def get_meal_plan(calories: float, diet: str = None):

    try: 
        params = {
            "apiKey": API_KEY,
            "timeFrame": "week",
            "targetCalories": int(calories),
            "instructionsRequired": True,
        }

        if diet:
            params["diet"] = diet

        async with httpx.AsyncClient() as client:
            res = await client.get(BASE_URL_MEALS, params= params)
            res.raise_for_status()
            return res.json()
        
    except httpx.HTTPStatusError as e:
        print(f"HTTP error occurred: {e.response.status_code} - {e.response.text}")
        return {"error": "Failed to fetch meal plan. Please try again later."}


async def get_meal_details_id(meal_id: int):

    URL_MEAL_ID = f"https://api.spoonacular.com/recipes/{meal_id}/information"
    params = {
        "apiKey": API_KEY,
        "includeNutrition": True
    }

    try:
        async with httpx.AsyncClient() as client:
            res = await client.get(URL_MEAL_ID, params=params)
            res.raise_for_status()
            return res.json()
    except httpx.HTTPStatusError as e:
        print(f"HTTP error occurred: {e.response.status_code} - {e.response.text}")
        return {"error": "Failed to fetch meal details. Please try again later."}
    
