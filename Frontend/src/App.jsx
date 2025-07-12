import { Routes, Route } from "react-router-dom";
import './index.css';
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signin from "./pages/Signin";
import Search from "./pages/Search";

function App() {
  return (
    <>
      


      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/search" element={<Search />} />

        {/* Private Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;
