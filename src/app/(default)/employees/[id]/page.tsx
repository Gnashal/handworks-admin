"use client";

import * as React from "react";
import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { endOfMonth, format, startOfMonth } from "date-fns";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/dataTable";
import { bookingColumns } from "@/app/(default)/bookings/columns";
import { timesheetColumns } from "./timesheetColumns";

import type { IBooking, IFetchAllBookingsResponse } from "@/types/booking";
import type { IEmployeeTimesheet } from "@/types/employee";
import {
  useEmployeeAssignmentsQuery,
  useEmployeeQuery,
  useEmployeeTimesheetQuery,
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
  const [timesheetPage, setTimesheetPage] = React.useState(0);
  const [timesheetLimit, setTimesheetLimit] = React.useState(10);

  const [searchParams, setSearchParams] = React.useState<{
    startDate?: string;
    endDate?: string;
  }>({});
  const [timesheetSearchParams, setTimesheetSearchParams] = React.useState<{
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

    setTimesheetSearchParams({
      startDate: format(start, "yyyy-MM-dd"),
      endDate: format(end, "yyyy-MM-dd"),
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

  const {
    data: timesheet,
    isLoading: isTimesheetLoading,
    isError: isTimesheetError,
  } = useEmployeeTimesheetQuery({
    employeeId: id,
    startDate: timesheetSearchParams.startDate,
    endDate: timesheetSearchParams.endDate,
    page: timesheetPage,
    limit: timesheetLimit,
  });

  const assignedBookings: IBooking[] =
    assignments?.bookings ?? ([] as IFetchAllBookingsResponse["bookings"]);
  const totalPages = assignments
    ? Math.ceil(assignments.totalBookings / limit)
    : 1;
  const canNextPage = page + 1 < totalPages;
  const canPreviousPage = page > 0;
  const timesheetRows: IEmployeeTimesheet[] = React.useMemo(() => {
    if (!timesheet) return [];

    if (Array.isArray(timesheet.timesheets)) {
      return timesheet.timesheets;
    }

    if (Array.isArray(timesheet.timesheet)) {
      return timesheet.timesheet;
    }

    if (timesheet.timesheet) {
      return [timesheet.timesheet];
    }

    return [];
  }, [timesheet]);

  const totalTimesheetRecords =
    timesheet?.totalTimesheets ??
    timesheet?.totalRecords ??
    timesheet?.total ??
    timesheetRows.length;

  const totalTimesheetPages = Math.max(
    1,
    Math.ceil(totalTimesheetRecords / timesheetLimit),
  );
  const canTimesheetNextPage = timesheetPage + 1 < totalTimesheetPages;
  const canTimesheetPreviousPage = timesheetPage > 0;

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
    <div className="min-h-screen bg-linear-to-b from-slate-50 via-background to-background p-4 sm:p-6">
      <Link
        href="/employees"
        className="mx-auto inline-flex w-full max-w-7xl items-center px-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        Back to employees
      </Link>

      {/* Employee card */}
      <Card className="w-full max-w-7xl mx-auto mb-6 border-slate-200/80 shadow-sm">
        <CardHeader className="flex flex-col gap-4 pb-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-slate-200 via-slate-100 to-white text-2xl font-semibold text-slate-700 ring-1 ring-slate-200">
              {employee.employee.account.first_name[0]}
              {employee.employee.account.last_name[0]}
            </div>
            <div>
              <CardTitle className="text-2xl font-semibold sm:text-3xl">
                {employee.employee.account.first_name}{" "}
                {employee.employee.account.last_name}
              </CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Employee profile and activity overview
              </p>
            </div>
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

      <section className="w-full max-w-7xl mx-auto space-y-6">
        <Tabs defaultValue="assignments" className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">
                Work Panels
              </h2>
            </div>

            <TabsList className="w-full justify-start sm:w-auto" variant="line">
              <TabsTrigger value="assignments">
                Assigned Cleanings ({assignments?.totalBookings ?? 0})
              </TabsTrigger>
              <TabsTrigger value="timesheet">
                Timesheet ({totalTimesheetRecords})
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="assignments" className="mt-0">
            <Card className="border-slate-200/80 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-xl">Assigned Cleanings</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Monthly assignments and booking workload
                  </p>
                </div>
                {isAssignmentsError && (
                  <p className="text-xs text-destructive">
                    Failed to load assignments.
                  </p>
                )}
              </CardHeader>

              <CardContent>
                {isAssignmentsLoading ? (
                  <div className="w-full">
                    <DataTableSkeleton
                      columnCount={bookingColumns.length}
                      rowCount={10}
                    />
                  </div>
                ) : (
                  <DataTable<IBooking, unknown>
                    columns={bookingColumns}
                    data={assignedBookings}
                    enableDateFilter
                    onPaginationChange={(pageIndex, pageSize) => {
                      setPage(pageIndex);
                      setLimit(pageSize);
                    }}
                    onRowClick={(booking) =>
                      router.replace(`/bookings/${booking.id}`)
                    }
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timesheet" className="mt-0">
            <Card className="border-slate-200/80 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-xl">Employee Timesheet</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Attendance history for the selected month
                  </p>
                </div>
                {isTimesheetError && (
                  <p className="text-xs text-destructive">
                    Failed to load employee timesheet.
                  </p>
                )}
              </CardHeader>

              <CardContent>
                {isTimesheetLoading ? (
                  <div className="w-full">
                    <DataTableSkeleton
                      columnCount={timesheetColumns.length}
                      rowCount={10}
                    />
                  </div>
                ) : (
                  <DataTable<IEmployeeTimesheet, unknown>
                    columns={timesheetColumns}
                    data={timesheetRows}
                    enableDateFilter
                    onPaginationChange={(pageIndex, pageSize) => {
                      setTimesheetPage(pageIndex);
                      setTimesheetLimit(pageSize);
                    }}
                    onDateSearchClick={(from, to) => {
                      setTimesheetSearchParams({
                        startDate: from
                          ? format(from, "yyyy-MM-dd")
                          : undefined,
                        endDate: to ? format(to, "yyyy-MM-dd") : undefined,
                      });
                      setTimesheetPage(0);
                    }}
                    pageCount={totalTimesheetPages}
                    canNextPage={canTimesheetNextPage}
                    canPreviousPage={canTimesheetPreviousPage}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
