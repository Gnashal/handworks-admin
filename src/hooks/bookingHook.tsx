import { fetchBooking } from "@/service";
import { useAuth } from "@clerk/nextjs";
import { useState } from "react";
import { toast } from "sonner";

export function useBookingDetails() {
  const [loading, setLoading] = useState(false);
  const { isLoaded, getToken } = useAuth();

  async function fetchBookingData(bookingId: string) {
    if (!isLoaded) {
      setLoading(true);
    }

    const token = await getToken();

    if (!token) {
      toast.error("No active session token found");
      return;
    }
    if (!bookingId) {
      toast.error("No booking Id");
      return;
    }
    try {
      const data = fetchBooking(token, bookingId);
      return data;
    } catch (err) {
      toast.error("Failed to fetch booking data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
  return { loading, fetchBookingData };
}
