"use client";

import { useAuth } from "@clerk/nextjs";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { toast } from "sonner";

import { fetchBooking } from "@/service";
import type { IBooking } from "@/types/booking";

export function useBookingDetailsQuery(
  bookingId: string | undefined,
): UseQueryResult<IBooking> {
  const { isLoaded, getToken } = useAuth();

  return useQuery({
    queryKey: ["booking", bookingId],
    enabled: isLoaded && !!bookingId,
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        toast.error("No active session token found");
        throw new Error("No active session token found");
      }
      if (!bookingId) {
        toast.error("No booking Id");
        throw new Error("No booking Id");
      }

      try {
        return await fetchBooking(token, bookingId);
      } catch (err) {
        toast.error("Failed to fetch booking data");
        throw err;
      }
    },
  });
}
