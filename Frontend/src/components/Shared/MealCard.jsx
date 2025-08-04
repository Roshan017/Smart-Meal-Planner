import React from "react";
import { useNavigate } from "react-router-dom";

const MealCard = ({ meals, nutrients }) => {
  const nav = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-4 w-full">
      {/* Meals Rows */}
      <div className="space-y-3">
        {meals.slice(0, 3).map((meal) => (
          <div
            key={meal.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg cursor-pointer hover:bg-green-50 transition"
            onClick={() => nav(`/meal/${meal.id}`)}
          >
            <h3 className="text-gray-800 font-semibold truncate sm:w-2/3">
              {meal.title}
            </h3>
            <p className="text-gray-500 text-sm sm:text-right">
              {meal.readyInMinutes} mins • Serves {meal.servings}
            </p>
          </div>
        ))}
      </div>

      {/* Nutritional Info */}
      <div className="mt-5 p-4 bg-yellow-50 rounded-lg grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div>
          <p className="text-2xl text-gray-500">🔥</p>
          <p className="text-lg font-semibold text-green-700">
            {nutrients.calories.toFixed(0)} cal
          </p>
        </div>
        <div>
          <p className="text-2xl text-gray-500">🥩</p>
          <p className="text-lg font-semibold text-green-700">
            {nutrients.protein.toFixed(1)} g
          </p>
        </div>
        <div>
          <p className="text-2xl text-gray-500">🍞</p>
          <p className="text-lg font-semibold text-green-700">
            {nutrients.carbohydrates.toFixed(1)} g
          </p>
        </div>
        <div>
          <p className="text-2xl text-gray-500">🥑</p>
          <p className="text-lg font-semibold text-green-700">
            {nutrients.fat.toFixed(1)} g
          </p>
        </div>
      </div>
    </div>
  );
};

export default MealCard;
