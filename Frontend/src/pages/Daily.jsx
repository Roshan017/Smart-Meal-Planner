import React, { useState, useEffect } from "react";
import { Sun, CloudSun, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getCurrentUserApi } from "../services/auth";
import { AddsmartMeal, smartMeal } from "../services/function";

const DailyPlan = () => {
  const nav = useNavigate();
  const [dailyPlan, setDailyPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showStoreButton, setShowStoreButton] = useState(false);

  const fetchUser = async () => {
    try {
      const userData = await getCurrentUserApi();
      if (userData.day_plan && Object.keys(userData.day_plan).length > 0) {
        setDailyPlan(userData.day_plan);
        setShowStoreButton(false);
      } else {
        setDailyPlan({});
        setShowStoreButton(false);
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setDailyPlan({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleCreateNewPlan = async () => {
    try {
      const response = await smartMeal("day");
      if (response?.data?.meals) {
        const newPlan = {
          meals: response.data.meals,
          nutrients: response.data.nutrients,
        };
        setDailyPlan(newPlan);
        setShowStoreButton(true);
      } else {
        alert("No Daily plan found in response!");
      }
    } catch (e) {
      console.error("Failed to generate new plan:", e);
      alert("Failed to generate new meal plan");
    }
  };

  const handleStoreMeal = async () => {
    if (!dailyPlan || !dailyPlan.meals) return;
    setSaving(true);
    try {
      await AddsmartMeal({
        time_frame: "day",
        meals: dailyPlan.meals,
        nutrients: dailyPlan.nutrients,
      });
      alert("Meal Plan Stored Successfully!");
      setShowStoreButton(false);
    } catch (e) {
      console.error("Failed to store meal plan:", e);
      alert("Failed to store meal plan");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">Loading Daily Plan...</div>
    );
  }

  if (!dailyPlan || Object.keys(dailyPlan).length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No Daily Plan Found 😔
        <div className="mt-6">
          <button
            onClick={handleCreateNewPlan}
            disabled={saving}
            className="bg-green-600 text-white px-8 py-3 rounded-2xl hover:bg-green-700 transition"
          >
            {saving ? "Creating..." : "Create New Plan"}
          </button>
        </div>
      </div>
    );
  }

  const meals = dailyPlan.meals || [];
  const nutrients = dailyPlan.nutrients || {};

  const mealLabels = ["Breakfast", "Lunch", "Dinner"];
  const mealIcons = [<Sun />, <CloudSun />, <Moon />];

  return (
    <div className="px-4 py-6 md:px-10 md:py-12 bg-white min-h-screen">
      <div className="max-w-screen-lg mx-auto space-y-10">
        {/* Nutrition Info */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {[
            {
              label: "Calories",
              value: nutrients.calories?.toFixed(2),
              unit: "kcal",
              icon: "🔥",
            },
            {
              label: "Protein",
              value: nutrients.protein?.toFixed(2),
              unit: "g",
              icon: "🥩",
            },
            {
              label: "Carbs",
              value: nutrients.carbohydrates?.toFixed(2),
              unit: "g",
              icon: "🍞",
            },
            {
              label: "Fat",
              value: nutrients.fat?.toFixed(2),
              unit: "g",
              icon: "🥑",
            },
          ].map((nutrient, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center justify-center rounded-3xl w-full aspect-square
              bg-gradient-to-br from-green-100 via-green-50 to-white 
              shadow-inner border hover:shadow transition"
            >
              <span className="text-4xl sm:text-5xl mb-1">{nutrient.icon}</span>
              <span className="text-base sm:text-lg font-semibold text-gray-700">
                {nutrient.value} {nutrient.unit}
              </span>
              <span className="text-sm text-gray-500">{nutrient.label}</span>
            </div>
          ))}
        </div>

        {/* Meal Cards */}
        <div className="space-y-8">
          {meals.map((meal, index) => (
            <div
              key={meal.id || index}
              className="bg-white border rounded-3xl p-4 sm:p-6 shadow hover:shadow-md transition flex flex-col gap-4"
            >
              {/* Top: Label & Title left, Icon right */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                    {mealLabels[index] || `Meal ${index + 1}`}
                  </h3>
                  <p className="text-base sm:text-lg text-gray-500">
                    {meal.title}
                  </p>
                </div>
                <div className="p-2 sm:p-3 rounded-full bg-green-600 text-white">
                  {mealIcons[index]}
                </div>
              </div>

              {/* Image */}
              <img
                src={`https://spoonacular.com/recipeImages/${meal.image}`}
                alt={meal.title}
                className="w-full h-48 sm:h-56 object-cover rounded-2xl"
              />

              {/* Link */}
              <a
                href={`/meal/${meal.id}`}
                target="_blank"
                rel="noreferrer"
                className="text-green-600 text-sm underline mt-1 inline-block hover:text-green-700"
              >
                View Recipe →
              </a>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6">
          <button
            onClick={handleCreateNewPlan}
            disabled={saving}
            className="bg-green-600 text-white px-8 py-3 rounded-full hover:bg-green-700 transition shadow w-full sm:w-auto"
          >
            {saving ? "Creating..." : "Create New Plan"}
          </button>
          {showStoreButton && (
            <button
              onClick={handleStoreMeal}
              disabled={saving}
              className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition shadow w-full sm:w-auto"
            >
              {saving ? "Saving..." : "Store Meal"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyPlan;
