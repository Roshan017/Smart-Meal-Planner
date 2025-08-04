import React, { useState, useEffect } from "react";
import { AddsmartMeal, smartMeal } from "../services/function";
import { ArrowBigLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getCurrentUserApi } from "../services/auth";
import MealCard from "../components/Shared/MealCard";

const WeeklyPlan = () => {
  const nav = useNavigate();
  const [weeklyPlan, setWeeklyPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  // For new plan preview modal
  const [newPlanPreview, setNewPlanPreview] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUserApi();
        if (userData.week_plan) {
          setWeeklyPlan(userData.week_plan);
        } else {
          setWeeklyPlan({});
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setWeeklyPlan({});
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleCreateNewPlan = async () => {
    try {
      const response = await smartMeal("week"); // returns Axios response
      if (response?.data?.week) {
        setNewPlanPreview(response.data.week);
        setShowPreview(true);
      } else {
        alert("No week plan found in response!");
      }
    } catch (e) {
      console.error("Failed to generate new plan:", e);
      alert("Failed to generate new meal plan");
    }
  };

  const handleSaveNewPlan = async () => {
    if (!newPlanPreview) return;
    setSaving(true);
    try {
      const payload = {
        time_frame: "week",
        week: newPlanPreview,
      };
      await AddsmartMeal(payload);
      setWeeklyPlan(newPlanPreview);
      setShowPreview(false);
      alert("New weekly meal plan saved successfully!");
    } catch (e) {
      console.error("Failed to save new plan:", e);
      alert("Failed to save new plan");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading Weekly Plan...
      </div>
    );
  }

  if (!weeklyPlan || Object.keys(weeklyPlan).length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No Weekly Plan Found 😔
        <div className="mt-6">
          <button
            onClick={handleCreateNewPlan}
            className="bg-green-600 text-white px-8 py-3 rounded-xl hover:bg-green-700 transition shadow"
          >
            Create New Plan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50 relative">
      {/* Back button */}
      <button
        onClick={() => nav(-1)}
        className="absolute top-6 left-6 flex items-center gap-2 text-green-700 hover:text-green-900 transition duration-300"
      >
        <ArrowBigLeft className="w-6 h-6" />
        <span className="tracking-wide">Back</span>
      </button>

      <h1 className="text-3xl font-bold text-green-700 text-center mb-10">
        Weekly Meal Plan
      </h1>

      {/* Weekly Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(weeklyPlan).map(([day, data]) => (
          <div
            key={day}
            className="bg-white rounded-xl shadow p-5 border hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold text-green-600 capitalize mb-4 text-center">
              {day}
            </h2>
            <MealCard meals={data.meals} nutrients={data.nutrients} />
          </div>
        ))}
      </div>

      {/* Action Button */}
      <div className="flex justify-center mt-10">
        <button
          onClick={handleCreateNewPlan}
          className="bg-green-600 text-white px-8 py-3 rounded-xl hover:bg-green-700 transition shadow"
        >
          Create New Plan
        </button>
      </div>

      {/* Preview Modal */}
      {showPreview && newPlanPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-green-700 mb-6">
              New Plan Preview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(newPlanPreview).map(([day, data]) => (
                <div
                  key={day}
                  className="bg-white rounded-xl shadow p-5 border hover:shadow-lg transition"
                >
                  <h2 className="text-xl font-semibold text-green-600 capitalize mb-4">
                    {day}
                  </h2>
                  <MealCard meals={data.meals} nutrients={data.nutrients} />
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={() => setShowPreview(false)}
                className="px-6 py-3 rounded-xl bg-gray-300 hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNewPlan}
                disabled={saving}
                className="px-6 py-3 rounded-xl bg-green-600 text-white hover:bg-green-700 transition shadow"
              >
                {saving ? "Saving..." : "Save New Plan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyPlan;
