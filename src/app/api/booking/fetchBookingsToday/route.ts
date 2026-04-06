import { IBookingsTodayResponse } from "@/types/booking";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization");

    const apiUrl = `${process.env.API_URL}booking/today`;
    const { data } = await axios.get<IBookingsTodayResponse>(apiUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token || "",
      },
    });
    return NextResponse.json(data, { status: 200 });
  } catch (err: unknown) {
    console.error("Failed to fetch booking today data ", err);
    return NextResponse.json(
      { error: "Failed to fetch booking today data" },
      { status: 500 },
    );
  }
}
