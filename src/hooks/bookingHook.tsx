import { approveBooking } from "@/service";
import { useAuth } from "@clerk/nextjs";
import { useState } from "react";
import { toast } from "sonner";
export default function useBooking() {
  const [loading, setIsLoading] = useState(false);
  const { getToken } = useAuth();

  const handleApproveBooking = async (bookingId: string) => {
    const token = await getToken();
    if (!token) {
      toast.error("Not authenticated.");
      return;
    }
    try {
      setIsLoading(true);
      const res = await approveBooking(token, bookingId);
      return res;
    } catch (err) {
      console.error("Failed to accept booking:", err);
      toast.error("Failed to accept booking.");
    } finally {
      setIsLoading(false);
    }
  };
  return { handleApproveBooking, loading };
}
