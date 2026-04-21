"use client";

import {
  CalendarDays,
  AlertCircle,
  Users,
  UserCheck,
  // Package,
} from "lucide-react";

import MetricCard from "./metricCard";
import ClientBreakdownCard from "./clientBreakdownCard";
import ServiceDynamics from "./serviceDynamics";
import QuickActions from "./quickActions";
import RecentActivity from "./recentActivity";
import TopServicesCard from "./topServicesCard";
import InventoryAlertsCard from "./inventoryAlertsCard";
import FinancialCard from "./financialCard";
import FcmNotificationBridge from "../notifications/fcmNotificationBridge";
import type { IAdminDashboardResponse } from "@/types/admin";
import { normalizeServiceName } from "@/lib/normalize";
import type { IMainServiceType } from "@/types/booking";
import { useBookingTrendsQuery } from "@/queries/dashboardQueries";

const SERVICE_TYPE_VALUES: IMainServiceType[] = [
  "SERVICE_TYPE_UNSPECIFIED",
  "GENERAL_CLEANING",
  "COUCH",
  "MATTRESS",
  "CAR",
  "POST",
];

type ActivityType = "booking" | "client" | "cancel";

const toActivityType = (type: string): ActivityType => {
  const normalized = type.toLowerCase();

  if (normalized === "booking") {
    return "booking";
  }
  if (normalized === "client") {
    return "client";
  }

  return "cancel";
};

const getClientPercentage = (count: number, total: number) => {
  if (!total) {
    return 0;
  }

  return Math.round((count / total) * 100);
};

const normalizeDashboardServiceName = (name: string) => {
  const normalizedName = name.trim().toUpperCase();

  if (SERVICE_TYPE_VALUES.includes(normalizedName as IMainServiceType)) {
    return normalizeServiceName(normalizedName as IMainServiceType);
  }

  return name;
};

export default function DashboardOverview({
  data,
}: {
  data?: IAdminDashboardResponse;
}) {
  const activeClients = data?.activeClients ?? 0;
  const todayBookings = data?.todayBookings ?? 0;

  const topServices = (data?.topServices ?? []).map((service) => ({
    ...service,
    name: normalizeDashboardServiceName(service.name),
  }));

  const inventoryAlerts = data?.lowStockItems ?? [];

  const recentActivities = (data?.recentActivities ?? []).map((activity) => ({
    ...activity,
    type: toActivityType(activity.type),
  }));

  const { data: bookingTrendsData } = useBookingTrendsQuery();

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
                title: "Bookings",
                value: data?.bookings ?? 0,
                todayStat: `${todayBookings} booking${todayBookings === 1 ? "" : "s"} today`,
                change: data?.growthIndex?.bookingsGrowthIndex,
                trend:
                  (data?.growthIndex?.bookingsGrowthIndex ?? 0) >= 0
                    ? "up"
                    : "down",
              }}
            />

            <MetricCard
              variant={(data?.pendingActions ?? 0) > 0 ? "danger" : "success"}
              icon={<AlertCircle />}
              data={{
                title: "Pending Actions",
                value: data?.pendingActions ?? 0,
              }}
            />

            <MetricCard
              href="/clients"
              variant="success"
              icon={<Users />}
              data={{
                title: "Active Clients",
                value: activeClients,
              }}
            />

            <MetricCard
              href="/employees"
              variant="info"
              icon={<UserCheck />}
              data={{
                title: "Employees Status",
                value: `${data?.employeesActive ?? 0}/${data?.employeesTotal ?? 0}`,
              }}
            />

            <FinancialCard
              data={{
                label: "Revenue",
                amount: data?.revenue ?? 0,
                breakdowns: [
                  {
                    label: "Paid",
                    amount: data?.paid ?? 0,
                  },
                  {
                    label: "Unpaid",
                    amount: data?.unpaid ?? 0,
                  },
                ],
                className:
                  "w-full min-h-35 flex flex-col justify-between border transition hover:shadow-md",
              }}
            />
          </div>

          {/* CHART + SECONDARY CARDS */}
          <div className="flex flex-col gap-6 pt-2 border-t">
            {bookingTrendsData ? (
              <ServiceDynamics bookingTrendsData={bookingTrendsData} />
            ) : (
              <p className="text-sm text-muted-foreground">
                Failed to load booking trends data
              </p>
            )}
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

          <FcmNotificationBridge />

          <RecentActivity activities={recentActivities} />

          <ClientBreakdownCard
            total={activeClients}
            clients={[
              {
                label: "New",
                value: getClientPercentage(
                  data?.newClients ?? 0,
                  activeClients,
                ),
                count: data?.newClients ?? 0,
              },
              {
                label: "Returning",
                value: getClientPercentage(
                  data?.returningClients ?? 0,
                  activeClients,
                ),
                count: data?.returningClients ?? 0,
              },
              {
                label: "Inactive",
                value: getClientPercentage(
                  data?.inactiveClients ?? 0,
                  activeClients,
                ),
                count: data?.inactiveClients ?? 0,
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
