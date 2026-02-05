import { useAdmin } from "@/context/adminContext";
import { fetchAdminDashboardData } from "@/service";
import { useAuth } from "@clerk/nextjs";
import { useState } from "react";
import { toast } from "sonner";

export function useDashboard() {
  const [loading, setLoading] = useState(false);
  const { isLoaded, getToken } = useAuth();
  const { adminId } = useAdmin();

  async function fetchDashboardData(dateFilter: string) {
    if (!isLoaded) {
      setLoading(true);
    }

    const token = await getToken();
    const id = adminId;

    if (!token) {
      toast.error("No active session token found");
      return;
    }
    if (!id) {
      toast.error("No admin Id");
      return;
    }
    try {
      const data = fetchAdminDashboardData(token, id, dateFilter);
      return data;
    } catch (err) {
      toast.error("Failed to fetch admin data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return { fetchDashboardData, loading };
}
