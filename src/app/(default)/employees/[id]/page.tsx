"use client";

import * as React from "react";
import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { endOfMonth, format, startOfMonth } from "date-fns";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/dataTable";
import { bookingColumns } from "@/components/bookings/columns";

import type { IBooking, IFetchAllBookingsResponse } from "@/types/booking";
import {
  useEmployeeAssignmentsQuery,
  useEmployeeQuery,
} from "@/queries/employeeQueries";
import { DataTableSkeleton } from "@/components/dataTableSkeleton";

interface EmployeeDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EmployeeDetailsPage(props: EmployeeDetailsPageProps) {
  const router = useRouter();
  const { id } = use(props.params);
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

  // Employee
  const {
    data: employee,
    isLoading: employeeLoading,
    isError: employeeError,
  } = useEmployeeQuery(id);

  // Assignments
  const {
    data: assignments,
    isLoading: isAssignmentsLoading,
    isError: isAssignmentsError,
  } = useEmployeeAssignmentsQuery({
    employeeId: id,
    startDate: searchParams.startDate,
    endDate: searchParams.endDate,
    page,
    limit,
  });

  const assignedBookings: IBooking[] =
    assignments?.bookings ?? ([] as IFetchAllBookingsResponse["bookings"]);
  const totalPages = assignments
    ? Math.ceil(assignments.totalBookings / limit)
    : 1;
  const canNextPage = page + 1 < totalPages;
  const canPreviousPage = page > 0;

  if (employeeError) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-destructive">
        Failed to load employee.
      </div>
    );
  }

  if (employeeLoading || !employee) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Loading employee…
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-linear-to-b from-muted/40 to-background p-4">
      <Link
        href="/employees"
        className="inline-flex items-center text-md font-medium text-muted-foreground hover:text-foreground p-4"
      >
        Back to employees
      </Link>

      {/* Employee card */}
      <Card className="w-full max-w-7xl mx-auto mb-6">
        <CardHeader className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-gray-300 flex items-center justify-center text-2xl font-semibold text-gray-600">
              {employee.employee.account.first_name[0]}
              {employee.employee.account.last_name[0]}
            </div>
            <CardTitle className="text-3xl font-semibold">
              {employee.employee.account.first_name}{" "}
              {employee.employee.account.last_name}
            </CardTitle>
          </div>

          <Button variant="destructive" size="sm">
            Terminate Employee
          </Button>
        </CardHeader>

        <CardContent className="grid gap-3 text-sm text-muted-foreground md:grid-cols-2">
          <div className="space-y-1">
            <p>
              <span className="font-semibold">Employee ID:</span>{" "}
              {employee.employee.id}
            </p>
            <p>
              <span className="font-semibold">Email:</span>{" "}
              {employee.employee.account.email}
            </p>
            <p>
              <span className="font-semibold">Position:</span>{" "}
              {employee.employee.position}
            </p>
            <p>
              <span className="font-semibold">Hire Date:</span>{" "}
              {format(new Date(employee.employee.hire_date), "PP")}
            </p>
          </div>

          <div className="space-y-1">
            <p>
              <span className="font-semibold">Performance Score:</span>{" "}
              {employee.employee.performance_score}/5
            </p>
            <p>
              <span className="font-semibold">Number of Ratings:</span>{" "}
              {employee.employee.num_ratings}
            </p>
            <p>
              <span className="font-semibold">Status:</span>{" "}
              {employee.employee.status}
            </p>
            <p>
              <span className="font-semibold">Assigned Cleanings:</span>{" "}
              {assignedBookings.length}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Assigned Cleanings Table */}
      <section className="w-full max-w-7xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">
            Assigned Cleanings ({assignments?.totalBookings})
          </h3>
          {isAssignmentsLoading && (
            <div className="w-full h-screen p-6 space-y-4">
              <DataTableSkeleton
                columnCount={bookingColumns.length}
                rowCount={10}
              />
            </div>
          )}
          {isAssignmentsError && (
            <p className="text-xs text-destructive">
              Failed to load assignments.
            </p>
          )}
        </div>

        <DataTable<IBooking, unknown>
          columns={bookingColumns}
          data={assignedBookings}
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
      </section>
    </div>
  );
}
