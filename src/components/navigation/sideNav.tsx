"use client";

import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Package,
  MessageSquare,
  Users,
  UserCheck,
  Settings,
  LogOut,
  Menu,
  X,
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
  {
    icon: <Settings />,
    label: "Profile",
    color: "hover:bg-green-100 hover:text-green-700",
  },
  {
    icon: <LogOut />,
    label: "Sign Out",
    color: "hover:bg-red-100 hover:text-red-700",
  },
];

const MenuItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  hoverClass?: string;
  collapsed?: boolean;
}> = ({ icon, label, active, hoverClass, collapsed }) => {
  return (
    <Button
      variant="ghost"
      className={`
        group flex w-full justify-start gap-3 px-4 py-3 transition-colors rounded-none
        ${active ? "bg-gray-100 text-gray-900 font-semibold" : "text-gray-600"}
        ${hoverClass ?? "hover:bg-gray-50"}
        ${collapsed ? "justify-center px-2" : ""}
      `}
    >
      <div className={`h-5 w-5 text-gray-500 group-hover:text-gray-900`}>
        {icon}
      </div>
      {!collapsed && <span className="text-sm">{label}</span>}
    </Button>
  );
};

function Sidebar() {
  const location = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  // Auto-collapse if screen width < 1280px (xl)
  useEffect(() => {
    const handleResize = () => {
      setCollapsed(window.innerWidth < 1280);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <aside
      className={`bg-white border-r border-gray-100 p-4 flex flex-col transition-all duration-300 ${
        collapsed ? "w-20" : "w-72"
      }`}
    >
      <div className="flex justify-end mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <Menu /> : <X />}
        </Button>
      </div>

      {!collapsed && (
        <div className="mb-8">
          <div className="text-2xl font-extrabold tracking-tight">
            Handworks
          </div>
          <div className="text-sm text-gray-400 -mt-1">Management</div>
        </div>
      )}

      <nav className="flex-1 space-y-1">
        {routes.map((route, index) => {
          const isActive = location === route.path;
          return (
            <Link
              key={index}
              href={route.path}
              className={`
                flex items-center gap-3 p-3 transition rounded-md
                ${isActive ? "bg-gray-100 text-gray-900 font-semibold border border-gray-200" : "text-gray-600 hover:bg-gray-50"}
                ${collapsed ? "justify-center p-2" : ""}
              `}
            >
              <div className="w-5 h-5 text-gray-600">{route.icon}</div>
              {!collapsed && <span className="text-sm">{route.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 space-y-2">
        <div className={`border-t border-gray-100 pt-4 space-y-2`}>
          {bottomRoutes.map((route, index) => (
            <MenuItem
              key={index}
              icon={route.icon}
              label={route.label}
              hoverClass={route.color}
              collapsed={collapsed}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
