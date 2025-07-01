import httpx
from app.core.security import settings

API_KEY = settings.SPOONACULAR_API_KEY

BASE_URL_SEARCH = "https://api.spoonacular.com/recipes/complexSearch"
info_bulk_url = "https://api.spoonacular.com/recipes/informationBulk"


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
            res.raise_for_status()
            recipies = res.json().get("results",[])
            if not recipies:
                return {"error": "No recipies found"}
            print("Recipes Found")
        
            recipies_id = [str(recipe["id"]) for recipe in recipies]

            ids_param = ",".join(recipies_id)

            bulk_params = {
                "apiKey": API_KEY,
                "ids": ids_param,
                "includeNutrition": True
            }

            bulk_res = await client.get(info_bulk_url,params=bulk_params)

            bulk_res.raise_for_status()
            detailed_recipes = bulk_res.json()

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
                    "id": recipe["id"],
                    "title": recipe["title"],
                    "image": recipe["image"],
                    "macros": macros
                })
        print("Recipe Modified")
        return result

    except httpx.HTTPStatusError as e:
        print(f"HTTP error occurred: {e.response.status_code} - {e.response.text}")
        return {"error": "Failed to fetch meals. Please try again later."}

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
    
