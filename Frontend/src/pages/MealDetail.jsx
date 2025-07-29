import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMeal } from '../services/function';
import { ArrowLeft } from 'lucide-react';

const MealDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mealData, setMealData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeal = async () => {
      try {
        const response = await getMeal(id);
        setMealData(response.data);
      } catch (error) {
        console.error('Error fetching meal:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMeal();
  }, [id]);

  if (loading) return <div className="text-center text-lg mt-20">Loading...</div>;
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
          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            {mealData.title}
          </h1>

          {/* Preparation Section */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Preparation
            </h2>
            <table className="w-full text-gray-600 border-t border-b">
              <tbody>
                <tr className="border-b">
                  <td className="py-2 font-medium">Prep Time</td>
                  <td className="py-2 text-right">{mealData.readyInMinutes} minutes</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Servings</td>
                  <td className="py-2 text-right">{mealData.servings}</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">Vegetarian</td>
                  <td className="py-2 text-right">
                    {mealData.vegetarian ? 'Yes' : 'No'}
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          {/* Nutrition Section */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Nutrition</h2>
            <p className="text-gray-600">Calories: {mealData.calories}</p>
          </section>

          {/* Ingredients Section */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Ingredients</h2>
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
              {mealData.instructions?.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
};

export default MealDetail;
