import { Routes, Route } from "react-router-dom";
import './index.css';
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Search from "./pages/Search";
import Home from "./pages/Home";
import HomeSearch from "./pages/HomeSearch";
import MealDetail from "./pages/MealDetail";
import Profile from "./pages/Profile";


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
        <Route path="/usersearch" element={<Search />} />
        <Route path="/meal/:id" element={<MealDetail />} /> 
      </Routes>
    </>
  );
}

export default App;
