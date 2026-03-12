"use client";

import EmployeeSettings from "./EmployeeSettings";
import BookingSettings from "./BookingSettings";
import BusinessSettings from "./BusinessSettings";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const sections = [
  "Business",
  "Bookings",
  "Employees",
  "Inventory",
  "Notifications",
  "Reports",
  "Security",
];

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function SettingsDialog({ open, onOpenChange }: Props) {
  const [activeSection, setActiveSection] = useState("Business");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-none w-[55vw] h-[75vh] p-0 overflow-hidden">

        <div className="flex h-full">

          {/* LEFT PANEL */}
          <div className="w-44 border-r bg-gray-50 p-4">
            <h2 className="text-sm font-semibold mb-4 text-gray-700">
              Settings
            </h2>

            <div className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={`
                    w-full text-left px-3 py-2 rounded-md text-sm transition
                    ${
                      activeSection === section
                        ? "bg-blue-100 text-blue-700 font-medium"
                        : "text-gray-600 hover:bg-gray-100"
                    }
                  `}
                >
                  {section}
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="flex-1 p-10">
            <h3 className="text-3xl font-semibold mb-6">
              {activeSection}
            </h3>

            {activeSection === "Business" && <BusinessSettings />}

            {activeSection === "Bookings" && <BookingSettings />}

            {activeSection === "Employees" && <EmployeeSettings />}

            {activeSection !== "Business" && activeSection !== "Bookings" && activeSection !== "Employees" && (
              <div className="text-gray-500">
                empty for now
              </div>
            )}
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}