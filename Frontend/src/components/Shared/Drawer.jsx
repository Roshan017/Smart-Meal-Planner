import React from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";
import { Button } from "../ui/button";

const AboutDrawer = ({ open, onOpenChange }) => {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-md p-4">
          <DrawerHeader>
            <DrawerTitle>About ForkCast</DrawerTitle>
            <DrawerDescription>
              Learn more about what ForkCast does.
            </DrawerDescription>
          </DrawerHeader>
          <div className="py-4 text-gray-700 space-y-3">
            <p>
              <strong>ForkCast</strong> is your smart meal planning assistant
              designed to help you maintain a balanced diet effortlessly.
            </p>
            <p>
              It allows you to create customized meal plans, track nutrition
              intake, reduce food waste, and achieve your health goals with
              ease.
            </p>
            <p>
              Whether you're a fitness enthusiast or just looking to improve
              your eating habits, ForkCast simplifies meal planning for a
              healthier lifestyle.
            </p>
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

export default AboutDrawer;
