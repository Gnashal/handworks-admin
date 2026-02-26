"use client";

import { useEffect, useState } from "react";
import { IFetchAllBookingsResponse, IBooking } from "@/types/booking";
import { useRouter } from "next/navigation";

interface Client {
  custId: string;
  fullName: string;
}

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [watchList, setWatchList] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchClients();
    loadWatchList();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await fetch("/api/booking/fetchBookings");
      const data: IFetchAllBookingsResponse = await res.json();

      const uniqueMap = new Map<string, Client>();

      data.bookings.forEach((booking: IBooking) => {
        const { custId, customerFirstName, customerLastName } = booking.base;

        if (!uniqueMap.has(custId)) {
          uniqueMap.set(custId, {
            custId,
            fullName: `${customerFirstName} ${customerLastName}`,
          });
        }
      });

      setClients(Array.from(uniqueMap.values()));
    } catch (err) {
      console.error("Failed to fetch clients", err);
    }
  };

  const loadWatchList = () => {
    const stored = localStorage.getItem("watchList");
    if (stored) {
      setWatchList(JSON.parse(stored));
    }
  };

  const toggleWatch = (custId: string) => {
    let updated: string[];

    if (watchList.includes(custId)) {
      updated = watchList.filter((id) => id !== custId);
    } else {
      updated = [...watchList, custId];
    }

    setWatchList(updated);
    localStorage.setItem("watchList", JSON.stringify(updated));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Clients</h1>

      <div className="space-y-4">
        {clients.map((client) => (
          <div
            key={client.custId}
            className="flex justify-between items-center p-4 border rounded-lg shadow-sm"
          >
            <div>
              <p className="font-semibold">{client.fullName}</p>
              {watchList.includes(client.custId) && (
                <span className="text-red-500 text-sm">🔴 On Watch List</span>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => router.push(`/clients/${client.custId}`)}
                className="px-3 py-1 bg-blue-600 text-white rounded"
              >
                View History
              </button>

              <button
                onClick={() => toggleWatch(client.custId)}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                {watchList.includes(client.custId)
                  ? "Remove Watch"
                  : "Add Watch"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}