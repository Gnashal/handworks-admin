// src/renderer/src/components/Sidebar.tsx
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

const MenuItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}> = ({ icon, label, active }) => {
  return (
    <button
      className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left transition ${
        active
          ? "bg-gray-100 text-gray-900 font-semibold"
          : "text-gray-600 hover:bg-gray-50"
      }`}
    >
      <div className="w-5 h-5 text-gray-600">{icon}</div>
      <span className="text-sm">{label}</span>
    </button>
  );
};

function Sidebar() {
  return (
    <aside className="w-72 shrink-0 bg-white border-r border-gray-100 p-6 flex flex-col">
      {/* Logo + Title */}
      <div className="mb-8">
        <div className="text-2xl font-extrabold tracking-tight">Handworks</div>
        <div className="text-sm text-gray-400 -mt-1">Management</div>
      </div>

      {/* Navigation */}
      <nav className="space-y-1 flex-1">
        <MenuItem icon={<LayoutDashboard />} label="Dashboard" active />
        <MenuItem icon={<Package />} label="Inventory" />
        <MenuItem icon={<MessageSquare />} label="Messages" />
        <MenuItem icon={<Users />} label="Clients" />
        <MenuItem icon={<UserCheck />} label="Employees" />
      </nav>

      {/* Bottom section */}
      <div className="mt-8 space-y-2">
        <div className="border-t border-gray-100 pt-4 space-y-2">
          <MenuItem icon={<Settings />} label="Profile" />
          <MenuItem icon={<LogOut />} label="Sign Out" />
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
