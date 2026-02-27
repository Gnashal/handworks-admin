"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { DataTable } from "@/components/dataTable";
import { bookingColumns } from "@/app/(default)/bookings/columns";

import { useBookingsQuery } from "@/queries/bookingQueries";
import type { IBooking } from "@/types/booking";

export default function ClientHistoryPage() {
  const { custId } = useParams() as { custId: string };
  const router = useRouter();

  const [page, setPage] = React.useState(0);
  const [limit, setLimit] = React.useState(5);

  const { data, isLoading } = useBookingsQuery("", "", 0, 1000);

  const bookings: IBooking[] = data?.bookings ?? [];

  const filteredBookings = bookings.filter(
    (b) => b.base.custId === custId
  );

  const totalBookings = filteredBookings.length;
  const totalPages = Math.max(
    1,
    Math.ceil(totalBookings / limit)
  );

  const paginatedBookings = filteredBookings.slice(
    page * limit,
    page * limit + limit
  );

  const canNextPage = page + 1 < totalPages;
  const canPreviousPage = page > 0;

  return (
    <div className="block w-full h-screen p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <button
          onClick={() => router.push("/clients")}
          className="hover:underline"
        >
          Clients
        </button>
        <span>/</span>
        <span className="font-medium text-foreground">
          {custId}
        </span>
      </div>

      <h2 className="text-2xl font-semibold">
        Booking History
      </h2>

      {!isLoading && filteredBookings.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg font-medium">
            No bookings found.
          </p>
          <p className="text-sm">
            This client has not made any bookings yet.
          </p>
        </div>
      )}

      {filteredBookings.length > 0 && (
        <DataTable<IBooking, unknown>
          columns={bookingColumns}
          data={paginatedBookings}
          pageCount={totalPages}
          canNextPage={canNextPage}
          canPreviousPage={canPreviousPage}
          onPaginationChange={(pageIndex, pageSize) => {
            setPage(pageIndex);
            setLimit(pageSize);
          }}
        />
      )}
    </div>
  );
}