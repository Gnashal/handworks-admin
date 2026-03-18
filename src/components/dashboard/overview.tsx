"use client";

import {
  CalendarDays,
  AlertCircle,
  Users,
  UserCheck,
  Package,
  Mail,
} from "lucide-react";

import MetricCard from "./metricCard";
import ClientBreakdownCard from "./clientBreakdownCard";
import ServiceDynamics from "./serviceDynamics";
import QuickActions from "./quickActions";
import RecentActivity from "./recentActivity";
import TopServicesCard from "./topServicesCard";
import InventoryAlertsCard from "./inventoryAlertsCard";

import {
  mockDashboardData as data,
  recentActivities,
  topServices,
  inventoryAlerts,
} from "@/data/mockDashboard";

export default function DashboardOverview() {
  return (
    <div className="flex flex-col gap-6">
      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* LEFT CONTENT */}
        <div className="lg:col-span-3 xl:col-span-4 flex flex-col gap-6">

          {/* METRIC CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <MetricCard
              href="/bookings"
              variant="info"
              icon={<CalendarDays />}
              data={{
                title: "Today’s Bookings",
                value: data.todayBookings,
                change: 12,
                trend: "up",
              }}
            />

            <MetricCard
              variant={data.pendingActions > 0 ? "danger" : "success"}
              icon={<AlertCircle />}
              data={{
                title: "Pending Actions",
                value: data.pendingActions,
                change: 5,
                trend: "down",
              }}
            />

            <MetricCard
              href="/clients"
              variant="success"
              icon={<Users />}
              data={{
                title: "Active Clients",
                value: data.activeClients,
                change: 8,
                trend: "up",
              }}
            />

            <MetricCard
              href="/employees"
              variant="info"
              icon={<UserCheck />}
              data={{
                title: "Employees Status",
                value: `${data.employeesActive}/${data.employeesTotal}`,
              }}
            />

            <MetricCard
              href="/messages"
              variant={data.unreadMessages > 0 ? "info" : "default"}
              icon={<Mail />}
              data={{
                title: "Messages",
                value: data.unreadMessages,
                change: 3,
                trend: "up",
              }}
            />
          </div>

          {/* CHART + SECONDARY CARDS */}
          <div className="flex flex-col gap-6 pt-2 border-t">
            <ServiceDynamics
              weeklyData={[
                { label: "Mon", value: 4 },
                { label: "Tue", value: 6 },
                { label: "Wed", value: 5 },
                { label: "Thu", value: 8 },
                { label: "Fri", value: 10 },
                { label: "Sat", value: 12 },
                { label: "Sun", value: 3 },
              ]}
              monthlyData={[
                { label: "Week 1", value: 30 },
                { label: "Week 2", value: 45 },
                { label: "Week 3", value: 50 },
                { label: "Week 4", value: 60 },
              ]}
            />

            {/* SECOND ROW UNDER CHART */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              <TopServicesCard services={topServices} />
              <InventoryAlertsCard items={inventoryAlerts} />
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="lg:col-span-2 xl:col-span-1 flex flex-col gap-5">
          <QuickActions />

          <RecentActivity activities={recentActivities} />

          <ClientBreakdownCard
            total={data.activeClients}
            clients={[
              {
                label: "New",
                value: Math.round((data.newClients / data.activeClients) * 100),
                count: data.newClients,
              },
              {
                label: "Returning",
                value: Math.round(
                  (data.returningClients / data.activeClients) * 100
                ),
                count: data.returningClients,
              },
              {
                label: "Inactive",
                value: Math.round(
                  (data.inactiveClients / data.activeClients) * 100
                ),
                count: data.inactiveClients,
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}