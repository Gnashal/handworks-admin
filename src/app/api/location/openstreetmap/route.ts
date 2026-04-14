import { NextRequest, NextResponse } from "next/server";

import type { IBookingMapRequest, IBookingMapResponse } from "@/types/location";

const OSM_TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const OSM_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const isValidLatitude = (latitude: number) =>
  Number.isFinite(latitude) && latitude >= -90 && latitude <= 90;

const isValidLongitude = (longitude: number) =>
  Number.isFinite(longitude) && longitude >= -180 && longitude <= 180;

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<IBookingMapRequest>;
    const latitude = Number(body.latitude);
    const longitude = Number(body.longitude);
    const zoom =
      Number.isFinite(body.zoom) && body.zoom
        ? Math.max(3, Math.min(18, Math.round(body.zoom)))
        : 15;

    if (!isValidLatitude(latitude) || !isValidLongitude(longitude)) {
      return NextResponse.json(
        { error: "Invalid coordinates provided" },
        { status: 400 },
      );
    }

    const markerLabel = body.address?.trim() || "Customer address";
    const openStreetMapUrl = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=${zoom}/${latitude}/${longitude}`;

    const response: IBookingMapResponse = {
      latitude,
      longitude,
      markerLabel,
      tileUrl: OSM_TILE_URL,
      attribution: OSM_ATTRIBUTION,
      zoom,
      openStreetMapUrl,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (err: unknown) {
    console.error("Failed to prepare OpenStreetMap data", err);
    return NextResponse.json(
      { error: "Failed to prepare OpenStreetMap data" },
      { status: 500 },
    );
  }
}
