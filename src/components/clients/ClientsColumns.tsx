import type * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye, Mail, Star, UserRound } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import type { ICustomer } from "@/types/account";

function getFullName(customer: ICustomer) {
  const firstName = customer.account.first_name?.trim() ?? "";
  const lastName = customer.account.last_name?.trim() ?? "";
  const fullName = `${firstName} ${lastName}`.trim();

  return fullName || "Unnamed Client";
}

function getInitials(customer: ICustomer) {
  const firstInitial = customer.account.first_name?.charAt(0) ?? "";
  const lastInitial = customer.account.last_name?.charAt(0) ?? "";
  const initials = `${firstInitial}${lastInitial}`.toUpperCase();

  return initials || "C";
}

function formatRole(role?: string) {
  if (!role) return "Customer";

  return role
    .replace(/^org:/, "")
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export const clientColumns = (
  watchList: string[],
  setWatchList: React.Dispatch<React.SetStateAction<string[]>>,
  onViewClient?: (customer: ICustomer) => void,
): ColumnDef<ICustomer>[] => [
  {
    id: "client",
    header: "Client",
    accessorFn: (row) =>
      `${row.account.first_name} ${row.account.last_name}`.trim(),
    cell: ({ row }) => {
      const customer = row.original;

      return (
        <div className="flex min-w-64 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-sm font-semibold text-slate-700 ring-1 ring-slate-200">
            {getInitials(customer)}
          </div>

          <div className="min-w-0">
            <p className="truncate font-semibold text-slate-950">
              {getFullName(customer)}
            </p>

            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
              <UserRound className="h-3 w-3" />
              Customer profile
            </p>
          </div>
        </div>
      );
    },
  },
  {
    id: "email",
    header: "Email",
    accessorFn: (row) => row.account.email,
    cell: ({ row }) => (
      <div className="flex min-w-56 items-center gap-2 text-sm text-slate-700">
        <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
        <span className="truncate">{row.original.account.email}</span>
      </div>
    ),
  },
  {
    accessorKey: "id",
    header: "Customer ID",
    cell: ({ row }) => (
      <span
        title={row.original.id}
        className="block max-w-72 truncate font-mono text-xs text-slate-600"
      >
        {row.original.id}
      </span>
    ),
  },
  {
    id: "accountType",
    header: "Account",
    accessorFn: (row) => row.account.role,
    cell: ({ row }) => (
      <Badge variant="outline" className="bg-slate-50">
        {formatRole(row.original.account.role)}
      </Badge>
    ),
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
          return;
        }

        setWatchList((prev) => [...prev, customerId]);
      };

      return (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          aria-label={isWatched ? "Remove from watchlist" : "Add to watchlist"}
          aria-pressed={isWatched}
          title={isWatched ? "Remove from watchlist" : "Add to watchlist"}
          onClick={(event) => {
            event.stopPropagation();
            toggleWatch();
          }}
          className={
            isWatched
              ? "h-8 w-8 rounded-full bg-amber-50 p-0 text-amber-600 hover:bg-amber-100 hover:text-amber-700"
              : "h-8 w-8 rounded-full p-0 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          }
        >
          <Star
            className={
              isWatched
                ? "h-4 w-4 fill-amber-400 text-amber-500"
                : "h-4 w-4"
            }
          />
        </Button>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={(event) => {
          event.stopPropagation();
          onViewClient?.(row.original);
        }}
        className="bg-white"
      >
        <Eye className="h-4 w-4" />
        View
      </Button>
    ),
  },
];