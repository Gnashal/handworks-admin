import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { AlertTriangle, Package } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { IInventoryItem } from "@/types/inventory";

type ComputedStockStatus = "HIGH" | "LOW" | "DANGER" | "OUT_OF_STOCK";

const stockStatusPriority: Record<ComputedStockStatus, number> = {
  OUT_OF_STOCK: 0,
  DANGER: 1,
  LOW: 2,
  HIGH: 3,
};

const statusStyles: Record<
  ComputedStockStatus,
  {
    label: string;
    description: string;
    badgeClassName: string;
    progressClassName: string;
    textClassName: string;
  }
> = {
  HIGH: {
    label: "High Stock",
    description: "Sufficient supply",
    badgeClassName:
      "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50",
    progressClassName: "bg-emerald-500",
    textClassName: "text-emerald-700",
  },
  LOW: {
    label: "Low Stock",
    description: "Restock soon",
    badgeClassName:
      "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-50",
    progressClassName: "bg-amber-500",
    textClassName: "text-amber-700",
  },
  DANGER: {
    label: "Critical",
    description: "Immediate action needed",
    badgeClassName: "border-red-200 bg-red-50 text-red-700 hover:bg-red-50",
    progressClassName: "bg-red-500",
    textClassName: "text-red-700",
  },
  OUT_OF_STOCK: {
    label: "Out of Stock",
    description: "No available units",
    badgeClassName:
      "border-zinc-300 bg-zinc-100 text-zinc-700 hover:bg-zinc-100",
    progressClassName: "bg-zinc-400",
    textClassName: "text-zinc-700",
  },
};

const typeStyles: Record<
  IInventoryItem["type"],
  {
    label: string;
    className: string;
  }
> = {
  RESOURCE: {
    label: "Resource",
    className: "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-50",
  },
  EQUIPMENT: {
    label: "Equipment",
    className:
      "border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-50",
  },
};

const formatText = (value: string) => {
  return value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const getStockPercentage = (quantity: number, maxQuantity: number) => {
  if (!Number.isFinite(maxQuantity) || maxQuantity <= 0) return 0;

  const percentage = Math.round((quantity / maxQuantity) * 100);

  return Math.min(100, Math.max(0, percentage));
};

const getComputedStockStatus = (
  quantity: number,
  maxQuantity: number,
): ComputedStockStatus => {
  const percentage = getStockPercentage(quantity, maxQuantity);

  if (quantity <= 0) return "OUT_OF_STOCK";
  if (percentage <= 25) return "DANGER";
  if (percentage <= 50) return "LOW";

  return "HIGH";
};

export const columns: ColumnDef<IInventoryItem>[] = [
  {
    accessorKey: "inventory_number",
    header: "Item ID",
    enableSorting: true,
    cell: ({ row }) => {
      const item = row.original;

      return (
        <div className="flex items-center gap-3">
          <div className="min-w-0">
            <p className="truncate font-semibold text-foreground">
              {item.inventory_number}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Item",
    enableSorting: true,
    cell: ({ row }) => {
      const item = row.original;

      return (
        <div className="flex items-center gap-3">
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-muted">
            {item.image_url ? (
              <Image
                src={item.image_url}
                alt={item.name}
                fill
                className="object-cover"
                sizes="44px"
              />
            ) : (
              <Package className="h-5 w-5 text-muted-foreground" />
            )}
          </div>

          <div className="min-w-0">
            <p className="truncate font-semibold text-foreground">
              {item.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatText(item.type)} • {formatText(item.category)}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    enableSorting: true,
    cell: ({ row }) => {
      const type = typeStyles[row.original.type];

      return (
        <Badge variant="outline" className={type.className}>
          {type.label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    enableSorting: true,
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className="border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-50"
      >
        {formatText(row.original.category)}
      </Badge>
    ),
  },
  {
    id: "status",
    header: "Status",
    enableSorting: true,
    accessorFn: (row) =>
      stockStatusPriority[
        getComputedStockStatus(row.quantity, row.max_quantity)
      ],
    sortingFn: "basic",
    cell: ({ row }) => {
      const item = row.original;
      const computedStatus = getComputedStockStatus(
        item.quantity,
        item.max_quantity,
      );
      const status = statusStyles[computedStatus];

      return (
        <div className="flex flex-col gap-1">
          <Badge
            variant="outline"
            className={`w-fit gap-1.5 ${status.badgeClassName}`}
          >
            {(computedStatus === "DANGER" ||
              computedStatus === "OUT_OF_STOCK") && (
              <AlertTriangle className="h-3 w-3" />
            )}
            {status.label}
          </Badge>

          <span className="text-xs text-muted-foreground">
            {status.description}
          </span>
        </div>
      );
    },
  },
  {
    id: "quantity",
    header: "Stock Level",
    enableSorting: true,
    accessorFn: (row) => getStockPercentage(row.quantity, row.max_quantity),
    sortingFn: "basic",
    cell: ({ row }) => {
      const item = row.original;
      const percentage = getStockPercentage(item.quantity, item.max_quantity);
      const computedStatus = getComputedStockStatus(
        item.quantity,
        item.max_quantity,
      );
      const status = statusStyles[computedStatus];

      return (
        <div className="w-full max-w-57.5 space-y-2">
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col">
              <span className="font-semibold">
                {item.quantity} / {item.max_quantity}
              </span>
              <span className={`text-xs font-medium ${status.textClassName}`}>
                {percentage}% available
              </span>
            </div>

            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
              {item.unit}
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full transition-all ${status.progressClassName}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      );
    },
  },
];
