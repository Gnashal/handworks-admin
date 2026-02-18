import axios, { AxiosRequestConfig } from "axios";
import {
  IAdmin,
  IEmployees,
  IGetEmployee,
  ISignUpAdminRequest,
  ISignUpEmployeeResponse,
} from "@/types/account";
import {
  IAdminDashboardResponse,
  IOnboardEmployeeRequest,
} from "@/types/admin";
import { IBooking, IFetchAllBookingsResponse } from "@/types/booking";
import { IInventoryListResponse } from "@/types/inventory";

const fetchWithAuth = async <T>(
  url: string,
  token: string,
  requestObj?: AxiosRequestConfig,
): Promise<T> => {
  const { data } = await axios(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type":
        requestObj?.headers?.["Content-Type"] || "application/json",
    },
    ...requestObj,
  });
  return data;
};
const fetchPublic = async <T>(
  url: string,
  requestObj?: AxiosRequestConfig,
): Promise<T> => {
  const { data } = await axios(url, {
    headers: {
      "Content-Type":
        requestObj?.headers?.["Content-Type"] || "application/json",
    },
    ...requestObj,
  });
  return data;
};

const signUpAdmin = async (
  clerkId: string,
  email: string,
  firstName: string,
  lastName: string,
  provider: string,
  role: string,
): Promise<IAdmin> => {
  try {
    const body: ISignUpAdminRequest = {
      clerk_id: clerkId,
      email,
      first_name: firstName,
      last_name: lastName,
      provider,
      role,
    };
    const data = await fetchPublic<IAdmin>("/api/signup", {
      method: "POST",
      data: body,
    });

    return data;
  } catch (error) {
    console.error("SignUpAdmin Error:", error);
    throw error;
  }
};

const fetchAdminDashboardData = async (
  token: string,
  adminId: string,
  dateFilter: string,
): Promise<IAdminDashboardResponse> => {
  try {
    const params = new URLSearchParams();
    if (adminId && dateFilter) {
      params.append("adminId", adminId);
      params.append("dateFilter", dateFilter);
    }

    const res = await fetchWithAuth<IAdminDashboardResponse>(
      `/api/fetchDashboardData?${params.toString()}`,
      token,
      { method: "GET" },
    );
    return res;
  } catch (error) {
    console.error("fetchDashboardData Error:", error);
    throw error;
  }
};

const fetchBooking = async (
  token: string,
  bookingId: string,
): Promise<IBooking> => {
  try {
    const params = new URLSearchParams();
    if (bookingId) {
      params.append("bookingId", bookingId);
    }

    const res = await fetchWithAuth<IBooking>(
      `/api/booking/fetchBooking?${params.toString()}`,
      token,
      { method: "GET" },
    );
    return res;
  } catch (error) {
    console.error("fetchBooking Error:", error);
    throw error;
  }
};
const fetchBookings = async (
  token: string,
  startDate: string,
  endDate: string,
  page: number,
  limit: number,
): Promise<IFetchAllBookingsResponse> => {
  try {
    const params = new URLSearchParams();
    if (
      page !== null &&
      limit != null &&
      startDate !== null &&
      endDate != null
    ) {
      params.append("page", page.toString());
      params.append("limit", limit.toString());
      params.append("startDate", startDate);
      params.append("endDate", endDate);
    }

    const res = await fetchWithAuth<IFetchAllBookingsResponse>(
      `/api/booking/fetchBookings?${params.toString()}`,
      token,
      { method: "GET" },
    );
    return res;
  } catch (error) {
    console.error("fetchBookings Error:", error);
    throw error;
  }
};
const fetchInventoryItems = async (
  token: string,
  type: string | null,
  status: string | null,
  category: string | null,
  page = 0,
  limit = 10,
): Promise<IInventoryListResponse> => {
  try {
    const params = new URLSearchParams();
    if (page !== null && limit !== null) {
      params.append("page", page.toString());
      params.append("limit", limit.toString());
    }
    if (type !== null) {
      params.append("type", type);
    }
    if (status !== null) {
      params.append("status", status);
    }
    if (category !== null) {
      params.append("category", category);
    }

    const res = await fetchWithAuth<IInventoryListResponse>(
      `/api/fetchInventory?${params.toString()}`,
      token,
      { method: "GET" },
    );
    return res;
  } catch (error) {
    console.error("fetchInventoryItems Error:", error);
    throw error;
  }
};
const fetchEmployees = async (
  token: string,
  page = 0,
  limit = 10,
): Promise<IEmployees> => {
  try {
    const params = new URLSearchParams();
    if (page !== null && limit !== null) {
      params.append("page", page.toString());
      params.append("limit", limit.toString());
    }

    const res = await fetchWithAuth<IEmployees>(
      `/api/employee/fetchEmployees?${params.toString()}`,
      token,
      { method: "GET" },
    );
    return res;
  } catch (error) {
    console.error("fetchEmployees Error:", error);
    throw error;
  }
};
const fetchEmployee = async (
  token: string,
  employeeId: string,
): Promise<IGetEmployee> => {
  try {
    const params = new URLSearchParams();
    if (employeeId) {
      params.append("employeeId", employeeId);
    }

    const res = await fetchWithAuth<IGetEmployee>(
      `/api/employee/fetchEmployee?${params.toString()}`,
      token,
      { method: "GET" },
    );
    return res;
  } catch (error) {
    console.error("fetchEmployee Error:", error);
    throw error;
  }
};
const fetchEmployeeAssignments = async (
  token: string,
  employeeId: string,
  startDate: string,
  endDate: string,
  page: number,
  limit: number,
): Promise<IFetchAllBookingsResponse> => {
  try {
    const params = new URLSearchParams();
    if (
      employeeId &&
      page !== null &&
      limit != null &&
      startDate !== null &&
      endDate != null
    ) {
      params.append("employeeId", employeeId);
      params.append("page", page.toString());
      params.append("limit", limit.toString());
      params.append("startDate", startDate);
      params.append("endDate", endDate);
    }

    const res = await fetchWithAuth<IFetchAllBookingsResponse>(
      `/api/employee/fetchEmployeeAssignments?${params.toString()}`,
      token,
      { method: "GET" },
    );
    return res;
  } catch (error) {
    console.error("fetchEmployee Error:", error);
    throw error;
  }
};
const onboardEmployee = async (
  token: string,
  payload: IOnboardEmployeeRequest,
): Promise<ISignUpEmployeeResponse> => {
  try {
    const res = await fetchWithAuth<ISignUpEmployeeResponse>(
      "/api/employee/onboard",
      token,
      {
        method: "POST",
        data: payload,
      },
    );
    return res;
  } catch (error) {
    console.error("onboardEmployee Error:", error);
    throw error;
  }
};

export {
  signUpAdmin,
  fetchAdminDashboardData,
  fetchEmployeeAssignments,
  fetchBooking,
  fetchBookings,
  fetchInventoryItems,
  fetchEmployees,
  fetchEmployee,
  onboardEmployee,
};
