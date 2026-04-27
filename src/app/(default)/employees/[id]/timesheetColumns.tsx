"use client";

import { Badge } from "@/components/ui/badge";
import type { IEmployeeTimesheet } from "@/types/employee";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

const toValidDate = (value?: string | Date) => {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const formatTime = (value?: string | Date) => {
  const date = toValidDate(value);
  return date ? format(date, "hh:mm a") : "--";
};

const formatWorkHours = (timeIn?: string | Date, timeOut?: string | Date) => {
  const start = toValidDate(timeIn);
  const end = toValidDate(timeOut);

  if (!start || !end) return "--";

  const diffMs = end.getTime() - start.getTime();
  if (diffMs <= 0) return "--";

  const diffHrs = diffMs / (1000 * 60 * 60);
  return `${diffHrs.toFixed(2)} h`;
};

const resolveStatusVariant = (status: string) => {
  const normalized = status.trim().toUpperCase();

  if (normalized === "PRESENT" || normalized === "COMPLETE") {
    return "bg-emerald-500/10 text-emerald-700 border-emerald-500/30";
  }

  if (normalized === "LATE") {
    return "bg-amber-500/10 text-amber-700 border-amber-500/30";
  }

  if (normalized === "ABSENT" || normalized === "MISSING") {
    return "bg-rose-500/10 text-rose-700 border-rose-500/30";
  }

  return "bg-muted text-muted-foreground border-border";
};

export const timesheetColumns: ColumnDef<IEmployeeTimesheet>[] = [
  {
    id: "workDate",
    header: "Work Date",
    cell: ({ row }) => {
      const workDate = toValidDate(row.original.work_date);
      return workDate ? format(workDate, "MMM dd, yyyy") : "--";
    },
  },
  {
    id: "timeIn",
    header: "Clock In",
    cell: ({ row }) => formatTime(row.original.time_in),
  },
  {
    id: "timeOut",
    header: "Clock Out",
    cell: ({ row }) => formatTime(row.original.time_out),
  },
  {
    id: "totalHours",
    header: "Total Hours",
    cell: ({ row }) => (
      <span className="font-medium">
        {formatWorkHours(row.original.time_in, row.original.time_out)}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge className={resolveStatusVariant(row.original.status)}>
        {row.original.status}
      </Badge>
    ),
  },
];
