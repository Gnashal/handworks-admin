import { IEmployeeTimesheetResponse } from "@/types/employee";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization");
    const id = req.nextUrl.searchParams.get("id");
    const page = req.nextUrl.searchParams.get("page");
    const limit = req.nextUrl.searchParams.get("limit");
    const startDate = req.nextUrl.searchParams.get("startDate");
    const endDate = req.nextUrl.searchParams.get("endDate");
    const params = new URLSearchParams();
    if (page !== null && limit !== null) {
      params.append("page", page);
      params.append("limit", limit);
      if (id) params.append("id", id);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);
    }
    const apiUrl = `${process.env.API_URL}account/employee/timesheet/history?${params.toString()}`;
    const { data } = await axios.get<IEmployeeTimesheetResponse>(apiUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token || "",
      },
    });
    return NextResponse.json(data, { status: 200 });
  } catch (err: unknown) {
    console.error("Failed to fetch employee timesheet", err);
    return NextResponse.json(
      { error: "Failed to fetch employee timesheet" },
      { status: 500 },
    );
  }
}
