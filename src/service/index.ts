import axios, { AxiosRequestConfig } from "axios";
import { IAdmin, ISignUpAdminRequest } from "@/types/account";
import { IAdminDashboardResponse } from "@/types/admin";

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

export { signUpAdmin, fetchAdminDashboardData };
