"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/dataTable";
import { Button } from "@/components/ui/button";
import { DataTableSkeleton } from "@/components/dataTableSkeleton";

import { clientColumns } from "@/components/clients/ClientsColumns";
import { useCustomersQuery } from "@/queries/customerQueries";
import type { ICustomer } from "@/types/account";

export default function ClientsPage() {
  const router = useRouter();

  const [watchList, setWatchList] = React.useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("watchList");
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });
  const [showWatchedOnly, setShowWatchedOnly] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [limit, setLimit] = React.useState(10);

  React.useEffect(() => {
    localStorage.setItem("watchList", JSON.stringify(watchList));
  }, [watchList]);

  const { data, isLoading } = useCustomersQuery(page, limit);

  const allClients = React.useMemo(() => {
    return data?.customers ?? [];
  }, [data?.customers]);

  const clients = showWatchedOnly
    ? allClients.filter((c) => watchList.includes(c.id))
    : allClients;

  if (isLoading) {
    return (
      <div className="w-full h-screen p-6 space-y-4">
        <DataTableSkeleton columnCount={4} rowCount={10} />
      </div>
    );
  }

  return (
    <div className="block w-full h-screen p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Clients</h2>

        <Button
          variant="outline"
          onClick={() => setShowWatchedOnly((prev) => !prev)}
        >
          {showWatchedOnly ? "Show All Clients" : "Show Watched Only"}
        </Button>
      </div>

      {/* Empty State */}
      {!isLoading && clients.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg font-medium">No clients found.</p>
          <p className="text-sm">
            Clients will appear once bookings are created.
          </p>
        </div>
      )}

      {clients.length > 0 && (
        <DataTable<ICustomer, unknown>
          columns={clientColumns(watchList, setWatchList)}
          data={clients}
          onRowClick={(row) => router.push(`/clients/${row.id}`)}
          onPaginationChange={(pageIndex, pageSize) => {
            setPage(pageIndex);
            setLimit(pageSize);
          }}
        />
      )}
    </div>
  );
}
