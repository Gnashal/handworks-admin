"use client";

import { useAuth } from "@clerk/nextjs";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { toast } from "sonner";

import { fetchInventoryItems } from "@/service";
import type { IInventoryItem } from "@/types/inventory";

export function useInventoryQuery(
  page: number,
  limit: number,
): UseQueryResult<IInventoryItem> {
  const { isLoaded, getToken } = useAuth();

  return useQuery({
    queryKey: ["inventory", page, limit],
    enabled: isLoaded,
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        toast.error("No active session token found");
        throw new Error("No active session token found");
      }

      try {
        return await fetchInventoryItems(token, page, limit);
      } catch (err) {
        toast.error("Failed to fetch inventory items");
        throw err;
      }
    },
  });
}
