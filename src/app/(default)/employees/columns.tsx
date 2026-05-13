"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Eye, Mail, Star, UserRound } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IEmployee } from "@/types/account";

function getEmployeeName(employee: IEmployee) {
  const firstName = employee.account.first_name?.trim() ?? "";
  const lastName = employee.account.last_name?.trim() ?? "";
  const fullName = `${firstName} ${lastName}`.trim();

  return fullName || "Unnamed Employee";
}

function getInitials(employee: IEmployee) {
  const firstInitial = employee.account.first_name?.charAt(0) ?? "";
  const lastInitial = employee.account.last_name?.charAt(0) ?? "";
  const initials = `${firstInitial}${lastInitial}`.toUpperCase();

  return initials || "E";
}

function formatPosition(position: string) {
  if (!position) return "Staff";

  return position
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatHireDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "--";
  }

  return format(date, "MMM dd, yyyy");
}

function getStatusClass(status: string) {
  const normalizedStatus = status.trim().toUpperCase();

  if (normalizedStatus === "ACTIVE") {
    return "border-emerald-500/30 bg-emerald-500/10 text-emerald-700";
  }

  if (normalizedStatus === "INACTIVE") {
    return "border-slate-300 bg-slate-100 text-slate-700";
  }

  if (normalizedStatus === "SUSPENDED") {
    return "border-red-500/30 bg-red-500/10 text-red-700";
  }

  return "border-slate-300 bg-white text-slate-700";
}

function StarRating({ rating }: { rating: number }) {
  const safeRating = Number.isFinite(rating) ? rating : 0;
  const roundedRating = Math.round(safeRating);

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => {
        const filled = index < roundedRating;

        return (
          <Star
            key={index}
            className={
              filled
                ? "h-4 w-4 fill-yellow-400 text-yellow-400"
                : "h-4 w-4 text-slate-300"
            }
          />
        );
      })}

      <span className="ml-1 text-xs font-medium text-muted-foreground">
        {safeRating.toFixed(1)}
      </span>
    </div>
  );
}

export const columns = (
  onViewEmployee?: (employee: IEmployee) => void,
): ColumnDef<IEmployee>[] => [
  {
    id: "employee",
    header: "Employee",
    accessorFn: (row) =>
      `${row.account.first_name} ${row.account.last_name}`.trim(),
    cell: ({ row }) => {
      const employee = row.original;

      return (
        <div className="flex min-w-64 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-sm font-semibold text-slate-700 ring-1 ring-slate-200">
            {getInitials(employee)}
          </div>

          <div className="min-w-0">
            <p className="truncate font-semibold text-slate-950">
              {getEmployeeName(employee)}
            </p>

            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
              <Mail className="h-3 w-3" />
              <span className="truncate">{employee.account.email}</span>
            </p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "position",
    header: "Position",
    cell: ({ row }) => (
      <Badge variant="outline" className="bg-slate-50">
        {formatPosition(row.original.position)}
      </Badge>
    ),
  },
  {
    accessorKey: "hire_date",
    header: "Hire Date",
    cell: ({ row }) => (
      <span className="text-sm font-medium text-slate-700">
        {formatHireDate(row.original.hire_date)}
      </span>
    ),
  },
  {
    accessorKey: "performance_score",
    header: "Rating",
    cell: ({ row }) => (
      <StarRating rating={row.original.performance_score} />
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={`font-semibold ${getStatusClass(row.original.status)}`}
      >
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "id",
    header: "Employee ID",
    cell: ({ row }) => (
      <span
        title={row.original.id}
        className="block max-w-64 truncate font-mono text-xs text-slate-600"
      >
        {row.original.id}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={(event) => {
          event.stopPropagation();
          onViewEmployee?.(row.original);
        }}
        className="bg-white"
      >
        <Eye className="h-4 w-4" />
        View
      </Button>
    ),
  },
];