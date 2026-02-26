import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { IBooking, IMainServiceType } from "@/types/booking";
import { format } from "date-fns";
import { normalizeServiceName } from "@/lib/normalize";

export const bookingColumns: ColumnDef<IBooking>[] = [
  {
    accessorKey: "base.customerFirstName",
    header: "Customer",
    cell: ({ row }) => {
      const base = row.original.base;
      return (
        <Link
          href={`/customers/${base.custId}`}
          className="font-medium text-md text-blue-500 hover:underline"
        >
          {base.custId}
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
    id: "paymentStatus",
    accessorFn: (row) => row.base.paymentStatus,
    header: "Payment",
    cell: ({ row }) => {
      const { paymentStatus } = row.original.base;

      if (paymentStatus === "UNPAID") {
        return <Badge variant="destructive">{paymentStatus}</Badge>;
      }

      if (paymentStatus === "PAID") {
        return <Badge variant="default">{paymentStatus}</Badge>;
      }

      return <Badge variant="outline">{paymentStatus}</Badge>;
    },
  },
  {
    id: "reviewStatus",
    accessorFn: (row) => row.base.reviewStatus,
    header: "Review",
    cell: ({ row }) => {
      const { reviewStatus } = row.original.base;

      if (reviewStatus === "COMPLETED") {
        return <Badge>Completed</Badge>;
      }

      if (reviewStatus === "PENDING") {
        return (
          <div className="flex items-center gap-2">
            <Badge variant="destructive">{reviewStatus}</Badge>
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
];
