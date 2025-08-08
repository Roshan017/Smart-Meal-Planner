import React, { useEffect, useState } from "react";
import { getCurrentUserApi, UpdateUser } from "../services/auth";
import { useNavigate } from "react-router-dom";

const Edit = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    height_cm: "",
    weight_kg: "",
    activity_level: "",
    goal: "",
    dietary_preferences: "",
    other_diet_info: "",
    image_url: "",
  });

  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUserApi();
        setUser(currentUser);
        setFormData({
          age: currentUser.age || "",
          gender: currentUser.gender || "",
          height_cm: currentUser.height_cm || "",
          weight_kg: currentUser.weight_kg || "",
          activity_level: currentUser.activity_level || "",
          goal: currentUser.goal || "",
          dietary_preferences: currentUser.dietary_preferences || "",
          other_diet_info: currentUser.other_diet_info || "",
          image_url: currentUser.image_url || "",
        });
        if (currentUser.image_url) {
          setImagePreview(currentUser.image_url);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setFormData((prev) => ({ ...prev, image_url: base64String }));
      setImagePreview(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await UpdateUser(formData);
      setSuccessMsg("Profile updated successfully!");
      setTimeout(() => navigate("/profile"), 1500);
    } catch (err) {
      console.error("Error updating user:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 py-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-3xl p-8 w-full max-w-5xl"
      >
        <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">
          Edit Profile
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
          {/* Left Image Section */}
          <div className="flex flex-col items-center">
            <div className="w-full h-64 rounded-2xl overflow-hidden border-4 border-green-200 mb-3 bg-gray-100">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="text-sm text-gray-700
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-green-100 file:text-green-700
                hover:file:bg-green-200
                transition duration-200"
            />
          </div>

          {/* Right Form Section */}
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Gender */}
              <div>
                <label className="block text-sm font-medium">Gender</label>
                <input
                  name="gender"
                  value={formData.gender}
                  disabled
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 capitalize"
                />
              </div>

              {/* Age */}
              <div>
                <label className="block text-sm font-medium">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
                  min={10}
                  max={100}
                  required
                />
              </div>

              {/* Height */}
              <div>
                <label className="block text-sm font-medium">Height (cm)</label>
                <input
                  type="number"
                  name="height_cm"
                  value={formData.height_cm}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
                  min={100}
                  required
                />
              </div>

              {/* Weight */}
              <div>
                <label className="block text-sm font-medium">Weight (kg)</label>
                <input
                  type="number"
                  name="weight_kg"
                  value={formData.weight_kg}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
                  min={5}
                  required
                />
              </div>

              {/* Activity Level */}
              <div>
                <label className="block text-sm font-medium">
                  Activity Level
                </label>
                <select
                  name="activity_level"
                  value={formData.activity_level}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  <option value="sedentary">Sedentary</option>
                  <option value="light">Light</option>
                  <option value="moderate">Moderate</option>
                  <option value="active">Active</option>
                  <option value="very_active">Very Active</option>
                </select>
              </div>

              {/* Goal */}
              <div>
                <label className="block text-sm font-medium">Goal</label>
                <select
                  name="goal"
                  value={formData.goal}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  <option value="Lose-Weight">Lose Weight</option>
                  <option value="Maintain">Maintain</option>
                  <option value="Gain-Weight">Gain Weight</option>
                </select>
              </div>

              {/* Dietary Preferences */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium">
                  Dietary Preference
                </label>
                <select
                  name="dietary_preferences"
                  value={formData.dietary_preferences}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  <option value="vegetarian">Vegetarian</option>
                  <option value="non-vegetarian">Non-Vegetarian</option>
                  <option value="Ketogenic">Ketogenic</option>
                  <option value="Paleo">Paleo</option>
                  <option value="Gluten Free">Gluten Free</option>
                </select>
              </div>

              {/* Other Diet Info */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium">
                  Other Diet Info
                </label>
                <textarea
                  name="other_diet_info"
                  value={formData.other_diet_info}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Extra protein, high carb, low sugar, etc."
                  className="mt-1 w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save Button bottom right */}
        <div className="flex justify-end mt-6">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-green-700 transition"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {successMsg && (
          <p className="mt-4 text-green-600 text-center font-medium">
            {successMsg}
          </p>
        )}
      </form>
    </div>
  );
};

export default Edit;
