import React, { useState, useEffect } from "react";
import Hero from "../components/3dModels/Hero";
import SplitText from "../components/Shared/SplitText";
import { useNavigate } from "react-router-dom";
import AboutDrawer from "../components/Shared/Drawer";
import ContactDrawer from "../components/Shared/Contact";

const quotes = [
  "Your health, your time, your way",
  "Smart Meals, Smarter You",
  "Plan Better, Live Better",
  "Healthy Eating, Simplified",
  "Nutrition Made Simple",
  "Fuel Your Day the Smart Way",
  "Balance Your Plate, Balance Your Life",
  "Smarter Eating Starts Here",
  "Meal Planning Made Effortless",
  "Healthy Choices, Happier Life",
];

const Home = () => {
  const nav = useNavigate();
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [quote, setQuote] = useState("");
  const [isContactOpen, setIsContactOpen] = useState(false);

  const handleAboutClick = () => setIsAboutOpen(true);
  const handleContactClick = () => setIsContactOpen(true);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);
  }, []);
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-white text-gray-900 px-6 md:px-20">
      {/* Top Nav for Mobile */}
      <header className="block md:hidden w-full py-4 border-b border-green-100">
        <nav className="flex justify-end space-x-8 text-gray-700 font-medium">
          {["Blogs", "About", "Contact"].map((item) => {
            if (item === "About") {
              return (
                <span
                  key={item}
                  onClick={handleAboutClick}
                  className="relative group cursor-pointer text-md"
                >
                  {item}
                  <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-green-600 transition-all duration-300 group-hover:w-full"></span>
                </span>
              );
            }
            if (item === "Contact") {
              return (
                <span
                  key={item}
                  onClick={handleContactClick}
                  className="relative group cursor-pointer text-md"
                >
                  {item}
                  <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-green-600 transition-all duration-300 group-hover:w-full"></span>
                </span>
              );
            }
            return (
              <span
                key={item}
                className="relative group cursor-pointer text-md"
              >
                {item}
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-green-600 transition-all duration-300 group-hover:w-full"></span>
              </span>
            );
          })}
        </nav>
      </header>

      {/* Center Content */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-12 max-w-7xl w-full mx-auto flex-grow">
        <div className="w-full md:w-1/2 h-[400px]">
          <Hero />
        </div>

        <div className="w-full md:w-1/2 text-center space-y-6">
          <SplitText
            text="Hola! 👋"
            className="text-4xl text-green-800 font-bold text-center"
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
            {quote}
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

          <div className="flex flex-col sm:flex-row gap-6 justify-center relative top-4">
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

      {/* Bottom Nav (only for md and above) */}
      <footer className="hidden md:block w-full py-6 text-right border-t border-green-100">
        <nav className="flex justify-end space-x-10 text-gray-700 font-medium">
          {["Blogs", "About", "Contact"].map((item) => {
            if (item === "About") {
              return (
                <span
                  key={item}
                  onClick={handleAboutClick}
                  className="relative group cursor-pointer text-md"
                >
                  {item}
                  <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-green-600 transition-all duration-400 group-hover:w-full"></span>
                </span>
              );
            }
            if (item === "Contact") {
              return (
                <span
                  key={item}
                  onClick={handleContactClick}
                  className="relative group cursor-pointer text-md"
                >
                  {item}
                  <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-green-600 transition-all duration-400 group-hover:w-full"></span>
                </span>
              );
            }
            return (
              <span
                key={item}
                className="relative group cursor-pointer text-md"
              >
                {item}
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-green-600 transition-all duration-400 group-hover:w-full"></span>
              </span>
            );
          })}
        </nav>
      </footer>

      {/* Drawers */}
      <AboutDrawer open={isAboutOpen} onOpenChange={setIsAboutOpen} />
      <ContactDrawer open={isContactOpen} onOpenChange={setIsContactOpen} />
    </div>
  );
};

export default Home;
