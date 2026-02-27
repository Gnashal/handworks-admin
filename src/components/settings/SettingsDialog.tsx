"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

const sections = [
  "Dashboard",
  "Notifications",
  "Media",
  "Privacy & Security",
  "Manage Folders",
  "Appearance",
  "Logout",
];

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function SettingsDialog({ open, onOpenChange }: Props) {
  const [activeSection, setActiveSection] = useState("Dashboard");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[600px] p-0 overflow-hidden">
        <div className="flex h-full">
          
          {/* LEFT PANEL */}
          <div className="w-64 border-r bg-gray-50 p-4">
            <h2 className="text-lg font-semibold mb-4">Settings</h2>

            <div className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={`
                    w-full text-left px-3 py-2 rounded-md text-sm
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
          <div className="flex-1 p-6">
            <h3 className="text-xl font-semibold mb-4">
              {activeSection}
            </h3>

            <div className="text-gray-500">
              empty for now.
            </div>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}