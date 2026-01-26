"use client";
import React from "react";
import {
  LayoutDashboard,
  Package,
  MessageSquare,
  Users,
  UserCheck,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

const routes = [
  { icon: <LayoutDashboard />, label: "Dashboard", path: "/" },
  { icon: <Package />, label: "Inventory", path: "/inventory" },
  { icon: <MessageSquare />, label: "Messages", path: "/messages" },
  { icon: <Users />, label: "Clients", path: "/clients" },
  { icon: <UserCheck />, label: "Employees", path: "/employees" },
];
const bottomRoutes = [
  { icon: <Settings />, label: "Profile" },
  { icon: <LogOut />, label: "Sign Out" },
];
const MenuItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}> = ({ icon, label, active }) => {
  return (
    <Button
      variant="ghost"
      className={`flex gap-3 px-4 py-3 rounded-xl w-full text-left transition ${
        active
          ? "bg-gray-100 text-gray-900 font-semibold border border-gray-200"
          : "text-gray-600 hover:bg-gray-50"
      }`}
    >
      <div className="w-5 h-5 text-gray-600">{icon}</div>
      <span className="text-sm">{label}</span>
    </Button>
  );
};

function Sidebar() {
  const location = usePathname();
  return (
    <aside className="w-72 shrink-0 bg-white border-r border-gray-100 p-6 flex flex-col">
      <div className="mb-8">
        <div className="text-2xl font-extrabold tracking-tight">Handworks</div>
        <div className="text-sm text-gray-400 -mt-1">Management</div>
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        {routes.map((route, index) => {
          const isActive = location === route.path;
          return (
            <Link
              key={index}
              href={route.path}
              className={`flex items-center gap-3 p-3 rounded-2xl transition ${
                isActive
                  ? "bg-gray-100 text-gray-900 font-semibold border border-gray-200"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <div className="w-5 h-5 text-gray-600">{route.icon}</div>
              <span className="text-sm">{route.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="mt-8 space-y-2">
        <div className="border-t border-gray-100 pt-4 space-y-2">
          {bottomRoutes.map((route, index) => {
            return (
              <MenuItem icon={route.icon} label={route.label} key={index} />
            );
          })}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
