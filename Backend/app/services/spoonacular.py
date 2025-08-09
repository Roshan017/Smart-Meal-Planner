import httpx
from app.core.security import settings

API_KEY = settings.SPOONACULAR_API_KEY

BASE_URL_SEARCH = "https://api.spoonacular.com/recipes/complexSearch"
info_bulk_url = "https://api.spoonacular.com/recipes/informationBulk"
Week_url = "https://api.spoonacular.com/mealplanner/generate"

async def SearchMeals(title: str):
    try:
        params = {
            "apiKey": API_KEY,
            "query": title,
            "number": 10,  
        }

        async with httpx.AsyncClient() as client:
            res = await client.get(BASE_URL_SEARCH, params=params)
            res.raise_for_status()
            data = res.json()

        if not data["results"]:
            return {"error": "No meals found for the given title."}

        # Extract multiple meals
        meals = [
            {
                "id": meal["id"],
                "title": meal["title"],
                "image": meal["image"]
            }
            for meal in data["results"]
        ]

        return {"meals": meals}

    except httpx.HTTPStatusError as e:
        print(f"HTTP error occurred: {e.response.status_code} - {e.response.text}")
        return {"error": "Failed to fetch meals. Please try again later."}


async def get_weekly_plan(calorie_target: float, diet: str = None, timeFrame: str = None):
    try:
        params = {
            "apiKey": API_KEY,
            "timeFrame": timeFrame,
            "targetCalories": calorie_target,
        }
        if diet:
            params["diet"] = diet

        async with httpx.AsyncClient() as client:
            res = await client.get(Week_url, params=params)
            res.raise_for_status()
            return res.json()

    except httpx.HTTPStatusError as e:
        print(f"HTTP error occurred: {e.response.status_code} - {e.response.text}")
        return {"error": "Failed to fetch meals. Please try again later."}


async def get_meal_plan(calorie_target: float, diet: str = None, number: int = 10):
    try:
        params = {
            "apiKey": API_KEY,
            "minCalories": 200,
            "maxCalories": 700,
            "number": number,
            "addRecipeInformation": True,
            "instructionsRequired": True,
            "includeNutrition": True
        }

        if diet:
            params["diet"] = diet

        async with httpx.AsyncClient() as client:
            res = await client.get(BASE_URL_SEARCH, params=params)

            try:
                res.raise_for_status()
            except httpx.HTTPStatusError as e:
                print(f"[ERROR] Search request failed: {e.response.status_code} - {e.response.text}")
                return {"error": "Failed to fetch meal search results"}

            try:
                data = res.json()
            except ValueError:
                print("[ERROR] Response not in JSON format:", res.text[:500])
                return {"error": "Invalid API response"}

            recipes = data.get("results", [])
            if not recipes:
                print("[INFO] No recipes found")
                return {"error": "No recipes found"}

            print(f"[DEBUG] Recipes Found: {len(recipes)}")

            recipe_ids = [str(recipe["id"]) for recipe in recipes]
            ids_param = ",".join(recipe_ids)

            bulk_params = {
                "apiKey": API_KEY,
                "ids": ids_param,
                "includeNutrition": True
            }

            bulk_res = await client.get(info_bulk_url, params=bulk_params)

            try:
                bulk_res.raise_for_status()
            except httpx.HTTPStatusError as e:
                print(f"[ERROR] Bulk info request failed: {e.response.status_code} - {e.response.text}")
                return {"error": "Failed to fetch detailed meal info"}

            try:
                detailed_recipes = bulk_res.json()
            except ValueError:
                print("[ERROR] Bulk response not in JSON format:", bulk_res.text[:500])
                return {"error": "Invalid bulk API response"}

        result = []
        for recipe in detailed_recipes:
            nutrients = recipe.get("nutrition", {}).get("nutrients", [])
            macros = {
                "Calories": next((n["amount"] for n in nutrients if n["name"] == "Calories"), 0),
                "Carbs": next((n["amount"] for n in nutrients if n["name"] == "Carbohydrates"), 0),
                "Fats": next((n["amount"] for n in nutrients if n["name"] == "Fat"), 0),
                "Protein": next((n["amount"] for n in nutrients if n["name"] == "Protein"), 0),
            }

            result.append({
                "id": recipe.get("id"),
                "title": recipe.get("title"),
                "image": recipe.get("image"),
                "macros": macros,
                "dish_type": recipe.get("dishTypes", [])[:3]
            })

        print(f"[DEBUG] Recipes processed: {len(result)}")
        return result

    except Exception as e:
        print(f"[FATAL] Unexpected error: {e}")
        return {"error": "An unexpected error occurred"}


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
    
