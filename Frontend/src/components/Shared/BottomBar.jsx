import React from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardList, Utensils, User, LogOut } from "lucide-react";

const BottomBar = () => {
  const nav = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    nav("/login");
  };

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white shadow-lg border-t flex justify-around items-center py-2 md:hidden z-50">
      {/* Plans */}
      <button
        onClick={() => nav("/dashboard")}
        className="flex flex-col items-center text-gray-600 hover:text-green-500 transition"
      >
        <ClipboardList className="w-6 h-6" />
        <span className="text-xs font-medium">Plans</span>
      </button>

      {/* Meals */}
      <button
        onClick={() => nav("/usersearch")}
        className="flex flex-col items-center text-gray-600 hover:text-green-500 transition"
      >
        <Utensils className="w-6 h-6" />
        <span className="text-xs font-medium">Meals</span>
      </button>

      {/* Profile */}
      <button
        onClick={() => nav("/profile")}
        className="flex flex-col items-center text-gray-600 hover:text-green-500 transition"
      >
        <User className="w-6 h-6" />
        <span className="text-xs font-medium">Profile</span>
      </button>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex flex-col items-center text-red-500 hover:text-red-700 transition"
      >
        <LogOut className="w-6 h-6" />
        <span className="text-xs font-medium">Logout</span>
      </button>
    </div>
  );
};

export default BottomBar;
