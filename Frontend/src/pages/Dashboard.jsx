import React, { useEffect, useState } from "react";
import { getCurrentUserApi } from "../services/auth";
import { Progress } from "../components/ui/progress";
import { deleteMeal } from "../services/function";
import { Trash, Plus, Lock } from "lucide-react";
import BottomBar from "../components/Shared/BottomBar";
import Details from "../components/Shared/Details";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";
import Header from "../components/Shared/Header";
import DashLoader from "../components/Shared/DashLoader";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    const loadDashboard = async () => {
      const start = Date.now();
      try {
        const userData = await getCurrentUserApi();
        if (userData.age == null) {
          setDetails(false);
        }
        setUser(userData);

        const elapsed = Date.now() - start;
        const remaining = 2500 - elapsed;
        if (remaining > 0) {
          setTimeout(() => setLoading(false), remaining);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const deleteMealHandler = async (id) => {
    try {
      const mealToDelete = user.selected_meals.find((meal) => meal.id === id);
      if (!mealToDelete) return;

      await deleteMeal(id);

      setUser((prev) => {
        const updatedMeals = prev.selected_meals.filter(
          (meal) => meal.id !== id
        );
        const caloriesUsed = updatedMeals.reduce(
          (sum, m) => sum + m.calories,
          0
        );
        const updatedCalRemaining = prev.calorie_target - caloriesUsed;

        return {
          ...prev,
          selected_meals: updatedMeals,
          cal_remaining: updatedCalRemaining,
        };
      });

      console.log(`Meal ${id} deleted`);
    } catch (e) {
      console.error(e);
    }
  };
  console.log(user);
  if (!details) return <Details />;
  if (loading) return <DashLoader />;

  const consumed = user.calorie_target - user.cal_remaining;
  const weeklyData =
    user.week_plan && Object.keys(user.week_plan).length > 0
      ? Object.entries(user.week_plan).map(([day, data]) => ({
          name: day.charAt(0).toUpperCase() + day.slice(1),
          calories: data.nutrients.calories,
          protein: data.nutrients.protein,
          fat: data.nutrients.fat,
          carbs: data.nutrients.carbohydrates,
        }))
      : [];

  return (
    <div className="p-6 text-gray-800">
      <Header />

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="p-4 rounded-lg shadow bg-white">
          <h2 className="text-sm font-semibold">Weight</h2>
          <p className="text-xl">{user.weight_kg} kg</p>
        </div>
        <div className="p-4 rounded-lg shadow bg-white">
          <h2 className="text-sm font-semibold">Height</h2>
          <p className="text-xl">{user.height_cm} cm</p>
        </div>
        <div className="p-4 rounded-lg shadow bg-white">
          <h2 className="text-sm font-semibold">Goal</h2>
          <p className="text-xl">{user.goal}</p>
        </div>
        <div className="p-4 rounded-lg shadow bg-white">
          <h2 className="text-sm font-semibold">Activity Level</h2>
          <p className="text-xl capitalize">
            {user.activity_level === "very_active"
              ? "Very Active"
              : user.activity_level}
          </p>
        </div>
      </div>

      {/* CALORIE PROGRESS */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-lg font-semibold mb-2">Calories Today</h2>
        <p className="mb-2">
          Consumed: <strong>{consumed.toFixed(2)} kcal</strong> / Target:{" "}
          <strong>{user.calorie_target} kcal</strong>
        </p>
        <Progress value={(consumed / user.calorie_target) * 100} />
      </div>

      {/* TODAY'S MEALS */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-lg font-semibold mb-4">Today's Selected Meals</h2>

        {user.selected_meals.length > 0 ? (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {user.selected_meals.map((meal) => (
              <div
                key={meal.id}
                className="rounded-lg border shadow hover:shadow-lg transition p-3 min-w-[220px] flex-shrink-0"
              >
                <img
                  src={meal.image}
                  alt={meal.title}
                  className="rounded-lg w-full h-40 object-cover mb-2"
                />
                <div className="flex justify-between items-center gap-4">
                  <h3 className="font-semibold text-sm">{meal.title}</h3>
                  <button
                    onClick={() => deleteMealHandler(meal.id)}
                    className="cursor-pointer text-red-300 hover:text-red-600 transition duration-300 w-10 h-12 p-4"
                  >
                    <Trash />
                  </button>
                </div>
                <p className="text-sm text-gray-600">{meal.calories} kcal</p>
              </div>
            ))}

            {/* Add Meals card */}
            <div
              onClick={() => nav("/usersearch")}
              className="rounded-lg border-dashed border-2 flex flex-col justify-center items-center min-w-[220px] h-[200px] flex-shrink-0 hover:border-green-400 cursor-pointer relative top-3"
            >
              <Plus className="h-10 w-10 text-gray-400" />
              <p className="mt-2 text-gray-500 text-sm">Add Meal</p>
            </div>
          </div>
        ) : (
          <div className="text-gray-500 flex flex-col items-center">
            <p>No meals added today.</p>
            <button
              onClick={() => nav("/usersearch")}
              className="mt-3 text-green-500 hover:underline cursor-pointer"
            >
              Add a meal now
            </button>
          </div>
        )}
      </div>

      {/* WEEKLY CHART */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Weekly Calorie Intake</h2>
        {weeklyData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="calories" fill="#4ade80" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col gap-2 justify-center items-center text-gray-400 py-12">
            <Lock className="w-12 h-12 mb-2" />
            <p className="text-sm">Weekly plan not available</p>
            <p className="text-sm text-green-500">
              <a href="/weeklyplan">Generate Now</a>
            </p>
          </div>
        )}
      </div>

      <BottomBar />
    </div>
  );
};

export default Dashboard;
