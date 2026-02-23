"use client";

import React from "react";
import DatePicker from "@/components/dashboard/dateFilter";
import DashboardOverview from "@/components/dashboard/overview";
import { useDashboardQuery } from "@/queries/dashboardQueries";
import Loader from "@/components/loader";

export default function Dashboard() {
  const [dateFilter, setDateFilter] = React.useState<"week" | "month" | "year">(
    "week",
  );

  const { data, isLoading, isError, error } = useDashboardQuery(dateFilter);

  return (
    <div className="w-full h-screen p-6 space-y-4">
      <div className="flex flex-row items-center justify-between p-4">
        <h2 className="text-2xl font-semibold">Overview</h2>
        <DatePicker value={dateFilter} onChange={setDateFilter} />
      </div>

      {isLoading && (
        <div className="flex w-full justify-center py-10">
          <Loader />
        </div>
      )}

      {isError && (
        <p className="px-4 text-sm text-destructive">
          Failed to load dashboard data
          {error instanceof Error ? `: ${error.message}` : ""}
        </p>
      )}

      <DashboardOverview
        weeklySales={{
          title: "Sales",
          value: data?.sales ?? 0,
          change: data?.growthIndex.salesGrowthIndex ?? 0,
          trend: "up",
        }}
        bookings={{
          title: "Bookings",
          value: data?.bookings ?? 0,
          change: data?.growthIndex.bookingsGrowthIndex ?? 0,
          trend: "up",
        }}
        clients={{
          title: "Clients",
          value: data?.clients ?? 0,
        }}
        activeSessions={{
          title: "Active Sessions",
          value: data?.activeSessions ?? 0,
          change: data?.growthIndex.activeSessionsGrowthIndex ?? 0,
          trend: "down",
        }}
        activeWorkers={{
          title: "Employees",
          value: data?.clients ?? 0,
        }}
        clientBreakdown={[
          { label: "New", value: 62 },
          { label: "Returning", value: 26 },
          { label: "Inactive", value: 12 },
        ]}
        bookingSeries={[
          { label: "Jan", value: 40 },
          { label: "Feb", value: 55 },
          { label: "Mar", value: 48 },
        ]}
        paidInvoices={{ label: "Paid Invoices", amount: 80465.23 }}
        fundReceived={{ label: "Fund Received", amount: 153355 }}
      />
    </div>
  );
}
