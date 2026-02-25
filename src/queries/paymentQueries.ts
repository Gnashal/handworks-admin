"use client";

import { useAuth } from "@clerk/nextjs";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { toast } from "sonner";

import { fetchQuotes } from "@/service";
import type { IFetchAllQuotesResponse } from "@/types/payment";

export function useQuotesQuery(
  startDate: string,
  endDate: string,
  page: number,
  limit: number,
): UseQueryResult<IFetchAllQuotesResponse> {
  const { isLoaded, getToken } = useAuth();

  return useQuery({
    queryKey: ["quotes", startDate, endDate, page, limit],
    enabled: isLoaded && !!startDate && !!endDate,
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        toast.error("No active session token found");
        throw new Error("No active session token found");
      }

      try {
        const res = await fetchQuotes(token, startDate, endDate, page, limit);
        return res;
      } catch (err) {
        toast.error("Failed to fetch quotes data");
        throw err;
      }
    },
  });
}
