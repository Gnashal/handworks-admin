"use client";

import React from "react";
import DatePicker from "@/components/dashboard/dateFilter";
import DashboardOverview from "@/components/dashboard/overview";
import { useDashboardQuery } from "@/queries/dashboardQueries";
import Loader from "@/components/loader";

export default function Dashboard() {
  const [dateFilter, setDateFilter] = React.useState<"week" | "month" | "year">(
    "week"
  );

  const { data, isLoading, isError, error } = useDashboardQuery(dateFilter);

  return (
    <div className="w-full p-6 lg:p-8 space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Overview</h2>
        <DatePicker value={dateFilter} onChange={setDateFilter} />
      </div>

      {/* LOADING */}
      {isLoading && (
        <div className="flex w-full justify-center py-10">
          <Loader />
        </div>
      )}

      {/* ERROR */}
      {isError && (
        <p className="text-sm text-destructive">
          Failed to load dashboard data
          {error instanceof Error ? `: ${error.message}` : ""}
        </p>
      )}

      {/* DASHBOARD */}
      <DashboardOverview />
    </div>
  );
}