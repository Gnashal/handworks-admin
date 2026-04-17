import axios, { AxiosRequestConfig } from "axios";
import {
  IAdmin,
  ICustomers,
  IEmployees,
  IGetCustomer,
  IGetEmployee,
  ISignUpAdminRequest,
  ISignUpEmployeeResponse,
} from "@/types/account";
import {
  IAdminDashboardResponse,
  IOnboardEmployeeRequest,
} from "@/types/admin";
import {
  IAcceptBookingResponse,
  IAssignEquipmentToBookingRequest,
  IAssignInventoryResponse,
  IAssignResourcesToBookingRequest,
  IBooking,
  IBookingsTodayResponse,
  ICalendarBookingResponse,
  IFetchAllBookingsResponse,
  IItemQuantity,
} from "@/types/booking";
import {
  ICreateItemRequest,
  IInventoryItem,
  IInventoryListResponse,
} from "@/types/inventory";
import { IBookingMapRequest, IBookingMapResponse } from "@/types/location";
import { IFetchAllQuotesResponse, IOrder } from "@/types/payment";

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
      `/api/inventory/fetchInventory?${params.toString()}`,
      token,
      { method: "GET" },
    );
    return res;
  } catch (error) {
    console.error("fetchInventoryItems Error:", error);
    throw error;
  }
};
const fetchCustomers = async (
  token: string,
  page = 0,
  limit = 10,
): Promise<ICustomers> => {
  try {
    const params = new URLSearchParams();
    if (page !== null && limit !== null) {
      params.append("page", page.toString());
      params.append("limit", limit.toString());
    }

    const res = await fetchWithAuth<ICustomers>(
      `/api/customer/fetchCustomers?${params.toString()}`,
      token,
      { method: "GET" },
    );
    return res;
  } catch (error) {
    console.error("fetchCustomers Error:", error);
    throw error;
  }
};
const fetchCustomer = async (
  token: string,
  customerId: string,
): Promise<IGetCustomer> => {
  try {
    const params = new URLSearchParams();
    if (customerId) {
      params.append("customerId", customerId);
    }

    const res = await fetchWithAuth<IGetCustomer>(
      `/api/customer/fetchCustomer?${params.toString()}`,
      token,
      { method: "GET" },
    );
    return res;
  } catch (error) {
    console.error("fetchCustomer Error:", error);
    throw error;
  }
};
const fetchCustomerBookings = async (
  token: string,
  customerId: string,
  startDate: string,
  endDate: string,
  page: number,
  limit: number,
): Promise<IFetchAllBookingsResponse> => {
  try {
    const params = new URLSearchParams();
    if (
      customerId &&
      page !== null &&
      limit != null &&
      startDate !== null &&
      endDate != null
    ) {
      params.append("customerId", customerId);
      params.append("page", page.toString());
      params.append("limit", limit.toString());
      params.append("startDate", startDate);
      params.append("endDate", endDate);
    }

    const res = await fetchWithAuth<IFetchAllBookingsResponse>(
      `/api/customer/fetchCustomerBookings?${params.toString()}`,
      token,
      { method: "GET" },
    );
    return res;
  } catch (error) {
    console.error("fetchCustomerBookings Error:", error);
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
    console.error("fetchCustomerBookings Error:", error);
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
const approveBooking = async (
  token: string,
  bookingId: string,
): Promise<IAcceptBookingResponse> => {
  try {
    const params = new URLSearchParams();
    if (bookingId) {
      params.append("bookingId", bookingId);
    }

    const res = await fetchWithAuth<IAcceptBookingResponse>(
      `/api/booking/approveBooking?${params.toString()}`,
      token,
      { method: "POST" },
    );
    return res;
  } catch (error) {
    console.error("approveBooking Error:", error);
    throw error;
  }
};
const fetchQuotes = async (
  token: string,
  startDate: string,
  endDate: string,
  page: number,
  limit: number,
): Promise<IFetchAllQuotesResponse> => {
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

    const res = await fetchWithAuth<IFetchAllQuotesResponse>(
      `/api/fetchQuotes?${params.toString()}`,
      token,
      { method: "GET" },
    );
    return res;
  } catch (error) {
    console.error("fetchQuotes Error:", error);
    throw error;
  }
};

const fetchBookingToday = async (
  token: string,
): Promise<IBookingsTodayResponse> => {
  try {
    const res = await fetchWithAuth<IBookingsTodayResponse>(
      `/api/booking/fetchBookingsToday`,
      token,
      { method: "GET" },
    );
    return res;
  } catch (error) {
    console.error("fetchBookingToday Error:", error);
    throw error;
  }
};
const fetchOrder = async (token: string, orderId: string): Promise<IOrder> => {
  try {
    const res = await fetchWithAuth<IOrder>(
      `/api/fetchOrder?orderId=${orderId}`,
      token,
      { method: "GET" },
    );
    return res;
  } catch (error) {
    console.error("fetchOrder Error:", error);
    throw error;
  }
};
const fetchCalendarBookings = async (
  token: string,
  month: string,
): Promise<ICalendarBookingResponse> => {
  try {
    const params = new URLSearchParams();
    if (month) {
      params.append("month", month);
    }
    const res = await fetchWithAuth<ICalendarBookingResponse>(
      `/api/booking/fetchCalendarBookings?${params.toString()}`,
      token,
      { method: "GET" },
    );
    return res;
  } catch (error) {
    console.error("fetchCalendarBookings Error:", error);
    throw error;
  }
};
const fetchBookingMapData = async (
  token: string,
  latitude: number,
  longitude: number,
  address?: string,
): Promise<IBookingMapResponse> => {
  try {
    const body: IBookingMapRequest = {
      latitude,
      longitude,
      address,
    };

    const res = await fetchWithAuth<IBookingMapResponse>(
      "/api/location/openstreetmap",
      token,
      {
        method: "POST",
        data: body,
      },
    );

    return res;
  } catch (error) {
    console.error("fetchBookingMapData Error:", error);
    throw error;
  }
};
const attachEquipmentToBooking = async (
  token: string,
  bookingId: string,
  equipment: IItemQuantity[],
): Promise<IAssignInventoryResponse> => {
  try {
    const body: IAssignEquipmentToBookingRequest = {
      bookingId,
      equipment: equipment,
    };
    const res = await fetchWithAuth<IAssignInventoryResponse>(
      `/api/inventory/attachEquipment`,
      token,
      {
        method: "POST",
        data: body,
      },
    );
    return res;
  } catch (error) {
    console.error("attachEquipmentToBooking Error:", error);
    throw error;
  }
};
const attachResourcesToBooking = async (
  token: string,
  bookingId: string,
  resources: IItemQuantity[],
): Promise<IAssignInventoryResponse> => {
  try {
    const body: IAssignResourcesToBookingRequest = {
      bookingId,
      resources: resources,
    };
    const res = await fetchWithAuth<IAssignInventoryResponse>(
      `/api/inventory/attachResources`,
      token,
      {
        method: "POST",
        data: body,
      },
    );
    return res;
  } catch (error) {
    console.error("attachResourcesToBooking Error:", error);
    throw error;
  }
};
const createInventoryItem = async (
  token: string,
  newItem: ICreateItemRequest,
): Promise<IInventoryItem> => {
  try {
    const res = await fetchWithAuth<IInventoryItem>(
      `/api/inventory/createInventory`,
      token,
      {
        method: "POST",
        data: newItem,
      },
    );
    return res;
  } catch (error) {
    console.error("createInventoryItem Error:", error);
    throw error;
  }
};
const uploadImage = async (formData: FormData) => {
  try {
    const { data } = await axios.post<{ url: string }>(
      "/api/uploadPhoto",
      formData,
    );
    return data;
  } catch (error) {
    console.error("uploadImage Error:", error);
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
  fetchCustomers,
  fetchCustomer,
  fetchCustomerBookings,
  fetchEmployees,
  fetchEmployee,
  onboardEmployee,
  fetchOrder,
  fetchQuotes,
  approveBooking,
  fetchBookingToday,
  fetchCalendarBookings,
  fetchBookingMapData,
  attachEquipmentToBooking,
  attachResourcesToBooking,
  createInventoryItem,
  uploadImage,
};
