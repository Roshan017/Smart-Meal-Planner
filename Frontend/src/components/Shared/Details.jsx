import React, { useState } from "react";
import styled from "styled-components";
import { UpdateUser } from "../../services/auth";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";

const Details = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    age: "",
    gender: "",
    height_cm: "",
    weight_kg: "",
    activity_level: "",
    goal: "",
    dietary_preferences: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await UpdateUser(form);
      window.location.reload();
    } catch (err) {
      console.error("Error response:", err.response?.data);
      console.error("Status:", err.response?.status);
      setError("Failed to update details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledWrapper className="flex justify-center items-center h-screen w-full p-10">
      <form
        className="card flex flex-col gap-4 p-9 w-[800px] "
        onSubmit={handleSubmit}
      >
        {/* Lock Icon */}
        <div className="flex justify-center mb-2">
          <div className="lock-icon">
            <Lock className="w-10 h-10 text-green-700" strokeWidth={2.5} />
          </div>
        </div>

        <h2 className="text-xl font-light text-center">
          Complete Your Profile To Unlock Dashboard Features
        </h2>

        <input
          type="number"
          name="age"
          placeholder="Age"
          value={form.age}
          onChange={handleChange}
          required
        />

        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          required
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="Female">Female</option>
        </select>

        <input
          type="number"
          name="height_cm"
          placeholder="Height (cm)"
          value={form.height_cm}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="weight_kg"
          placeholder="Weight (kg)"
          value={form.weight_kg}
          onChange={handleChange}
          required
        />

        <select
          name="activity_level"
          value={form.activity_level}
          onChange={handleChange}
          required
        >
          <option value="">Select Activity Level</option>
          <option value="sedentary">Sedentary</option>
          <option value="light">Light</option>
          <option value="moderate">Moderate</option>
          <option value="active">Active</option>
          <option value="very_active">Very Active</option>
        </select>

        <select name="goal" value={form.goal} onChange={handleChange} required>
          <option value="">Select Goal</option>
          <option value="Lose-Weight">Lose Weight</option>
          <option value="Maintain">Maintain</option>
          <option value="Gain-Weight">Gain Weight</option>
        </select>

        <select
          name="dietary_preferences"
          value={form.dietary_preferences}
          onChange={handleChange}
          required
        >
          <option value="">Select Dietary Preference</option>
          <option value="Vegetarian">Vegetarian</option>
          <option value="Whole30">Non-Vegetarian</option>
          <option value="Ketogenic">Ketogenic</option>
          <option value="Paleo">Paleo</option>
          <option value="Gluten Free">Gluten Free</option>
        </select>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="bg-green-600 text-white py-2 rounded hover:bg-green-700"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Details"}
        </button>
      </form>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .card {
    box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px,
      rgba(0, 0, 0, 0.3) 0px 7px 13px -3px,
      rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
    border-radius: 12px;
  }

  .lock-icon {
    background: white;
    border-radius: 50%;
    padding: 8px;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.15);
  }

  input,
  select {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 14px;
  }

  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export default Details;
