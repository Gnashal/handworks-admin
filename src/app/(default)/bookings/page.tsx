"use client";

import { useRouter } from "next/navigation";
import { DataTable } from "@/components/dataTable";
import { bookingColumns } from "@/components/bookings/columns";
import { mockBookings } from "@/data/mockBookings";
import { Button } from "@/components/ui/button";
import type { IBooking } from "@/types/booking";
import { startOfMonth, endOfMonth } from "date-fns";
import React from "react";

export default function BookingsPage() {
  const router = useRouter();
  const [page, setPage] = React.useState(0);
  const [limit, setLimit] = React.useState(10);

  const [fromDate, setFromDate] = React.useState<Date | undefined>();
  const [toDate, setToDate] = React.useState<Date | undefined>();

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

  return (
    <div className="block w-full h-screen p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Bookings</h2>
        <Button disabled>Create Booking</Button>
      </div>

      <DataTable<IBooking, unknown>
        columns={bookingColumns}
        data={mockBookings.bookings}
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
      />
    </div>
  );
}
