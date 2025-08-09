import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMeal, addMeal } from "../services/function";
import { ArrowLeft } from "lucide-react";
import { useMediaQuery } from "react-responsive";
import DashLoader from "../components/Shared/DashLoader";
const MealDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mealData, setMealData] = useState({});
  const [loading, setLoading] = useState(true);
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  const handleClick = async () => {
    try {
      const res = await addMeal(id);
      console.log(res);
      navigate("/dashboard");
    } catch (e) {
      if (e.response && e.response.status === 400) {
        alert("Adding this meal exceeds your calorie target");
      } else {
        console.error("Error adding meal:", e);
      }
    }
  };

  useEffect(() => {
    const fetchMeal = async () => {
      try {
        const response = await getMeal(id);
        setMealData(response.data);
      } catch (error) {
        console.error("Error fetching meal:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMeal();
  }, [id]);

  if (loading) return <DashLoader />;
  if (!mealData?.title)
    return <div className="text-center text-red-500 mt-20">Meal not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-12">
      {/* Header */}
      <div className="max-w-5xl mx-auto flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition"
        >
          <ArrowLeft className="h-5 w-5" /> Back
        </button>
      </div>

      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
        {/* Image */}
        <img
          src={mealData.image}
          alt={mealData.title}
          className="w-full h-80 object-cover"
        />

        <div className="p-8">
          {/* Title + Add Button */}
          <div className="flex flex-row justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 text-center">
              {mealData.title}
            </h1>
            <button
              onClick={handleClick}
              className={`cursor-pointer bg-green-500 hover:bg-green-600 text-white font-medium rounded-2xl py-2 px-6 shadow transition duration-300 ${
                isMobile ? "h-fit ml-5 w-fit" : ""
              }`}
            >
              Add Meal
            </button>
          </div>

          {/* Preparation Section */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Preparation
            </h2>
            <table className="w-full text-gray-600 border-t border-b">
              <tbody>
                <tr className="border-b">
                  <td className="py-2 font-medium">Prep Time</td>
                  <td className="py-2 text-right">
                    {mealData.readyInMinutes} minutes
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Servings</td>
                  <td className="py-2 text-right">{mealData.servings}</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">Vegetarian</td>
                  <td className="py-2 text-right">
                    {mealData.vegetarian ? "Yes" : "No"}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">Source</td>
                  <td className="py-2 text-right">
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-500 hover:underline"
                      href={mealData.sourceUrl}
                    >
                      {mealData.title}
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          {/* Nutrition Section */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Nutrition</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="flex flex-col items-center bg-white shadow rounded-xl p-4 border hover:shadow-md transition">
                <span className="text-2xl">🔥</span>
                <p className="text-gray-600 font-medium">Calories</p>
                <p className="text-lg font-semibold text-gray-900">
                  {mealData.macros?.calories ?? 0}
                </p>
              </div>
              <div className="flex flex-col items-center bg-white shadow rounded-xl p-4 border hover:shadow-md transition">
                <span className="text-2xl">🍞</span>
                <p className="text-gray-600 font-medium">Carbs</p>
                <p className="text-lg font-semibold text-gray-900">
                  {mealData.macros?.carbohydrates ?? 0} g
                </p>
              </div>
              <div className="flex flex-col items-center bg-white shadow rounded-xl p-4 border hover:shadow-md transition">
                <span className="text-2xl">🍗</span>
                <p className="text-gray-600 font-medium">Protein</p>
                <p className="text-lg font-semibold text-gray-900">
                  {mealData.macros?.protein ?? 0} g
                </p>
              </div>
              <div className="flex flex-col items-center bg-white shadow rounded-xl p-4 border hover:shadow-md transition">
                <span className="text-2xl">🥑</span>
                <p className="text-gray-600 font-medium">Fats</p>
                <p className="text-lg font-semibold text-gray-900">
                  {mealData.macros?.fat ?? 0} g
                </p>
              </div>
            </div>
          </section>

          {/* Ingredients Section */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Ingredients
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {mealData.ingredients?.map((ing, idx) => (
                <li
                  key={idx}
                  className="bg-gray-100 px-3 py-2 rounded-md text-gray-700"
                >
                  {ing.amount} {ing.unit} {ing.name}
                </li>
              ))}
            </ul>
          </section>

          {/* Instructions Section */}
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Instructions
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              {Array.isArray(mealData.instructions) ? (
                mealData.instructions.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))
              ) : (
                <li>{mealData.instructions}</li>
              )}
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
};

export default MealDetail;
