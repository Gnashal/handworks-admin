"use client";

import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

import type { IBookingMapResponse } from "@/types/location";

interface BookingAddressMapLeafletProps {
  mapData: IBookingMapResponse;
}

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function BookingAddressMapLeaflet({
  mapData,
}: BookingAddressMapLeafletProps) {
  const position: [number, number] = [mapData.latitude, mapData.longitude];

  return (
    <div className="overflow-hidden rounded-xl border">
      <MapContainer
        center={position}
        zoom={mapData.zoom}
        scrollWheelZoom
        className="z-0 h-72 w-full"
      >
        <TileLayer attribution={mapData.attribution} url={mapData.tileUrl} />
        <Marker position={position} icon={markerIcon}>
          <Popup>{mapData.markerLabel}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
