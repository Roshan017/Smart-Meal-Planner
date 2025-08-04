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

const ContactDrawer = ({ open, onOpenChange }) => {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-md p-4">
          <DrawerHeader>
            <DrawerTitle>Created By Roshan P Mathew</DrawerTitle>
            <DrawerTitle></DrawerTitle>
            <DrawerDescription>
              Get in touch with the ForkCast Creator.
            </DrawerDescription>
          </DrawerHeader>
          <div className="py-4 text-gray-700 space-y-3">
            <p>
              I would love to hear from you! Whether you have a question,
              feedback, or a partnership opportunity, feel free to reach out.
            </p>
            <div className="space-y-2">
              <p>
                <strong>Email:</strong> roshanprakashmathew@gmail.com
              </p>
              <p>
                <strong>Phone:</strong> +91 9X8X4X0X2X5
              </p>
              <p>
                <strong>Address:</strong> India
              </p>
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

export default ContactDrawer;
