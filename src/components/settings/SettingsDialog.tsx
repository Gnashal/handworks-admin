"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useUser, useClerk } from "@clerk/nextjs";
import Image from "next/image";
import { Button } from "@/components/ui/button";

import BusinessSettings from "./BusinessSettings";
import BookingSettings from "./BookingSettings";
import EmployeeSettings from "./EmployeeSettings";

const sections = [
  "Account",
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
  const [activeSection, setActiveSection] = useState("Account");
  const { user } = useUser();
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    await signOut({ redirectUrl: "/auth" });
    onOpenChange(false);
  };

  const renderContent = () => {
    switch (activeSection) {
      case "Account":
        return (
          <div className="space-y-6">
            {user && (
              <div className="flex items-center gap-4">
                <Image
                  src={user.imageUrl}
                  alt="Profile"
                  width={64}
                  height={64}
                  className="rounded-full"
                />
                <div>
                  <p className="text-xl font-semibold">{user.fullName}</p>
                  <p className="text-gray-500">
                    {user.primaryEmailAddress?.emailAddress}
                  </p>
                </div>
              </div>
            )}
            <div className="pt-4 border-t">
              <Button variant="destructive" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          </div>
        );

      case "Business":
        return <BusinessSettings />;

      case "Bookings":
        return <BookingSettings />;

      case "Employees":
        return <EmployeeSettings />;

      default:
        return <div className="text-gray-500">Empty for now.</div>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-none! w-[55vw] h-[75vh] p-0 overflow-hidden">
        <DialogTitle className="sr-only">Settings</DialogTitle>
        <DialogDescription className="sr-only">
          Manage your account settings and preferences.
        </DialogDescription>
        <div className="flex h-full">
          {/* LEFT PANEL */}
          <div className="w-44 border-r bg-gray-50 p-4">
            <h2 className="text-sm font-semibold mb-4 text-gray-700">
              Settings
            </h2>

            <div className="space-y-1">
              {sections.map((section) => {
                const isDisabled = section !== "Account";
                return (
                  <button
                    key={section}
                    onClick={() => !isDisabled && setActiveSection(section)}
                    disabled={isDisabled}
                    className={`
                      w-full text-left px-3 py-2 rounded-md text-sm transition
                      ${
                        activeSection === section
                          ? "bg-blue-100 text-blue-700 font-medium"
                          : isDisabled
                            ? "text-gray-400 opacity-50 cursor-not-allowed"
                            : "text-gray-600 hover:bg-gray-100"
                      }
                    `}
                  >
                    {section}
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="flex-1 p-10 overflow-y-auto">
            <h3 className="text-3xl font-semibold mb-6">{activeSection}</h3>

            {renderContent()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
