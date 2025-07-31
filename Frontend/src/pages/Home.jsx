import React from "react";
import Hero from "../components/3dModels/Hero";
import SplitText from "../components/Shared/SplitText";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const nav = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white text-gray-900 px-6 md:px-20">
      <div className="flex flex-col md:flex-row items-center justify-center gap-12 max-w-7xl w-full">
        {/* 3D Model */}
        <div className="w-full md:w-1/2 h-[400px]">
          <Hero />
        </div>

        {/* Text Section */}
        <div className="w-full md:w-1/2 text-center space-y-6">
          <SplitText
            text="Hi Everyone 👋"
            className="text-4xl text-green-800 font-bold text-center "
            delay={100}
            duration={0.6}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
          />

          <h2 className="text-5xl md:text-6xl font-extrabold text-green-700 leading-tight">
            Eat Well, Live Better <br /> With Smart Meal Planning
          </h2>

          <p className="text-lg text-gray-600 max-w-md mx-auto">
            <strong>ForkCast</strong> helps you create balanced meal plans,
            track nutrition, and stay on top of your health goals — all while
            saving time and reducing food waste.
            <span className="font-medium">
              {" "}
              Your healthy lifestyle made simple.
            </span>
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center top-4 relative">
            <button className="homebutton" onClick={() => nav("/login")}>
              <span className="homebutton-top bg-green-600 text-white border-green-600">
                Login
              </span>
            </button>
            <button className="homebutton" onClick={() => nav("/signup")}>
              <span className="homebutton-top bg-white text-green-600 border-green-600">
                Sign Up
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
