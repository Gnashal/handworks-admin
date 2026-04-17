import {
  fetchCustomer,
  fetchCustomerBookings,
  fetchCustomers,
} from "@/service";
import { ICustomers, IGetCustomer } from "@/types/account";
import { IFetchAllBookingsResponse } from "@/types/booking";
import { useAuth } from "@clerk/nextjs";
import { endOfMonth, startOfMonth } from "date-fns";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { toast } from "sonner";

export function useCustomersQuery(
  page: number,
  limit: number,
): UseQueryResult<ICustomers> {
  const { isLoaded, getToken } = useAuth();

  return useQuery({
    queryKey: ["customers", page, limit],
    enabled: isLoaded,
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        toast.error("No active session token found");
        throw new Error("No active session token found");
      }

      try {
        return await fetchCustomers(token, page, limit);
      } catch (err) {
        toast.error("Failed to fetch customers");
        throw err;
      }
    },
  });
}
export function useCustomerQuery(
  customerId: string,
): UseQueryResult<IGetCustomer> {
  const { isLoaded, getToken } = useAuth();

  return useQuery({
    queryKey: ["customer", customerId],
    enabled: isLoaded && !!customerId,
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        toast.error("No active session token found");
        throw new Error("No active session token found");
      }

      try {
        return await fetchCustomer(token, customerId);
      } catch (err) {
        toast.error("Failed to fetch customer data");
        throw err;
      }
    },
  });
}

interface UseCustomerBookingsOptions {
  customerId?: string;
  startDate?: string;
  endDate?: string;
  page: number;
  limit: number;
}

export function useCustomerBookingsQuery(
  options: UseCustomerBookingsOptions,
): UseQueryResult<IFetchAllBookingsResponse> {
  const { isLoaded, getToken } = useAuth();
  const now = new Date();
  const resolvedStartDate =
    options.startDate ?? startOfMonth(now).toISOString();
  const resolvedEndDate = options.endDate ?? endOfMonth(now).toISOString();

  return useQuery({
    queryKey: [
      "customerBookings",
      options.customerId,
      options.page,
      options.limit,
      resolvedStartDate,
      resolvedEndDate,
    ],
    enabled: isLoaded && !!options.customerId,
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        toast.error("No active session token found");
        throw new Error("No active session token found");
      }
      if (!options.customerId) {
        toast.error("No customer Id");
        throw new Error("No customer Id");
      }

      try {
        return await fetchCustomerBookings(
          token,
          options.customerId,
          resolvedStartDate,
          resolvedEndDate,
          options.page,
          options.limit,
        );
      } catch (err) {
        toast.error("Failed to fetch customer bookings");
        throw err;
      }
    },
  });
}
