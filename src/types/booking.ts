export interface IBookingAllocation {
  cleaningAllocation?: ICleaningAllocation | null;
  cleanerAssigned: ICleanerAssigned[];
  cleaningPrices?: ICleaningPrices | null;
}

export interface ICleaningAllocation {
  cleaningEquipment: ICleaningEquipment[];
  cleaningResources: ICleaningResources[];
}

export interface ICleaningEquipment {
  id: string;
  name: string;
  type: string;
  photoUrl: string;
}

export interface ICleaningResources {
  id: string;
  name: string;
  type: string;
  photoUrl: string;
}

export interface ICleanerAssigned {
  id: string;
  cleanerFirstName: string;
  cleanerLastName: string;
  pfpUrl: string;
}

export interface IAddonCleaningPrice {
  addonName: string;
  addonPrice: number;
}

export interface ICleaningPrices {
  mainServicePrice: number;
  addonPrices: IAddonCleaningPrice[];
}

export interface IServiceDetail {
  general?: IGeneralCleaningDetails | null;
  couch?: ICouchCleaningDetails | null;
  mattress?: IMattressCleaningDetails | null;
  car?: ICarCleaningDetails | null;
  post?: IPostConstructionDetails | null;
}

export interface IServiceDetails {
  id: string;
  serviceType: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details: any;
}

export type IDetailType =
  | "GENERAL_CLEANING"
  | "COUCH"
  | "MATTRESS"
  | "CAR"
  | "POST";

export interface IGeneralCleaningDetails {
  homeType: string;
  sqm: number;
}

export interface ICouchCleaningSpecifications {
  couchType: string;
  widthCm: number;
  depthCm: number;
  heightCm: number;
  quantity: number;
}

export interface ICouchCleaningDetails {
  cleaningSpecs: ICouchCleaningSpecifications[];
  bedPillows: number;
}

export interface IMattressCleaningSpecifications {
  bedType: string;
  widthCm: number;
  depthCm: number;
  heightCm: number;
  quantity: number;
}

export interface IMattressCleaningDetails {
  cleaningSpecs: IMattressCleaningSpecifications[];
}

export interface ICarCleaningSpecifications {
  carType: string;
  quantity: number;
}

export interface ICarCleaningDetails {
  cleaningSpecs: ICarCleaningSpecifications[];
  childSeats: number;
}

export interface IPostConstructionDetails {
  sqm: number;
}

export interface IBaseBookingDetails {
  id: string;
  custId: string;
  customerFirstName: string;
  customerLastName: string;
  address: IAddress;
  startSched: string;
  endSched: string;
  dirtyScale: number;
  paymentStatus: string;
  reviewStatus: string;
  photos: string[];
  createdAt: string;
  updatedAt: string;
  quoteId: string;
}

export interface IBaseBookingDetailsRequest {
  custId: string;
  customerFirstName: string;
  customerLastName: string;
  address: IAddress;
  startSched: string;
  endSched: string;
  dirtyScale: number;
  photos: string[];
  createdAt: string;
  updatedAt?: string;
  quoteId: string;
}

export interface IAddress {
  addressHuman: string;
  addressLat: number;
  addressLng: number;
}

export interface IBookingReply {
  source: string;
  equipments: ICleaningEquipment[];
  resources: ICleaningResources[];
  cleaners: ICleanerAssigned[];
  prices: ICleaningPrices;
  error?: string;
}

export type IMainServiceType =
  | "SERVICE_TYPE_UNSPECIFIED"
  | "GENERAL_CLEANING"
  | "COUCH"
  | "MATTRESS"
  | "CAR"
  | "POST";

export interface IServicesRequest {
  serviceType: IMainServiceType;
  details: IServiceDetail;
}

export interface IAddOnRequest {
  serviceDetail: IServicesRequest;
}

export interface ICreateBookingRequest {
  accountId: string;
  base: IBaseBookingDetailsRequest;
  mainService: IServicesRequest;
  addons: IAddOnRequest[];
}

export interface IAddOns {
  id: string;
  serviceDetail: IServiceDetails;
  price: number;
}

export interface IBooking {
  id: string;
  base: IBaseBookingDetails;
  mainService: IServiceDetails;
  addons?: IAddOns[];
  equipments: ICleaningEquipment[];
  resources: ICleaningResources[];
  cleaners: ICleanerAssigned[];
  totalPrice: number;
}

export interface IFetchAllBookingsResponse {
  data: {
    totalBookings: number;
    bookingsRequested: number;
    bookings: IBooking[];
  };
  status: string;
}
