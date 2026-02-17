"use client";

import { useAuth } from "@clerk/nextjs";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { toast } from "sonner";

import { fetchInventoryItems } from "@/service";
import type { IInventoryListResponse } from "@/types/inventory";

export function useInventoryQuery(
  page: number,
  limit: number,
  type?: string,
  status?: string,
  category?: string,
): UseQueryResult<IInventoryListResponse> {
  const { isLoaded, getToken } = useAuth();

  return useQuery({
    queryKey: ["inventory", page, limit, type, status, category],
    enabled: isLoaded,
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        toast.error("No active session token found");
        throw new Error("No active session token found");
      }

      try {
        return await fetchInventoryItems(
          token,
          type || null,
          status || null,
          category || null,
          page,
          limit,
        );
      } catch (err) {
        toast.error("Failed to fetch inventory items");
        throw err;
      }
    },
  });
}
