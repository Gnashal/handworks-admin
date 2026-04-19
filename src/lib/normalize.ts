import { IMainServiceType } from "@/types/booking";

export function normalizeServiceName(serviceType: IMainServiceType) {
  switch (serviceType) {
    case "GENERAL_CLEANING":
      return "General Cleaning";
    case "COUCH":
      return "Couch Cleaning";
    case "MATTRESS":
      return "Mattress Cleaning";
    case "CAR":
      return "Car Cleaning";
    case "POST":
      return "Post Construction Cleaning";
    default:
      return serviceType;
  }
}

const SERVICE_TYPE_ALIASES: Record<string, IMainServiceType> = {
  GENERAL_CLEANING: "GENERAL_CLEANING",
  GENERAL: "GENERAL_CLEANING",
  COUCH: "COUCH",
  COUCH_CLEANING: "COUCH",
  MATTRESS: "MATTRESS",
  MATTRESS_CLEANING: "MATTRESS",
  CAR: "CAR",
  CAR_CLEANING: "CAR",
  POST: "POST",
  POST_CONSTRUCTION: "POST",
  POST_CONSTRUCTION_CLEANING: "POST",
  SERVICE_TYPE_UNSPECIFIED: "SERVICE_TYPE_UNSPECIFIED",
};

export function normalizeServiceType(
  service: string,
): IMainServiceType | undefined {
  const key = service.trim().toUpperCase().replace(/\s+/g, "_");

  return SERVICE_TYPE_ALIASES[key];
}

export function normalizeServiceNameFromValue(service: string): string {
  const normalizedType = normalizeServiceType(service);

  if (normalizedType) {
    return normalizeServiceName(normalizedType);
  }

  return service;
}

export function normalizeStatus(status: string) {
  return status.trim().replace(/\s+/g, "_").toUpperCase();
}

export function formatMoney(amount: number, currency?: string) {
  const normalizedCurrency = currency?.toUpperCase();

  if (normalizedCurrency && /^[A-Z]{3}$/.test(normalizedCurrency)) {
    try {
      return new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: normalizedCurrency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    } catch {
      // Fallback to peso format when backend sends an invalid currency code.
    }
  }

  return `₱${amount.toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
