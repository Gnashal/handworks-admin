"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Eye,
  UserRound,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IBooking, IMainServiceType } from "@/types/booking";
import { normalizeServiceName } from "@/lib/normalize";

function HeaderLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
      {children}
    </span>
  );
}

function BookingActionCell({ bookingId }: { bookingId: string }) {
  const router = useRouter();

  return (
    <Button
      size="sm"
      variant="outline"
      className="h-9 rounded-xl border-slate-200 bg-white px-3 text-xs font-semibold shadow-sm transition hover:bg-slate-950 hover:text-white"
      onClick={(event) => {
        event.stopPropagation();
        router.replace(`/bookings/${bookingId}`);
      }}
    >
      <Eye className="mr-1.5 h-3.5 w-3.5" />
      View
    </Button>
  );
}

const serviceBadgeClass: Record<string, string> = {
  GENERAL_CLEANING: "border-sky-200 bg-sky-50 text-sky-700",
  COUCH: "border-teal-200 bg-teal-50 text-teal-700",
  MATTRESS: "border-indigo-200 bg-indigo-50 text-indigo-700",
  CAR: "border-orange-200 bg-orange-50 text-orange-700",
  POST: "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700",
  SERVICE_TYPE_UNSPECIFIED: "border-slate-200 bg-slate-50 text-slate-700",
};

const bookingStatusClass: Record<string, string> = {
  NOT_STARTED: "border-amber-200 bg-amber-50 text-amber-700",
  ONGOING: "border-emerald-200 bg-emerald-50 text-emerald-700",
  COMPLETED: "border-blue-200 bg-blue-50 text-blue-700",
  CANCELLED: "border-red-200 bg-red-50 text-red-700",
};

const bookingStatusLabel: Record<string, string> = {
  NOT_STARTED: "Not Started",
  ONGOING: "Ongoing",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

function BookingStatusBadge({ status }: { status: string }) {
  return (
    <Badge
      variant="outline"
      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
        bookingStatusClass[status] ??
        "border-slate-200 bg-slate-50 text-slate-700"
      }`}
    >
      {bookingStatusLabel[status] ?? status}
    </Badge>
  );
}

function ReviewStatusBadge({ reviewStatus }: { reviewStatus: string }) {
  if (reviewStatus === "SCHEDULED") {
    return (
      <Badge
        variant="outline"
        className="rounded-full border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700"
      >
        <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
        Scheduled
      </Badge>
    );
  }

  if (reviewStatus === "PENDING") {
    return (
      <div className="flex items-center gap-2">
        <Badge
          variant="outline"
          className="rounded-full border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700"
        >
          <AlertTriangle className="mr-1 h-3.5 w-3.5" />
          Pending
        </Badge>
      </div>
    );
  }

  return (
    <Badge
      variant="outline"
      className="rounded-full border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700"
    >
      {reviewStatus}
    </Badge>
  );
}

export const bookingColumns: ColumnDef<IBooking>[] = [
  {
    accessorKey: "base.customerFirstName",
    header: () => <HeaderLabel>Customer</HeaderLabel>,
    cell: ({ row }) => {
      const base = row.original.base;

      return (
        <Link
          href={`/clients/${base.custId}`}
          className="group flex items-center gap-3"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition group-hover:bg-slate-950 group-hover:text-white">
            <UserRound className="h-4 w-4" />
          </div>

          <div>
            <p className="font-semibold text-slate-900 group-hover:text-blue-600 group-hover:underline">
              {base.customerFirstName} {base.customerLastName}
            </p>
          </div>
        </Link>
      );
    },
  },
  {
    accessorKey: "mainService.serviceType",
    header: () => <HeaderLabel>Service</HeaderLabel>,
    cell: ({ row }) => {
      const serviceType = row.original.mainService
        .serviceType as IMainServiceType;

      return (
        <Badge
          variant="outline"
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
            serviceBadgeClass[serviceType] ??
            serviceBadgeClass.SERVICE_TYPE_UNSPECIFIED
          }`}
        >
          {normalizeServiceName(serviceType)}
        </Badge>
      );
    },
  },
  {
    id: "bookedAt",
    header: () => <HeaderLabel>Booked</HeaderLabel>,
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-sm text-slate-700">
        <CalendarDays className="h-4 w-4 text-slate-400" />
        <span>
          {format(new Date(row.original.base.createdAt), "MMM dd, yyyy")}
        </span>
      </div>
    ),
  },
  {
    id: "cleaningDate",
    header: () => <HeaderLabel>Cleaning Date</HeaderLabel>,
    accessorFn: (row) => row.base.startSched,
    cell: ({ row }) => (
      <div className="space-y-0.5">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
          <CalendarDays className="h-4 w-4 text-slate-400" />
          {format(new Date(row.original.base.startSched), "MMM dd, yyyy")}
        </div>
        <div className="flex items-center gap-2 pl-6 text-xs text-slate-500">
          <Clock3 className="h-3.5 w-3.5" />
          {format(new Date(row.original.base.startSched), "hh:mm a")}
        </div>
      </div>
    ),
  },
  {
    id: "status",
    accessorFn: (row) => row.base.status,
    header: () => <HeaderLabel>Status</HeaderLabel>,
    cell: ({ row }) => <BookingStatusBadge status={row.original.base.status} />,
  },
  {
    id: "reviewStatus",
    accessorFn: (row) => row.base.reviewStatus,
    header: () => <HeaderLabel>Review</HeaderLabel>,
    cell: ({ row }) => (
      <ReviewStatusBadge reviewStatus={row.original.base.reviewStatus} />
    ),
  },
  {
    accessorKey: "totalPrice",
    header: () => <HeaderLabel>Total</HeaderLabel>,
    cell: ({ row }) => (
      <span className="font-bold text-slate-950">
        ₱{row.original.totalPrice.toLocaleString("en-PH")}
      </span>
    ),
  },
  {
    id: "actions",
    header: () => <HeaderLabel>Actions</HeaderLabel>,
    cell: ({ row }) => <BookingActionCell bookingId={row.original.id} />,
  },
];
