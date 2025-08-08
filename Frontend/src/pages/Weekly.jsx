import React, { useState, useEffect } from "react";
import { AddsmartMeal, smartMeal } from "../services/function";
import { useNavigate } from "react-router-dom";
import { getCurrentUserApi } from "../services/auth";
import MealCard from "../components/Shared/MealCard";

const WeeklyPlan = () => {
  const nav = useNavigate();

  const [weeklyPlan, setWeeklyPlan] = useState({});
  const [loading, setLoading] = useState(true);

  const [newPlanPreview, setNewPlanPreview] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch user's existing weekly plan on mount
  useEffect(() => {
    const fetchUserPlan = async () => {
      try {
        const userData = await getCurrentUserApi();
        setWeeklyPlan(userData?.week_plan || {});
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setWeeklyPlan({});
      } finally {
        setLoading(false);
      }
    };
    fetchUserPlan();
  }, []);

  // Generate new plan using API
  const handleCreateNewPlan = async () => {
    try {
      const response = await smartMeal("week");
      const generatedWeek = response?.data?.week;

      if (!generatedWeek || typeof generatedWeek !== "object") {
        return alert("No week plan found in response!");
      }

      setNewPlanPreview(generatedWeek);
      setShowPreview(true);
    } catch (e) {
      console.error("Error generating new plan:", e);
      alert("Failed to generate new meal plan");
    }
  };

  // Save previewed plan to user
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
      setNewPlanPreview(null);
      setShowPreview(false);
      alert("New weekly meal plan saved successfully!");
    } catch (e) {
      console.error("Error saving plan:", e);
      alert("Failed to save new plan");
    } finally {
      setSaving(false);
    }
  };

  // Render each day's meal card
  const renderWeekCards = (planData, isPreview = false) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Object.entries(planData).map(([day, data]) => (
        <div
          key={day}
          className="bg-white rounded-xl shadow p-5 border hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold text-green-600 capitalize mb-4 text-center">
            {day}
          </h2>
          <MealCard
            isPreview={isPreview}
            meals={data?.meals || []}
            nutrients={data?.nutrients || {}}
          />
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500 text-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-500 border-solid mr-4"></div>
        Loading Weekly Plan...
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {Object.keys(weeklyPlan).length > 0 ? (
          <>
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold text-gray-800">
                Your Weekly Meal Plan
              </h1>
            </div>

            {renderWeekCards(weeklyPlan)}

            <div className="flex justify-center mt-10">
              <button
                onClick={handleCreateNewPlan}
                className="bg-green-600 text-white px-8 py-3 rounded-xl hover:bg-green-700 transition shadow"
              >
                Generate New Plan
              </button>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500 mt-20">
            <p className="text-lg mb-4">No Weekly Plan Found 😔</p>
            <button
              onClick={handleCreateNewPlan}
              className="bg-green-600 text-white px-8 py-3 rounded-xl hover:bg-green-700 transition shadow"
            >
              Create New Plan
            </button>
          </div>
        )}
      </div>

      {/* Modal: New Plan Preview */}
      {showPreview && newPlanPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">
              Preview Your New Weekly Plan
            </h2>

            {renderWeekCards(newPlanPreview, true)}

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
