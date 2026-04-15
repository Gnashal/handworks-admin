export interface IBookingMapRequest {
  latitude: number;
  longitude: number;
  address?: string;
  zoom?: number;
}

export interface IBookingMapResponse {
  latitude: number;
  longitude: number;
  markerLabel: string;
  tileUrl: string;
  attribution: string;
  zoom: number;
  openStreetMapUrl: string;
}
