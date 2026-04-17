"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { endOfMonth, format, startOfMonth } from "date-fns";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/dataTable";
import { bookingColumns } from "@/app/(default)/bookings/columns";
import { DataTableSkeleton } from "@/components/dataTableSkeleton";

import {
  useCustomerBookingsQuery,
  useCustomerQuery,
} from "@/queries/customerQueries";
import type { IBooking, IFetchAllBookingsResponse } from "@/types/booking";

export default function ClientHistoryPage() {
  const { custId } = useParams() as { custId: string };
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

  const {
    data: customer,
    isLoading: customerLoading,
    isError: customerError,
  } = useCustomerQuery(custId);
  const {
    data: bookings,
    isLoading: bookingsLoading,
    isError: bookingsError,
  } = useCustomerBookingsQuery({
    customerId: custId,
    startDate: searchParams.startDate,
    endDate: searchParams.endDate,
    page,
    limit,
  });

  const customerBookings: IBooking[] =
    bookings?.bookings ?? ([] as IFetchAllBookingsResponse["bookings"]);
  const totalPages = bookings ? Math.ceil(bookings.totalBookings / limit) : 1;
  const canNextPage = page + 1 < totalPages;
  const canPreviousPage = page > 0;

  if (customerError) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-destructive">
        Failed to load customer.
      </div>
    );
  }

  if (customerLoading || !customer) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Loading customer...
      </div>
    );
  }

  const customerData = customer.customer;

  return (
    <div className="flex min-h-screen flex-col bg-linear-to-b from-muted/40 to-background p-4">
      <Link
        href="/clients"
        className="inline-flex items-center text-md font-medium text-muted-foreground hover:text-foreground p-4"
      >
        Back to clients
      </Link>

      <Card className="w-full max-w-7xl mx-auto mb-6">
        <CardHeader className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-gray-300 flex items-center justify-center text-2xl font-semibold text-gray-600">
              {customerData.account.first_name[0]}
              {customerData.account.last_name[0]}
            </div>
            <CardTitle className="text-3xl font-semibold">
              {customerData.account.first_name} {customerData.account.last_name}
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="grid gap-3 text-sm text-muted-foreground md:grid-cols-2">
          <div className="space-y-1">
            <p>
              <span className="font-semibold">Customer ID:</span>{" "}
              {customerData.id}
            </p>
            <p>
              <span className="font-semibold">Email:</span>{" "}
              {customerData.account.email}
            </p>
            <p>
              <span className="font-semibold">Role:</span>{" "}
              {customerData.account.role}
            </p>
          </div>

          <div className="space-y-1">
            <p>
              <span className="font-semibold">Account ID:</span>{" "}
              {customerData.account.id}
            </p>
            <p>
              <span className="font-semibold">Clerk ID:</span>{" "}
              {customerData.account.clerkId}
            </p>
            <p>
              <span className="font-semibold">Bookings in Range:</span>{" "}
              {bookings?.totalBookings ?? 0}
            </p>
          </div>
        </CardContent>
      </Card>

      <section className="w-full max-w-7xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">
            Booking History ({bookings?.totalBookings ?? 0})
          </h3>
          <div className="text-xs text-muted-foreground">
            {searchParams.startDate && searchParams.endDate
              ? `${format(new Date(searchParams.startDate), "MMM dd, yyyy")} - ${format(new Date(searchParams.endDate), "MMM dd, yyyy")}`
              : "Choose a date range"}
          </div>
        </div>

        {bookingsError && (
          <p className="text-xs text-destructive">Failed to load bookings.</p>
        )}

        {bookingsLoading ? (
          <div className="w-full">
            <DataTableSkeleton
              columnCount={bookingColumns.length}
              rowCount={10}
            />
          </div>
        ) : (
          <DataTable<IBooking, unknown>
            columns={bookingColumns}
            data={customerBookings}
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
        )}
      </section>
    </div>
  );
}
