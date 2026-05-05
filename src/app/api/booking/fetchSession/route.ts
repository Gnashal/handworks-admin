import { ISession } from "@/types/booking";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization");
    const bookingId = req.nextUrl.searchParams.get("bookingId");
    const params = new URLSearchParams();
    if (bookingId) {
      params.append("bookingId", bookingId);
    }
    const apiUrl = `${process.env.API_URL}admin/booking/session?${params.toString()}`;
    const { data } = await axios.get<ISession>(apiUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token || "",
      },
    });
    return NextResponse.json(data, { status: 200 });
  } catch (err: unknown) {
    console.error("Failed to fetch booking session data ", err);
    return NextResponse.json(
      { error: "Failed to fetch booking session data" },
      { status: 500 },
    );
  }
}
