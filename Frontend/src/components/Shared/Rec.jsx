import React, { useState, useEffect } from "react";
import { RecMeals } from "../../services/function";
import DashLoader from "./DashLoader";
import { useNavigate } from "react-router-dom";
const Rec = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const nav = useNavigate();

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const res = await RecMeals();
        if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
          setMeals(res.data);
        } else {
          setErrorMsg("No recommended meals found.");
        }
      } catch (error) {
        console.error("Error fetching recommended meals:", error);
        setErrorMsg(
          "Unable to fetch recommended meals. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, []);

  return (
    <div className="w-full bg-white shadow-md rounded-xl p-6 mt-6">
      <h2 className="text-xl font-semibold mb-4 text-green-700">
        Recommended Meals
      </h2>

      {loading ? (
        <div className="flex justify-center py-6">
          <DashLoader />
        </div>
      ) : errorMsg ? (
        <p className="text-gray-500">{errorMsg}</p>
      ) : (
        <div className="flex gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pb-2">
          {meals.map((meal) => (
            <div
              key={meal.id || meal.title}
              onClick={() => nav(`/meal/${meal.id}`)}
              className="min-w-[180px] flex-shrink-0 rounded-lg bg-gray-50 border shadow hover:shadow-lg transition-transform transform hover:-translate-y-1 p-3 cursor-pointer"
            >
              <img
                src={meal.image || "/placeholder.jpg"}
                alt={meal.title || "Meal"}
                className="rounded-lg w-full h-40 object-cover mb-2"
              />
              <h3 className="font-semibold text-gray-700 truncate">
                {meal.title || "Untitled Meal"}
              </h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Rec;
