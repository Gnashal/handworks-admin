import {
  IGeneralCleaningDetails,
  ICouchCleaningDetails,
  IMattressCleaningDetails,
  ICarCleaningDetails,
  IPostConstructionDetails,
  IMainServiceType,
  IServiceDetails,
  IAddOns,
} from "@/types/booking";

export type IServiceDetailConcrete =
  | IGeneralCleaningDetails
  | ICouchCleaningDetails
  | IMattressCleaningDetails
  | ICarCleaningDetails
  | IPostConstructionDetails;
export interface ITypedServiceDetails<T extends IServiceDetailConcrete> {
  id: string;
  serviceType: IMainServiceType;
  details: T;
}
export interface ITypedAddon<T extends IServiceDetailConcrete> {
  id: string;
  serviceType: IMainServiceType;
  details: T;
  price: number;
}

const detailFactories: Record<IMainServiceType, () => IServiceDetailConcrete> =
  {
    SERVICE_TYPE_UNSPECIFIED: () => ({}) as IGeneralCleaningDetails,
    GENERAL_CLEANING: () => ({
      homeType: "",
      sqm: 0,
    }),
    COUCH: () => ({
      cleaningSpecs: [],
      bedPillows: 0,
    }),
    MATTRESS: () => ({
      cleaningSpecs: [],
    }),
    CAR: () => ({
      cleaningSpecs: [],
      childSeats: 0,
    }),
    POST: () => ({
      sqm: 0,
    }),
  };

export function mapServiceDetails<T extends IServiceDetailConcrete>(
  serviceType: IMainServiceType,
  raw: IServiceDetails,
): ITypedServiceDetails<T> {
  const factory = detailFactories[serviceType];

  if (!factory) {
    throw new Error(`Unknown service type: ${serviceType}`);
  }

  const base = factory();

  return {
    id: raw.id,
    serviceType,
    details: {
      ...base,
      ...(raw.details as object),
    } as T,
  };
}
export function mapAddonDetails<T extends IServiceDetailConcrete>(
  addon: IAddOns,
): ITypedAddon<T> {
  const mapped = mapServiceDetails<T>(
    addon.serviceDetail.serviceType as IMainServiceType,
    addon.serviceDetail,
  );

  return {
    ...mapped,
    price: addon.price,
  };
}
