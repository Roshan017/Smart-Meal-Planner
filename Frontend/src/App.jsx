import { Routes, Route } from "react-router-dom";
import "./index.css";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Search from "./pages/Search";
import Home from "./pages/Home";
import HomeSearch from "./pages/HomeSearch";
import MealDetail from "./pages/MealDetail";
import Profile from "./pages/Profile";
import Weekly from "./pages/Weekly";
import Daily from "./pages/Daily";
import Edit from "./pages/Edit";
import Blogs from "./pages/Blogs";

function App() {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/Search" element={<Signup />} />

        {/* Private Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/editprofile" element={<Edit />} />
        <Route path="/usersearch" element={<Search />} />
        <Route path="/meal/:id" element={<MealDetail />} />
        <Route path="/dailyplan" element={<Daily />} />
        <Route path="/weeklyplan" element={<Weekly />} />
        <Route path="/blogs" element={<Blogs />} />
      </Routes>
    </>
  );
}

export default App;
