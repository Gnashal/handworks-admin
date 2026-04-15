"use client";

import { useAuth } from "@clerk/nextjs";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { toast } from "sonner";

import { fetchBookingMapData } from "@/service";
import type { IBookingMapResponse } from "@/types/location";

export function useBookingMapQuery(
  latitude: number,
  longitude: number,
  address?: string,
): UseQueryResult<IBookingMapResponse> {
  const { isLoaded, getToken } = useAuth();
  const hasValidCoordinates =
    Number.isFinite(latitude) && Number.isFinite(longitude);

  return useQuery({
    queryKey: ["bookingMap", latitude, longitude, address],
    enabled: isLoaded && hasValidCoordinates,
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        toast.error("No active session token found");
        throw new Error("No active session token found");
      }

      try {
        return await fetchBookingMapData(token, latitude, longitude, address);
      } catch (err) {
        toast.error("Failed to fetch OpenStreetMap data");
        throw err;
      }
    },
  });
}
