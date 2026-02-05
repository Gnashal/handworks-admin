"use client";

import { useRouter } from "next/navigation";
import { DataTable } from "@/components/bookings/bookingTable";
import { bookingColumns } from "@/components/bookings/columns";
import { mockBookings } from "@/data/mockBookings";
import { Button } from "@/components/ui/button";
import type { IBooking } from "@/types/booking";

export default function BookingsPage() {
  const router = useRouter();

  return (
    <div className="block w-full h-screen p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Bookings</h2>
        <Button disabled>Create Booking</Button>
      </div>

      <DataTable<IBooking, unknown>
        columns={bookingColumns}
        data={mockBookings.bookings}
        onRowClick={(booking) => {
          router.push(`/bookings/${booking.id}`);
        }}
        getStartDate={(booking) =>
          booking.base.startSched ? new Date(booking.base.startSched) : null
        }
        getEndDate={(booking) =>
          booking.base.endSched ? new Date(booking.base.endSched) : null
        }
      />
    </div>
  );
}
