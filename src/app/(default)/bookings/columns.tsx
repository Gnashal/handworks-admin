"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IBooking, IMainServiceType } from "@/types/booking";
import { format } from "date-fns";
import { normalizeServiceName } from "@/lib/normalize";

function BookingActionCell({ bookingId }: { bookingId: string }) {
  const router = useRouter();

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={() => router.replace(`/bookings/${bookingId}`)}
    >
      View
    </Button>
  );
}

export const bookingColumns: ColumnDef<IBooking>[] = [
  {
    accessorKey: "base.customerFirstName",
    header: "Customer",
    cell: ({ row }) => {
      const base = row.original.base;
      return (
        <Link
          href={`/clients/${base.custId}`}
          className="font-medium text-md text-blue-500 hover:underline"
        >
          {base.customerFirstName} {base.customerLastName}
        </Link>
      );
    },
  },
  {
    accessorKey: "mainService.serviceType",
    header: "Service",
    cell: ({ row }) => (
      <Badge variant="secondary" className="text-sm">
        {normalizeServiceName(
          row.original.mainService.serviceType as IMainServiceType,
        )}
      </Badge>
    ),
  },
  {
    id: "bookedAt",
    header: "Booked",
    cell: ({ row }) =>
      format(new Date(row.original.base.createdAt), "MMM dd, yyyy"),
  },
  {
    id: "cleaningDate",
    header: "Cleaning Date",
    accessorFn: (row) => row.base.startSched,
    cell: ({ row }) =>
      format(new Date(row.original.base.startSched), "MMM dd, yyyy · hh:mm a"),
  },
  {
    id: "status",
    accessorFn: (row) => row.base.status,
    header: "Status",
    cell: ({ row }) => {
      const { status } = row.original.base;

      if (status === "NOT_STARTED") {
        return <Badge variant="destructive">Not Started</Badge>;
      }

      if (status === "ONGOING") {
        return <Badge variant="tertiary">Ongoing</Badge>;
      }

      return <Badge variant="default">Completed</Badge>;
    },
  },
  {
    id: "reviewStatus",
    accessorFn: (row) => row.base.reviewStatus,
    header: "Review",
    cell: ({ row }) => {
      const { reviewStatus } = row.original.base;

      if (reviewStatus === "SCHEDULED") {
        return <Badge>Scheduled</Badge>;
      }

      if (reviewStatus === "PENDING") {
        return (
          <div className="flex items-center gap-2">
            <Badge variant="destructive">Pending</Badge>
            <span
              className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white"
              title="New booking to review"
            >
              !
            </span>
          </div>
        );
      }

      return <Badge variant="outline">{reviewStatus}</Badge>;
    },
  },
  {
    accessorKey: "totalPrice",
    header: "Total",
    cell: ({ row }) => (
      <span className="font-semibold">
        ₱{row.original.totalPrice.toLocaleString()}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <BookingActionCell bookingId={row.original.id} />,
  },
];
