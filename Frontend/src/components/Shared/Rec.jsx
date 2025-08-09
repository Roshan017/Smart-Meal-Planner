import React, { useState, useEffect } from "react";
import { RecMeals } from "../../services/function";

const mockMeals = [
  {
    id: "mock-1",
    title: "Grilled Chicken Salad",
    image: "https://via.placeholder.com/150?text=Grilled+Chicken",
  },
  {
    id: "mock-2",
    title: "Veggie Pasta Bowl",
    image: "https://via.placeholder.com/150?text=Veggie+Pasta",
  },
  {
    id: "mock-3",
    title: "Avocado Toast",
    image: "https://via.placeholder.com/150?text=Avocado+Toast",
  },
  {
    id: "mock-4",
    title: "Berry Smoothie",
    image: "https://via.placeholder.com/150?text=Berry+Smoothie",
  },
];

const Rec = () => {
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const res = await RecMeals();
        if (res?.data && res.data.length > 0) {
          setMeals(res.data);
        } else {
          setMeals(mockMeals); // fallback to mock data
        }
      } catch (error) {
        console.error("Error fetching recommended meals:", error);
        setMeals(mockMeals); // fallback on error
      }
    };

    fetchMeals();
  }, []);

  return (
    <div className="w-full bg-white shadow-md rounded-xl p-6 mt-6">
      <h2 className="text-xl font-semibold mb-4 text-green-700">
        Recommended Meals
      </h2>
      <div className="flex gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pb-2">
        {meals.map((meal) => (
          <div
            key={meal.id}
            className="min-w-[180px] flex-shrink-0 rounded-lg bg-gray-50 border shadow hover:shadow-lg transition-transform transform hover:-translate-y-1 p-3 cursor-pointer"
          >
            <img
              src={meal.image}
              alt={meal.title}
              className="rounded-lg w-full h-40 object-cover mb-2"
            />
            <h3 className="font-semibold text-gray-700 truncate">
              {meal.title}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rec;
