"use client";
import { notFound } from "next/navigation";
import { format } from "date-fns";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/dataTable";
import { bookingColumns } from "@/components/bookings/columns";

import { mockEmployees } from "@/data/mockEmployees";
import { mockBookings } from "@/data/mockBookings";
import type { IBooking } from "@/types/booking";
import React from "react";
import Link from "next/link";

interface EmployeeDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EmployeeDetailsPage(props: EmployeeDetailsPageProps) {
  const params = React.use(props.params);
  const { id } = params;

  const employee = mockEmployees.employees.find((e) => e.id === id);
  if (!employee) notFound();

  const assignedBookings: IBooking[] = mockBookings.bookings.filter((booking) =>
    booking.cleaners?.some((cleaner) => cleaner.id === id),
  );

  return (
    <div className="flex min-h-screen flex-col bg-linear-to-b from-muted/40 to-background p-4">
      <Link
        href="/employees"
        className="inline-flex items-center text-md font-medium text-muted-foreground hover:text-foreground p-4"
      >
        Back to employees
      </Link>
      {/* Single Employee Card */}
      <Card className="w-full max-w-7xl mx-auto mb-6">
        <CardHeader className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-4">
            {/* Default circular avatar */}
            <div className="h-20 w-20 rounded-full bg-gray-300 flex items-center justify-center text-2xl font-semibold text-gray-600">
              {employee.account.firstName[0]}
              {employee.account.lastName[0]}
            </div>
            <CardTitle className="text-3xl font-semibold">
              {employee.account.firstName} {employee.account.lastName}
            </CardTitle>
          </div>

          {/* Terminate button */}
          <Button variant="destructive" size="sm">
            Terminate Employee
          </Button>
        </CardHeader>

        <CardContent className="grid gap-3 text-sm text-muted-foreground md:grid-cols-2">
          <div className="space-y-1">
            <p>
              <span className="font-semibold">Employee ID:</span> {employee.id}
            </p>
            <p>
              <span className="font-semibold">Email:</span>{" "}
              {employee.account.email}
            </p>
            <p>
              <span className="font-semibold">Position:</span>{" "}
              {employee.position}
            </p>
            <p>
              <span className="font-semibold">Hire Date:</span>{" "}
              {format(new Date(employee.hire_date), "PP")}
            </p>
          </div>

          <div className="space-y-1">
            <p>
              <span className="font-semibold">Performance Score:</span>{" "}
              {employee.performance_score}/5
            </p>
            <p>
              <span className="font-semibold">Number of Ratings:</span>{" "}
              {employee.num_ratings}
            </p>
            <p>
              <span className="font-semibold">Status:</span> {employee.status}
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
        <h3 className="text-xl font-semibold">
          Assigned Cleanings ({assignedBookings.length})
        </h3>
        <DataTable<IBooking, unknown>
          columns={bookingColumns}
          data={assignedBookings}
          enableDateFilter
          onRowClick={(booking) =>
            (window.location.href = `/bookings/${booking.id}`)
          }
          getStartDate={(booking) =>
            booking.base.startSched ? new Date(booking.base.startSched) : null
          }
          getEndDate={(booking) =>
            booking.base.endSched ? new Date(booking.base.endSched) : null
          }
        />
      </section>
    </div>
  );
}
