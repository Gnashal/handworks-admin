"use client";

import dynamic from "next/dynamic";
import { MapPinned } from "lucide-react";

import { useBookingMapQuery } from "@/queries/locationQueries";

interface BookingAddressMapProps {
  latitude: number;
  longitude: number;
  address?: string;
}

const BookingAddressMapLeaflet = dynamic(
  () => import("@/components/bookings/bookingAddressMapLeaflet"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-72 items-center justify-center rounded-xl border bg-muted/20 text-sm text-muted-foreground">
        Loading map...
      </div>
    ),
  },
);

export function BookingAddressMap({
  latitude,
  longitude,
  address,
}: BookingAddressMapProps) {
  const hasValidCoordinates =
    Number.isFinite(latitude) && Number.isFinite(longitude);

  const { data, isLoading, isError } = useBookingMapQuery(
    latitude,
    longitude,
    address,
  );

  if (!hasValidCoordinates) {
    return (
      <div className="rounded-xl border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
        This booking does not have valid coordinates for map rendering.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-72 items-center justify-center rounded-xl border bg-muted/20 text-sm text-muted-foreground">
        Loading OpenStreetMap preview...
      </div>
    );
  }

  if (isError || !data) {
    const fallbackUrl = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=15/${latitude}/${longitude}`;

    return (
      <div className="rounded-xl border px-4 py-6 text-sm">
        <p className="font-medium text-foreground">
          OpenStreetMap preview is currently unavailable.
        </p>
        <a
          href={fallbackUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-flex items-center gap-1 text-primary underline-offset-4 hover:underline"
        >
          <MapPinned className="h-4 w-4" />
          Open coordinates in OpenStreetMap
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>OpenStreetMap visualization</span>
        <a
          href={data.openStreetMapUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-primary underline-offset-4 hover:underline"
        >
          <MapPinned className="h-3.5 w-3.5" />
          Open full map
        </a>
      </div>
      <BookingAddressMapLeaflet mapData={data} />
    </div>
  );
}
