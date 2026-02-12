import { IFetchAllBookingsResponse } from "@/types/booking";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization");
    const employeeId = req.nextUrl.searchParams.get("employeeId");
    const page = req.nextUrl.searchParams.get("page");
    const limit = req.nextUrl.searchParams.get("limit");
    const startDate = req.nextUrl.searchParams.get("startDate");
    const endDate = req.nextUrl.searchParams.get("endDate");

    const params = new URLSearchParams();
    if (employeeId) params.append("employeeId", employeeId);
    if (page) params.append("page", page);
    if (limit) params.append("limit", limit);
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    const apiUrl = `${process.env.API_URL}booking/employee?${params.toString()}`;

    const { data } = await axios.get<{
      status: string;
      data: IFetchAllBookingsResponse;
    }>(apiUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token || "",
      },
    });

    // unwrap the inner "data"
    return NextResponse.json(data.data, { status: 200 });
  } catch (err: unknown) {
    console.error("Failed to fetch employee data ", err);
    return NextResponse.json(
      { error: "Failed to fetch employee data" },
      { status: 500 },
    );
  }
}
