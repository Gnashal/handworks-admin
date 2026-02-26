"use client";

import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Search,
  Package,
  MessageSquare,
  Users,
  UserCheck,
  Settings,
  BookOpenIcon,
  LucideTextQuote,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
const routes = [
  { icon: <LayoutDashboard />, label: "Dashboard", path: "/" },
  { icon: <Search />, label: "Search", path: "/search" },
  { icon: <BookOpenIcon />, label: "Bookings", path: "/bookings" },
  { icon: <LucideTextQuote />, label: "Quotes", path: "/quotes" },
  { icon: <Package />, label: "Inventory", path: "/inventory" },
  { icon: <Users />, label: "Clients", path: "/clients" },
  { icon: <UserCheck />, label: "Employees", path: "/employees" },
  { icon: <MessageSquare />, label: "Messages", path: "/messages" },
];

const MenuItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  hoverClass?: string;
  collapsed?: boolean;
  onClick?: () => void;
}> = ({ icon, label, active, hoverClass, collapsed, onClick }) => {
  return (
    <Button
      variant="ghost"
      className={`
        group flex w-full justify-start gap-3 px-4 py-3 transition-colors rounded-none
        ${active ? "bg-gray-100 text-gray-900 font-semibold" : "text-gray-600"}
        ${hoverClass ?? "hover:bg-gray-50"}
        ${collapsed ? "justify-center px-2" : ""}
      `}
      onClick={onClick}
    >
      <div className="h-5 w-5 text-gray-500 group-hover:text-gray-900">
        {icon}
      </div>
      {!collapsed && <span className="text-sm">{label}</span>}
    </Button>
  );
};

function Sidebar() {
  const location = usePathname();
  const router = useRouter();
  const { signOut } = useClerk();
  const [collapsed, setCollapsed] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setCollapsed(window.innerWidth < 1280);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSettingsClick = () => {
    router.push("/settings");
  };

  const handleSignOutClick = () => {
    setShowLogoutConfirm(true);
  };

  const confirmSignOut = async () => {
    setShowLogoutConfirm(false);
    await signOut({ redirectUrl: "/auth" });
  };

  return (
    <>
      <aside
        className={`ticky top-0 h-screen bg-white border-r border-l-blue-100 p-4 flex flex-col transition-all duration-300 ${
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
            <div className="text-sm text-gray-400 -mt-1">Admin</div>
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
                  ${
                    isActive
                      ? "bg-blue-200 text-gray-900 font-semibold border border-l-blue-300"
                      : "text-gray-600 hover:bg-blue-50"
                  }
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
          <div className="border-t border-gray-100 pt-4 space-y-2">
            <MenuItem
              icon={<Settings />}
              label="Settings"
              hoverClass="hover:bg-green-100 hover:text-green-700"
              collapsed={collapsed}
              onClick={handleSettingsClick}
            />
            <MenuItem
              icon={<LogOut />}
              label="Sign Out"
              hoverClass="hover:bg-red-100 hover:text-red-700"
              collapsed={collapsed}
              onClick={handleSignOutClick}
            />
          </div>
        </div>
      </aside>

      <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign out?</AlertDialogTitle>
            <AlertDialogDescription>
              You will be signed out of your current session.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={confirmSignOut}
            >
              Sign out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default Sidebar;
