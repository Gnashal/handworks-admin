import { useQuery } from "@tanstack/react-query";
import { IBooking } from "@/types/booking";

interface ClientRow {
  custId: string;
  customerFirstName: string;
  customerLastName: string;
}

export const useClientsQuery = () => {
  return useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const res = await fetch("/api/booking/fetchBookings");
      const data = await res.json();

      const bookings: IBooking[] = data?.bookings ?? [];

      const map = new Map<string, ClientRow>();

      bookings.forEach((booking) => {
        const base = booking.base;
        if (!map.has(base.custId)) {
          map.set(base.custId, {
            custId: base.custId,
            customerFirstName: base.customerFirstName,
            customerLastName: base.customerLastName,
          });
        }
      });

      return Array.from(map.values());
    },
  });
};