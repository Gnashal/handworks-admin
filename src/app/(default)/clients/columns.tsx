import { ColumnDef } from "@tanstack/react-table";

interface ClientRow {
  custId: string;
  firstName: string;
  lastName: string;
}

export const clientColumns = (
  watchList: string[],
  setWatchList: React.Dispatch<React.SetStateAction<string[]>>
): ColumnDef<ClientRow>[] => [
  {
    accessorKey: "custId",
    header: "Customer ID",
  },
  {
    accessorKey: "firstName",
    header: "First Name",
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
  },
  {
    id: "watch",
    header: "Watch",
    cell: ({ row }) => {
      const custId = row.original.custId;
      const isWatched = watchList.includes(custId);

      const toggleWatch = () => {
        if (isWatched) {
          setWatchList((prev) =>
            prev.filter((id) => id !== custId)
          );
        } else {
          setWatchList((prev) => [...prev, custId]);
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