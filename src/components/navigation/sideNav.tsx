"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  BookOpenIcon,
  Package,
  Users,
  UserCheck,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useClerk } from "@clerk/nextjs";
import { useMessages } from "@/context/messagesContext";
import SettingsDialog from "@/components/settings/SettingsDialog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";

type Route = {
  icon: React.ReactNode;
  label: string;
  path: string;
  badge?: number;
};

const MenuItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  badge?: number;
  active?: boolean;
  hoverClass?: string;
  collapsed?: boolean;
  onClick?: () => void;
}> = ({ icon, label, badge, active, hoverClass, collapsed, onClick }) => {
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
      <div className="relative flex items-center justify-center">
        <div className="h-5 w-5 text-gray-500 group-hover:text-gray-900">
          {icon}
        </div>

        {collapsed && badge && (
          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500" />
        )}
      </div>

      {!collapsed && (
        <div className="flex items-center justify-between w-full">
          <span className="text-sm">{label}</span>

          {badge && (
            <span className="ml-2 text-xs bg-red-500 text-white rounded-full px-2 py-0.5">
              {badge}
            </span>
          )}
        </div>
      )}
    </Button>
  );
};

export default function Sidebar() {
  const location = usePathname();
  const { signOut } = useClerk();
  const { unreadCount } = useMessages();

  const routes: Route[] = [
    { icon: <LayoutDashboard />, label: "Dashboard", path: "/" },
    { icon: <BookOpenIcon />, label: "Bookings", path: "/bookings" },
    { icon: <Package />, label: "Inventory", path: "/inventory" },
    { icon: <Users />, label: "Clients", path: "/clients" },
    { icon: <UserCheck />, label: "Employees", path: "/employees" },
    {
      icon: <MessageSquare />,
      label: "Messages",
      path: "/messages",
      badge: unreadCount,
    },
  ];

  const [collapsed, setCollapsed] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setCollapsed(window.innerWidth < 1280);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSettingsClick = () => {
    setSettingsOpen(true);
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
        className={`sticky top-0 h-screen bg-white border-r border-l-blue-100 p-4 flex flex-col transition-all duration-300 ${
          collapsed ? "w-20" : "w-72"
        }`}
      >
        {/* Collapse Button */}
        <div className="flex justify-end mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <Menu /> : <X />}
          </Button>
        </div>

        {/* Logo */}
        {!collapsed && (
          <div className="mb-8">
            <div className="text-2xl font-extrabold tracking-tight">
              Handworks
            </div>
            <div className="text-sm text-gray-400 -mt-1">Admin</div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {routes.map((route, index) => {
            const isActive = location === route.path;

            return (
              <Link key={index} href={route.path}>
                <MenuItem
                  icon={route.icon}
                  label={route.label}
                  badge={route.badge}
                  active={isActive}
                  collapsed={collapsed}
                />
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="mt-4 space-y-2">
          <div className="border-t border-gray-100 pt-4 space-y-2">
            <MenuItem
              icon={<Settings />}
              label="Settings"
              collapsed={collapsed}
              hoverClass="hover:bg-green-100 hover:text-green-700"
              onClick={handleSettingsClick}
            />

            <MenuItem
              icon={<LogOut />}
              label="Sign Out"
              collapsed={collapsed}
              hoverClass="hover:bg-red-100 hover:text-red-700"
              onClick={handleSignOutClick}
            />
          </div>
        </div>
      </aside>

      {/* SETTINGS DIALOG */}
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />

      {/* LOGOUT CONFIRMATION */}
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