"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { endOfMonth, startOfMonth } from "date-fns";

import { DataTable } from "@/components/dataTable";
import { bookingColumns } from "@/components/bookings/columns";
import { Button } from "@/components/ui/button";

import type { IBooking } from "@/types/booking";
import { useBookingsQuery } from "@/queries/bookingQueries";
import { DataTableSkeleton } from "@/components/dataTableSkeleton";

export default function BookingsPage() {
  const router = useRouter();

  const [page, setPage] = React.useState(0);
  const [limit, setLimit] = React.useState(10);

  const [searchParams, setSearchParams] = React.useState<{
    startDate?: string;
    endDate?: string;
  }>({});

  React.useEffect(() => {
    const now = new Date();
    const start = startOfMonth(now);
    const end = endOfMonth(now);

    setSearchParams({
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    });
  }, []);

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

  return (
    <div className="block w-full h-screen p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Bookings</h2>
        <Button disabled>Create Booking</Button>
      </div>

      {isLoading && (
        <div className="w-full h-screen p-6 space-y-4">
          <DataTableSkeleton
            columnCount={bookingColumns.length}
            rowCount={10}
          />
        </div>
      )}
      {isError && (
        <p className="text-xs text-destructive">
          Failed to load bookings data.
        </p>
      )}

      <DataTable<IBooking, unknown>
        columns={bookingColumns}
        data={bookings}
        enableDateFilter
        onPaginationChange={(pageIndex, pageSize) => {
          setPage(pageIndex);
          setLimit(pageSize);
        }}
        onRowClick={(booking) => router.replace(`/bookings/${booking.id}`)}
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
    </div>
  );
}
