import axios from "axios";
import { IFetchBookingTrendsResponse } from "@/types/admin";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization");

    const apiUrl = `${process.env.API_URL}admin/booking-trends`;
    const { data } = await axios.get<IFetchBookingTrendsResponse>(apiUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token || "",
      },
    });
    return NextResponse.json(data, { status: 200 });
  } catch (err: unknown) {
    console.error("booking trends fetch error: ", err);
    return NextResponse.json(
      { error: "Failed to fetch booking trends data" },
      { status: 500 },
    );
  }
}
