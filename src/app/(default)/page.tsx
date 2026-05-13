"use client";

import React from "react";
import { AlertCircle, LayoutDashboard } from "lucide-react";

import DatePicker from "@/components/dashboard/dateFilter";
import DashboardOverview from "@/components/dashboard/overview";
import { useDashboardQuery } from "@/queries/dashboardQueries";
import Loader from "@/components/loader";

export default function Dashboard() {
  const [dateFilter, setDateFilter] = React.useState<"week" | "month" | "year">(
    "week",
  );

  const { data, isLoading, isError, error } = useDashboardQuery(dateFilter);

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] w-full items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-linear-to-b from-slate-50 via-background to-background">
      <div className="w-full space-y-6 p-4 sm:p-6 lg:p-8">
        {/* HEADER */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-5 bg-linear-to-r from-slate-950 via-slate-900 to-slate-800 p-5 text-white sm:p-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-slate-200">
                <LayoutDashboard className="h-3.5 w-3.5" />
                Admin Operations Center
              </div>

              <div>
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Overview
                </h2>
                <p className="mt-1 max-w-2xl text-sm text-slate-300">
                  Monitor bookings, revenue, employee availability, inventory
                  alerts, and client activity from one dashboard.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-1 backdrop-blur">
                <DatePicker value={dateFilter} onChange={setDateFilter} />
              </div>
            </div>
          </div>
        </div>

        {/* ERROR */}
        {isError && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              Failed to load dashboard data
              {error instanceof Error ? `: ${error.message}` : ""}
            </p>
          </div>
        )}

        {/* DASHBOARD */}
        <DashboardOverview data={data} />
      </div>
    </section>
  );
}