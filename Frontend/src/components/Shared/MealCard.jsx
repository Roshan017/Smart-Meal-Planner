import React from "react";
import { useNavigate } from "react-router-dom";

const MealCard = ({ meals = [], nutrients = {}, isPreview = false }) => {
  const nav = useNavigate();

  if (!meals.length || !nutrients) return null;

  return (
    <div
      className={`bg-white rounded-xl transition-all border border-gray-100 w-full
        ${isPreview ? "shadow-sm p-3" : "shadow-md hover:shadow-xl p-4"}
      `}
    >
      {/* Meals */}
      <div className={`space-y-2 ${isPreview ? "text-sm" : ""}`}>
        {meals.slice(0, 3).map((meal) => (
          <div
            key={meal.id}
            className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-lg cursor-pointer transition
              ${
                isPreview
                  ? "p-2 hover:bg-green-50"
                  : "p-3 hover:bg-green-50 hover:scale-[1.01]"
              }
            `}
            onClick={() => nav(`/meal/${meal.id}`)}
            title={meal.title}
          >
            <h3
              className={`text-gray-800 font-medium truncate sm:max-w-[70%]
                ${isPreview ? "text-sm" : "text-base font-semibold"}
              `}
            >
              {meal.title}
            </h3>
            <p
              className={`text-gray-500 text-right shrink-0
                ${isPreview ? "text-xs" : "text-sm"}
              `}
            >
              {meal.readyInMinutes} mins • Serves {meal.servings}
            </p>
          </div>
        ))}
      </div>

      {/* Nutrients */}
      <div
        className={`mt-4 rounded-lg grid grid-cols-2 sm:grid-cols-4 text-center
          ${isPreview ? "bg-yellow-100 gap-3 p-3" : "bg-yellow-50 gap-4 p-4"}
        `}
      >
        <div>
          <p className="text-xl">🔥</p>
          {!isPreview && <p className="text-sm text-gray-500">Calories</p>}
          <p
            className={`font-semibold text-green-700 ${
              isPreview ? "text-sm" : "text-lg"
            }`}
          >
            {nutrients.calories?.toFixed(0)} cal
          </p>
        </div>
        <div>
          <p className="text-xl">🥩</p>
          {!isPreview && <p className="text-sm text-gray-500">Protein</p>}
          <p
            className={`font-semibold text-green-700 ${
              isPreview ? "text-sm" : "text-lg"
            }`}
          >
            {nutrients.protein?.toFixed(1)} g
          </p>
        </div>
        <div>
          <p className="text-xl">🍞</p>
          {!isPreview && <p className="text-sm text-gray-500">Carbs</p>}
          <p
            className={`font-semibold text-green-700 ${
              isPreview ? "text-sm" : "text-lg"
            }`}
          >
            {nutrients.carbohydrates?.toFixed(1)} g
          </p>
        </div>
        <div>
          <p className="text-xl">🥑</p>
          {!isPreview && <p className="text-sm text-gray-500">Fat</p>}
          <p
            className={`font-semibold text-green-700 ${
              isPreview ? "text-sm" : "text-lg"
            }`}
          >
            {nutrients.fat?.toFixed(1)} g
          </p>
        </div>
      </div>
    </div>
  );
};

export default MealCard;
