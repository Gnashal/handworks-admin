import { ColumnDef } from "@tanstack/react-table";
import { IBooking } from "@/types/booking";

export const clientHistoryColumns: ColumnDef<IBooking>[] = [
  {
    accessorKey: "id",
    header: "Booking ID",
  },
  {
    accessorFn: (row) => row.mainService.serviceType,
    id: "serviceType",
    header: "Service Type",
  },
  {
    accessorFn: (row) => row.base.startSched,
    id: "schedule",
    header: "Schedule",
    cell: ({ row }) =>
      new Date(row.original.base.startSched).toLocaleString(),
  },
  {
    accessorFn: (row) => row.base.paymentStatus,
    id: "paymentStatus",
    header: "Payment Status",
  },
  {
    accessorFn: (row) => row.totalPrice,
    id: "totalPrice",
    header: "Total Price",
    cell: ({ row }) => `₱${row.original.totalPrice}`,
  },
];