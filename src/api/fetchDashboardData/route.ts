import axios from "axios";
import { IAdminDashboardResponse } from "@/types/admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("authorization");
    const adminId = req.nextUrl.searchParams.get("adminId");
    const dateFilter = req.nextUrl.searchParams.get("dateFilter");

    const params = new URLSearchParams();
    if (adminId && dateFilter) {
      params.append("adminId", adminId);
      params.append("dateFilter", dateFilter);
    }

    const apiUrl = `${process.env.API_URL}admin/dashboard?${params.toString()}`;
    const { data } = await axios.get<IAdminDashboardResponse>(apiUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token || "",
      },
    });
    return NextResponse.json(data, { status: 200 });
  } catch (err: unknown) {
    console.error("admi dashboard fetch error: ", err);
    return NextResponse.json(
      { error: "Failed to fetch admin dashboard data" },
      { status: 500 },
    );
  }
}
