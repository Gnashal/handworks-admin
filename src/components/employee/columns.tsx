import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { IEmployee } from "@/types/account";
import { Star } from "lucide-react";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < Math.round(rating);
        return (
          <Star
            key={i}
            className={`h-4 w-4 ${
              filled ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
          />
        );
      })}
      <span className="text-xs text-muted-foreground ml-1">
        ({rating.toFixed(1)})
      </span>
    </div>
  );
}

export const columns: ColumnDef<IEmployee>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    id: "name",
    header: "Name",
    cell: ({ row }) => {
      const { firstName, lastName } = row.original.account;
      return (
        <span className="font-medium">
          {firstName} {lastName}
        </span>
      );
    },
  },
  {
    accessorKey: "hire_date",
    header: "Hire Date",
    cell: ({ row }) => {
      const date = new Date(row.original.hire_date);
      return date.toLocaleDateString();
    },
  },
  {
    accessorKey: "performance_score",
    header: "Rating",
    cell: ({ row }) => <StarRating rating={row.original.performance_score} />,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;

      if (status === "ACTIVE") return <Badge>Active</Badge>;

      if (status === "INACTIVE")
        return <Badge variant="secondary">Inactive</Badge>;

      return <Badge variant="destructive">Suspended</Badge>;
    },
  },
];
