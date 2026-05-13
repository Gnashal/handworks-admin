"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { endOfMonth, format, startOfMonth, subMonths } from "date-fns";
import {
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock3,
  CircleDollarSign,
  Plus,
} from "lucide-react";

import { DataTable } from "@/components/dataTable";
import { DataTableSkeleton } from "@/components/dataTableSkeleton";
import { Button } from "@/components/ui/button";
import { bookingColumns } from "./columns";

import type { IBooking } from "@/types/booking";
import { useBookingsQuery } from "@/queries/bookingQueries";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(value);
};

const formatRangeDate = (date?: string) => {
  if (!date) return "—";

  return format(new Date(date), "MMM dd, yyyy");
};

export default function BookingsPage() {
  const router = useRouter();

  const defaultRange = React.useMemo(() => {
    const now = new Date();
    const start = startOfMonth(subMonths(now, 3));
    const end = endOfMonth(now);

    return {
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    };
  }, []);

  const [page, setPage] = React.useState(0);
  const [limit, setLimit] = React.useState(10);

  const [searchParams, setSearchParams] = React.useState<{
    startDate?: string;
    endDate?: string;
  }>(defaultRange);

  const { data, isLoading, isError } = useBookingsQuery(
    searchParams.startDate ?? "",
    searchParams.endDate ?? "",
    page,
    limit,
  );

  const bookings: IBooking[] = data?.bookings ?? [];
  const totalBookings = data?.totalBookings ?? 0;

  const totalPages = Math.max(1, Math.ceil(totalBookings / limit));
  const canNextPage = page + 1 < totalPages;
  const canPreviousPage = page > 0;

  const pendingReviewCount = React.useMemo(() => {
    return bookings.filter(
      (booking) => booking.base.reviewStatus === "PENDING",
    ).length;
  }, [bookings]);

  const scheduledCount = React.useMemo(() => {
    return bookings.filter(
      (booking) => booking.base.reviewStatus === "SCHEDULED",
    ).length;
  }, [bookings]);

  const pageRevenue = React.useMemo(() => {
    return bookings.reduce((total, booking) => total + booking.totalPrice, 0);
  }, [bookings]);

  const todayBookingsCount = React.useMemo(() => {
    const todayKey = format(new Date(), "yyyy-MM-dd");

    return bookings.filter((booking) => {
      const bookingDateKey = format(
        new Date(booking.base.startSched),
        "yyyy-MM-dd",
      );

      return bookingDateKey === todayKey;
    }).length;
  }, [bookings]);

  const currentRangeLabel = `${formatRangeDate(
    searchParams.startDate,
  )} - ${formatRangeDate(searchParams.endDate)}`;

  return (
    <section className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 px-3 py-4 sm:px-4 lg:px-5">
      <div className="mx-auto flex w-full max-w-[1680px] flex-col gap-5">
        <header className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-slate-950 px-5 py-5 text-white lg:px-7">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-slate-200">
                  <CalendarDays className="h-3.5 w-3.5" />
                  Booking Management
                </div>

                <h1 className="text-2xl font-semibold tracking-tight">
                  Bookings
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-5 text-slate-300">
                  Review customer bookings, check schedules, approve pending
                  requests, and open detailed booking records.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-2.5">
                  <p className="text-xs text-slate-300">Current range</p>
                  <p className="text-sm font-semibold text-white">
                    {currentRangeLabel}
                  </p>
                </div>

                <Button
                  type="button"
                  onClick={() => router.push("/bookings/create")}
                  className="h-10 rounded-xl bg-white px-4 text-slate-950 hover:bg-slate-100"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Booking
                </Button>
              </div>
            </div>
          </div>

          <div className="grid gap-3 border-t border-slate-200 bg-white p-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Total Bookings
                  </p>
                  <p className="mt-1 text-2xl font-bold text-slate-950">
                    {isLoading ? "..." : totalBookings}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Matches the selected date range
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200/70 text-slate-600">
                  <ClipboardList className="h-5 w-5" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Pending Review
                  </p>
                  <p className="mt-1 text-2xl font-bold text-slate-950">
                    {isLoading ? "..." : pendingReviewCount}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Visible on this page
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200/70 text-slate-600">
                  <Clock3 className="h-5 w-5" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Scheduled
                  </p>
                  <p className="mt-1 text-2xl font-bold text-slate-950">
                    {isLoading ? "..." : scheduledCount}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Approved bookings on this page
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200/70 text-slate-600">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Page Revenue
                  </p>
                  <p className="mt-1 text-2xl font-bold text-slate-950">
                    {isLoading ? "..." : formatCurrency(pageRevenue)}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {todayBookingsCount} booking
                    {todayBookingsCount === 1 ? "" : "s"} today
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200/70 text-slate-600">
                  <CircleDollarSign className="h-5 w-5" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {isError && (
          <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            Failed to load bookings data.
          </p>
        )}

        {isLoading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <DataTableSkeleton
              columnCount={bookingColumns.length}
              rowCount={10}
            />
          </div>
        ) : (
          <DataTable<IBooking, unknown>
            columns={bookingColumns}
            data={bookings}
            enableDateFilter
            onPaginationChange={(pageIndex, pageSize) => {
              setPage(pageIndex);
              setLimit(pageSize);
            }}
            onDateSearchClick={(from, to) => {
              setSearchParams({
                startDate: from ? from.toISOString() : undefined,
                endDate: to ? to.toISOString() : undefined,
              });
              setPage(0);
            }}
            pageCount={totalPages}
            canNextPage={canNextPage}
            canPreviousPage={canPreviousPage}
          />
        )}
      </div>
    </section>
  );
}