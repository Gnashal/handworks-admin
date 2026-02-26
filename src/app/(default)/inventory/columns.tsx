import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { IInventoryItem } from "@/types/inventory";
import Image from "next/image";

export const columns: ColumnDef<IInventoryItem>[] = [
  {
    accessorKey: "name",
    header: "Item",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="relative h-10 w-10 shrink-0">
          <Image
            src={row.original.image_url}
            alt={row.original.name}
            fill
            className="object-cover rounded"
            sizes="40px"
          />
        </div>

        <span className="font-medium">{row.original.name}</span>
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => <Badge variant="secondary">{row.original.type}</Badge>,
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => <Badge variant="outline">{row.original.category}</Badge>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;

      if (status === "HIGH") return <Badge>HIGH</Badge>;
      if (status === "LOW") return <Badge variant="secondary">LOW</Badge>;
      if (status === "DANGER")
        return <Badge variant="destructive">DANGER</Badge>;

      return <Badge variant="outline">OUT OF STOCK</Badge>;
    },
  },
  {
    id: "quantity",
    header: "Qty",
    cell: ({ row }) => (
      <span className="font-semibold">
        {row.original.quantity} / {row.original.max_quantity}{" "}
        {row.original.unit}
      </span>
    ),
  },
];
