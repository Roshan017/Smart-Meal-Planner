import React, { useState, useEffect } from "react";
import { getCurrentUserApi } from "../../services/auth";
import { useNavigate } from "react-router-dom";
import PlansDrawer from "./Plans";

const MALE = "/images/male.svg";
const FEMALE = "/images/female.png";

const Header = () => {
  const [user, setUser] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUserApi();
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
    fetchUser();
  }, []);

  if (!user) {
    return <div className="text-gray-500">Loading...</div>;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    nav("/login");
  };

  return (
    <header className="flex flex-row items-center justify-between bg-white shadow px-6 py-4 rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800">
        Welcome, {user.username || user.email}!
      </h1>

      <nav className="hidden md:flex flex-row gap-6 items-center">
        <PlansDrawer week={user.week_plan} daily={user.day_plan} />

        <button
          onClick={() => nav("/usersearch")}
          className="text-gray-600 hover:text-green-500 font-medium transition cursor-pointer"
        >
          Meals
        </button>
        <button
          onClick={() => nav("/blogs")}
          className="text-gray-600 hover:text-green-500 font-medium transition cursor-pointer"
        >
          Blogs
        </button>

        <button
          onClick={handleLogout}
          className="text-red-500 hover:text-red-700 font-medium transition cursor-pointer"
        >
          Logout
        </button>

        <img
          onClick={() => nav("/profile")}
          src={user.image_url}
          alt="Profile"
          className="w-14 h-12 rounded-full border cursor-pointer hover:scale-105 transition"
        />
      </nav>
    </header>
  );
};

export default Header;
