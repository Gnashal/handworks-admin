"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/dataTable";
import { Button } from "@/components/ui/button";

import { clientColumns } from "./columns";
import { useBookingsQuery } from "@/queries/bookingQueries";
import type { IBooking } from "@/types/booking";

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

  React.useEffect(() => {
    localStorage.setItem("watchList", JSON.stringify(watchList));
  }, [watchList]);

  const { data, isLoading } = useBookingsQuery("", "", 0, 1000);

  const bookings: IBooking[] = data?.bookings ?? [];

  const allClients = React.useMemo(() => {
    const map = new Map();

    bookings.forEach((booking) => {
      const custId = booking.base.custId;

      if (!map.has(custId)) {
        map.set(custId, {
          custId,
          firstName: booking.base.customerFirstName,
          lastName: booking.base.customerLastName,
        });
      }
    });

    return Array.from(map.values());
  }, [bookings]);

  const clients = showWatchedOnly
    ? allClients.filter((c) => watchList.includes(c.custId))
    : allClients;

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
        <DataTable
          columns={clientColumns(watchList, setWatchList)}
          data={clients}
          onRowClick={(row) =>
            router.push(`/clients/${row.custId}`)
          }
        />
      )}
    </div>
  );
}