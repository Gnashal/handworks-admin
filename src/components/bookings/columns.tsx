import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { IBooking } from "@/types/booking";
import { format } from "date-fns";

export const bookingColumns: ColumnDef<IBooking>[] = [
  {
    accessorKey: "base.customerFirstName",
    header: "Customer",
    cell: ({ row }) => {
      const base = row.original.base;
      return (
        <div className="font-medium">
          {base.customerFirstName} {base.customerLastName}
        </div>
      );
    },
  },
  {
    accessorKey: "mainService.serviceType",
    header: "Service",
    cell: ({ row }) => (
      <Badge variant="secondary">
        {row.original.mainService.serviceType.replace("_", " ")}
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
    cell: ({ row }) =>
      format(new Date(row.original.base.startSched), "MMM dd, yyyy · hh:mm a"),
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const { paymentStatus, reviewStatus } = row.original.base;

      if (paymentStatus === "UNPAID") {
        return <Badge variant="destructive">Unpaid</Badge>;
      }

      if (reviewStatus === "COMPLETED") {
        return <Badge>Completed</Badge>;
      }

      return <Badge variant="outline">Active</Badge>;
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
