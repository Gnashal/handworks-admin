"use client";

import { useMemo } from "react";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  UserCheck,
  Users,
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
import { useBookingAlertBadge } from "@/hooks/useBookingAlertBadge";
import { useBookingsQuery } from "@/queries/bookingQueries";

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

const currencyFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export default function DashboardOverview({
  data,
}: {
  data?: IAdminDashboardResponse;
}) {
  const { hasBookingAlert } = useBookingAlertBadge();
  const { data: bookingTrendsData } = useBookingTrendsQuery();

  const bookingPageRange = useMemo(() => {
    const now = new Date();
    const start = startOfMonth(subMonths(now, 3));
    const end = endOfMonth(now);

    return {
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    };
  }, []);

  const { data: bookingsPageData } = useBookingsQuery(
    bookingPageRange.startDate,
    bookingPageRange.endDate,
    0,
    1,
  );

  const bookingTotal = bookingsPageData?.totalBookings ?? data?.bookings ?? 0;
  const todayBookings = data?.todayBookings ?? 0;
  const activeClients = data?.activeClients ?? 0;
  const employeesActive = data?.employeesActive ?? 0;
  const employeesTotal = data?.employeesTotal ?? 0;
  const revenue = data?.revenue ?? 0;
  const paid = data?.paid ?? 0;
  const unpaid = data?.unpaid ?? 0;

  const employeeCoverage = employeesTotal
    ? Math.round((employeesActive / employeesTotal) * 100)
    : 0;

  const topServices = (data?.topServices ?? []).map((service) => ({
    ...service,
    name: normalizeDashboardServiceName(service.name),
  }));

  const inventoryAlerts = data?.lowStockItems ?? [];

  const recentActivities = (data?.recentActivities ?? []).map((activity) => ({
    ...activity,
    type: toActivityType(activity.type),
  }));

  const clientBreakdown = [
    {
      label: "New",
      value: getClientPercentage(data?.newClients ?? 0, activeClients),
      count: data?.newClients ?? 0,
    },
    {
      label: "Returning",
      value: getClientPercentage(data?.returningClients ?? 0, activeClients),
      count: data?.returningClients ?? 0,
    },
    {
      label: "Inactive",
      value: getClientPercentage(data?.inactiveClients ?? 0, activeClients),
      count: data?.inactiveClients ?? 0,
    },
  ];

  return (
    <div className="space-y-6">
      {/* FAST SUMMARY STRIP */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Today
              </p>
              <p className="mt-1 text-xl font-semibold tracking-tight">
                {todayBookings} booking{todayBookings === 1 ? "" : "s"}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-700">
              <Clock3 className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Staff Readiness
              </p>
              <p className="mt-1 text-xl font-semibold tracking-tight">
                {employeeCoverage}%
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-700">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Revenue
              </p>
              <p className="mt-1 text-xl font-semibold tracking-tight">
                {currencyFormatter.format(revenue)}
              </p>
            </div>

            <div className="rounded-full border px-2 py-1 text-xs font-medium text-muted-foreground">
              Current period
            </div>
          </div>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_350px]">
        {/* LEFT CONTENT */}
        <div className="min-w-0 space-y-6">
          {/* METRIC CARDS */}
          <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2 2xl:grid-cols-5">
            <MetricCard
              href="/bookings"
              variant="info"
              showAlertDot={hasBookingAlert}
              icon={<CalendarDays className="h-5 w-5" />}
              data={{
                title: "Bookings",
                value: bookingTotal,
                todayStat: `${todayBookings} booking${
                  todayBookings === 1 ? "" : "s"
                } today`,
                change: data?.growthIndex?.bookingsGrowthIndex,
                trend:
                  (data?.growthIndex?.bookingsGrowthIndex ?? 0) >= 0
                    ? "up"
                    : "down",
              }}
            />

            <InventoryAlertsCard items={inventoryAlerts} variant="compact" />

            <MetricCard
              href="/clients"
              variant="success"
              icon={<Users className="h-5 w-5" />}
              data={{
                title: "Active Clients",
                value: activeClients,
                todayStat: `${data?.newClients ?? 0} new this period`,
              }}
            />

            <MetricCard
              href="/employees"
              variant="warning"
              icon={<UserCheck className="h-5 w-5" />}
              data={{
                title: "Employees Status",
                value: `${employeesActive}/${employeesTotal}`,
                todayStat: `${employeeCoverage}% active`,
              }}
            />

            <FinancialCard
              data={{
                label: "Revenue",
                amount: revenue,
                breakdowns: [
                  {
                    label: "Paid",
                    amount: paid,
                  },
                  {
                    label: "Unpaid",
                    amount: unpaid,
                  },
                ],
                href: "/cash-flow",
                className: "border border-slate-200 bg-white shadow-sm",
              }}
            />
          </div>

          {/* CHART */}
          <div className="rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
            {bookingTrendsData ? (
              <ServiceDynamics bookingTrendsData={bookingTrendsData} />
            ) : (
              <div className="flex h-72 items-center justify-center rounded-2xl border border-dashed bg-slate-50 text-sm text-muted-foreground">
                Failed to load booking trends data.
              </div>
            )}
          </div>

          {/* SECONDARY CARD */}
          <div className="grid grid-cols-1 gap-6">
            <TopServicesCard services={topServices} />
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <aside className="space-y-5 xl:sticky xl:top-6 xl:self-start">
          <QuickActions />

          <FcmNotificationBridge />

          <RecentActivity activities={recentActivities} />

          <ClientBreakdownCard total={activeClients} clients={clientBreakdown} />
        </aside>
      </div>
    </div>
  );
}