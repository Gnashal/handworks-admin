import { ICalendarBookingResponse } from "@/types/booking";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization");
    const month = req.nextUrl.searchParams.get("month");
    const params = new URLSearchParams();

    if (month) {
      params.append("month", month);
    }

    const apiUrl = `${process.env.API_URL}admin/booking/calendar?${params.toString()}`;
    const { data } = await axios.get<ICalendarBookingResponse>(apiUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token || "",
      },
    });
    return NextResponse.json(data, { status: 200 });
  } catch (err: unknown) {
    console.error("Failed to fetch calendar bookings data ", err);
    return NextResponse.json(
      { error: "Failed to fetch calendar bookings data" },
      { status: 500 },
    );
  }
}
