import React, { useState } from "react";
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

const PlansDrawer = ({ week, daily }) => {
  const [open, setOpen] = useState(false);
  const nav = useNavigate();

  const handleNavigate = (path) => {
    setOpen(false); // close drawer
    setTimeout(() => {
      nav(path); // navigate after drawer closes
    }, 250); // small delay for closing animation
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
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
              className="relative border rounded-lg p-10 text-center 
                         shadow hover:shadow-lg cursor-pointer 
                         hover:border-green-400 hover:scale-105 
                         transition-transform duration-300"
            >
              <h3 className="font-semibold text-lg">Daily</h3>
              <p className="text-gray-500 text-sm">View plans day by day</p>
              {daily && Object.keys(daily).length > 0 && (
                <span className="absolute top-3 right-3 bg-white text-green-500 text-xs px-2 py-1 rounded-xl shadow">
                  Active
                </span>
              )}
            </div>

            {/* WEEKLY CARD */}
            <div
              onClick={() => handleNavigate("/weeklyplan")}
              className="relative border rounded-lg p-10 text-center 
                         shadow hover:shadow-lg cursor-pointer 
                         hover:border-green-400 hover:scale-105 
                         transition-transform duration-300"
            >
              <h3 className="font-semibold text-lg">Weekly</h3>
              <p className="text-gray-500 text-sm">View your entire week</p>
              {week && Object.keys(week).length > 0 && (
                <span className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full shadow">
                  Active
                </span>
              )}
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
