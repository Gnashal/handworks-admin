"use client";

import { useAuth } from "@clerk/nextjs";
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationResult,
  UseQueryResult,
} from "@tanstack/react-query";
import { toast } from "sonner";

import {
  assignEmployeeToBooking,
  fetchAvailableCleaners,
  fetchEmployees,
  fetchEmployee,
  fetchEmployeeAssignments,
} from "@/service";
import type { IEmployees, IGetEmployee } from "@/types/account";
import {
  AssignEmployeeAction,
  IAssignEmployeeToBookingResponse,
  IAvailableCleanersResponse,
} from "@/types/admin";
import { IFetchAllBookingsResponse } from "@/types/booking";

export function useEmployeesQuery(
  page: number,
  limit: number,
): UseQueryResult<IEmployees> {
  const { isLoaded, getToken } = useAuth();

  return useQuery({
    queryKey: ["employees", page, limit],
    enabled: isLoaded,
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        toast.error("No active session token found");
        throw new Error("No active session token found");
      }

      try {
        return await fetchEmployees(token, page, limit);
      } catch (err) {
        toast.error("Failed to fetch employees");
        throw err;
      }
    },
  });
}

export function useEmployeeQuery(
  employeeId: string | undefined,
): UseQueryResult<IGetEmployee> {
  const { isLoaded, getToken } = useAuth();

  return useQuery({
    queryKey: ["employee", employeeId],
    enabled: isLoaded && !!employeeId,
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        toast.error("No active session token found");
        throw new Error("No active session token found");
      }

      try {
        return await fetchEmployee(token, employeeId!);
      } catch (err) {
        toast.error("Failed to fetch employee");
        throw err;
      }
    },
  });
}

interface UseEmployeeAssignmentsOptions {
  employeeId?: string;
  startDate?: string;
  endDate?: string;
  page: number;
  limit: number;
}

export function useEmployeeAssignmentsQuery(
  options: UseEmployeeAssignmentsOptions,
): UseQueryResult<IFetchAllBookingsResponse> {
  const { employeeId, startDate, endDate, page, limit } = options;
  const { isLoaded, getToken } = useAuth();

  const enabled =
    isLoaded &&
    !!employeeId &&
    !!startDate &&
    !!endDate &&
    page !== undefined &&
    limit !== undefined;

  return useQuery({
    queryKey: [
      "employee-assignments",
      employeeId,
      startDate,
      endDate,
      page,
      limit,
    ],
    enabled,
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        toast.error("No active session token found");
        throw new Error("No active session token found");
      }
      if (!employeeId) {
        toast.error("No employee Id");
        throw new Error("No employee Id");
      }
      if (!startDate || !endDate) {
        toast.error("Start and end dates are required");
        throw new Error("Start and end dates are required");
      }

      try {
        return await fetchEmployeeAssignments(
          token,
          employeeId,
          startDate,
          endDate,
          page,
          limit,
        );
      } catch (err) {
        toast.error("Failed to fetch employee assignments");
        throw err;
      }
    },
  });
}

export function useAvailableCleanersQuery(
  bookingId: string | undefined,
): UseQueryResult<IAvailableCleanersResponse> {
  const { isLoaded, getToken } = useAuth();

  return useQuery({
    queryKey: ["available-cleaners", bookingId],
    enabled: isLoaded && !!bookingId,
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        toast.error("No active session token found");
        throw new Error("No active session token found");
      }
      if (!bookingId) {
        toast.error("No booking Id");
        throw new Error("No booking Id");
      }

      try {
        return await fetchAvailableCleaners(token, bookingId);
      } catch (err) {
        toast.error("Failed to fetch available cleaners");
        throw err;
      }
    },
  });
}

interface IAssignEmployeeToBookingMutationInput {
  bookingId: string;
  employeeId: string;
  action: AssignEmployeeAction;
}

export function useAssignEmployeeToBookingMutation(): UseMutationResult<
  IAssignEmployeeToBookingResponse,
  Error,
  IAssignEmployeeToBookingMutationInput
> {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bookingId, employeeId, action }) => {
      const token = await getToken();
      if (!token) {
        toast.error("No active session token found");
        throw new Error("No active session token found");
      }

      return assignEmployeeToBooking(token, bookingId, employeeId, action);
    },
    onSuccess: async (_data, variables) => {
      toast.success(
        variables.action === "ADD"
          ? "Employee assigned successfully"
          : "Employee removed successfully",
      );

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["available-cleaners", variables.bookingId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["booking", variables.bookingId],
        }),
        queryClient.invalidateQueries({ queryKey: ["bookings"] }),
        queryClient.invalidateQueries({ queryKey: ["bookingsToday"] }),
        queryClient.invalidateQueries({ queryKey: ["calendarBookings"] }),
        queryClient.invalidateQueries({ queryKey: ["employee-assignments"] }),
      ]);
    },
    onError: (_error, variables) => {
      toast.error(
        variables.action === "ADD"
          ? "Failed to assign employee"
          : "Failed to remove employee",
      );
    },
  });
}
