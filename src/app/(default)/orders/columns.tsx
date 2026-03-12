"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { format } from "date-fns";

import type { IQuote } from "@/types/payment";
import { Badge } from "@/components/ui/badge";
import { normalizeServiceName } from "@/lib/normalize";
import { IMainServiceType } from "@/types/booking";

export const quoteColumns: ColumnDef<IQuote>[] = [
  {
    id: "customerId",
    header: "Customer",
    cell: ({ row }) => (
      <Link
        href={`/customers/${row.original.customerId}`}
        className="font-medium text-md text-blue-500 hover:underline"
      >
        {row.original.customerId}
      </Link>
    ),
  },
  {
    accessorKey: "mainService",
    header: "Main Service",
    cell: ({ row }) => (
      <Badge variant="secondary" className="text-sm">
        {normalizeServiceName(row.original.mainService as IMainServiceType)}
      </Badge>
    ),
  },
  {
    accessorKey: "subtotal",
    header: "Subtotal",
    cell: ({ row }) => (
      <span className="font-medium">
        ₱{row.original.subtotal.toLocaleString("en-PH")}
      </span>
    ),
  },
  {
    accessorKey: "addonTotal",
    header: "Addon Total",
    cell: ({ row }) => (
      <span className="font-medium">
        ₱{row.original.addonTotal.toLocaleString("en-PH")}
      </span>
    ),
  },
  {
    accessorKey: "totalPrice",
    header: "Total Price",
    cell: ({ row }) => (
      <span className="font-semibold">
        ₱{row.original.totalPrice.toLocaleString("en-PH")}
      </span>
    ),
  },
  {
    id: "isValid",
    header: "Is Valid",
    cell: ({ row }) => {
      const isValid = row.original.isValid;
      return (
        <Badge
          variant={isValid ? "default" : "outline"}
          className="text-md uppercase"
        >
          {isValid ? "Valid" : "Invalid"}
        </Badge>
      );
    },
  },
  {
    id: "createdAt",
    header: "Created At",
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">
        {format(new Date(row.original.createdAt), "MMM dd, yyyy · HH:mm")}
      </span>
    ),
  },
  {
    id: "hasAddons",
    header: "Has Addons",
    cell: ({ row }) => {
      const hasAddons = row.original.addons && row.original.addons.length > 0;
      return (
        <Badge
          variant={hasAddons ? "default" : "outline"}
          className="text-md uppercase"
        >
          {hasAddons ? "Yes" : "No"}
        </Badge>
      );
    },
  },
];
