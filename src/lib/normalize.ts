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
