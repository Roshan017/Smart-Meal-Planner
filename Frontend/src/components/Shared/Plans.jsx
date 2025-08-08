import React, { useState, useEffect } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter,
  DrawerClose,
} from "../ui/drawer";
import { Button } from "../ui/button";
import { ClipboardList } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PlansDrawer = ({ week = {}, daily = {} }) => {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth <= 768);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleOpenChange = (isOpen) => {
    setOpen(isOpen);
    if (isOpen) document.activeElement?.blur();
  };

  const handleNavigate = (path) => {
    setOpen(false);
    setTimeout(() => nav(path), 250);
  };

  const dailyActive = Object.keys(daily ?? {}).length > 0;
  const weeklyActive = Object.keys(week ?? {}).length > 0;

  const dailyBg =
    isMobile && dailyActive
      ? "bg-green-200"
      : dailyActive
      ? "bg-green-100"
      : "bg-white";

  const weeklyBg =
    isMobile && weeklyActive
      ? "bg-green-200"
      : weeklyActive
      ? "bg-green-50"
      : "bg-white";

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          className="text-gray-600 hover:text-green-500 font-medium transition cursor-pointer flex flex-col items-center"
        >
          <ClipboardList className="w-8 h-8 md:hidden" />
          <span className="text-xs font-medium md:hidden">Plans</span>
          <span className="hidden md:inline">Plans</span>
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <div className="mx-auto w-full max-w-md p-6">
          <DrawerHeader>
            <DrawerTitle className="text-xl font-bold text-green-700">
              Choose Plan
            </DrawerTitle>
            <DrawerDescription>
              Select how you want to view your meal plans.
            </DrawerDescription>
          </DrawerHeader>

          <div className="grid grid-cols-2 gap-8 my-6">
            {/* DAILY CARD */}
            <div
              onClick={() => handleNavigate("/dailyplan")}
              className={`relative border rounded-lg p-10 text-center shadow hover:shadow-lg cursor-pointer 
                hover:border-green-400 hover:scale-105 transition-transform duration-300 ${dailyBg}`}
            >
              {dailyActive && !isMobile && (
                <span className="absolute top-3 right-3 bg-green-400 text-white text-xs px-2 py-1 rounded-full shadow">
                  Active
                </span>
              )}
              <h3 className="font-semibold text-lg">Daily</h3>
              <p className="text-gray-500 text-sm">Create a Plan for the day</p>
            </div>

            {/* WEEKLY CARD */}
            <div
              onClick={() => handleNavigate("/weeklyplan")}
              className={`relative border rounded-lg p-10 text-center shadow hover:shadow-lg cursor-pointer 
                hover:border-green-400 hover:scale-105 transition-transform duration-300 ${weeklyBg}`}
            >
              {weeklyActive && !isMobile && (
                <span className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full shadow">
                  Active
                </span>
              )}
              <h3 className="font-semibold text-lg">Weekly</h3>
              <p className="text-gray-500 text-sm">View your entire week</p>
            </div>
          </div>

          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default PlansDrawer;
