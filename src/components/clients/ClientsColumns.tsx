import { ColumnDef } from "@tanstack/react-table";
import type { ICustomer } from "@/types/account";

export const clientColumns = (
  watchList: string[],
  setWatchList: React.Dispatch<React.SetStateAction<string[]>>,
): ColumnDef<ICustomer>[] => [
  {
    accessorKey: "id",
    header: "Customer ID",
  },
  {
    id: "name",
    header: "Name",
    cell: ({ row }) => {
      const { first_name, last_name } = row.original.account;
      return `${first_name} ${last_name}`;
    },
  },
  {
    id: "email",
    header: "Email",
    cell: ({ row }) => row.original.account.email,
  },
  {
    id: "watch",
    header: "Watch",
    cell: ({ row }) => {
      const customerId = row.original.id;
      const isWatched = watchList.includes(customerId);

      const toggleWatch = () => {
        if (isWatched) {
          setWatchList((prev) => prev.filter((id) => id !== customerId));
        } else {
          setWatchList((prev) => [...prev, customerId]);
        }
      };

      return (
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWatch();
          }}
          className="text-lg"
        >
          {isWatched ? "⭐" : "☆"}
        </button>
      );
    },
  },
];
