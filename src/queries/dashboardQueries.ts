"use client";

import { useAuth } from "@clerk/nextjs";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { toast } from "sonner";

import { useAdmin } from "@/context/adminContext";
import { fetchAdminDashboardData } from "@/service";
import type { IAdminDashboardResponse } from "@/types/admin";

export function useDashboardQuery(
  dateFilter: string,
): UseQueryResult<IAdminDashboardResponse> {
  const { isLoaded, getToken } = useAuth();
  const { adminId } = useAdmin();

  return useQuery({
    queryKey: ["dashboard", adminId, dateFilter],
    enabled: isLoaded && !!adminId && !!dateFilter,
    queryFn: async () => {
      const token = await getToken();
      const id = adminId;

      if (!token) {
        toast.error("No active session token found");
        throw new Error("No active session token found");
      }
      if (!id) {
        toast.error("No admin Id");
        throw new Error("No admin Id");
      }

      try {
        return await fetchAdminDashboardData(token, id, dateFilter);
      } catch (err) {
        toast.error("Failed to fetch admin data");
        throw err;
      }
    },
  });
}
