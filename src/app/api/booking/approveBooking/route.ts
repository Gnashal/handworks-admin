import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { IAcceptBookingResponse } from "@/types/booking";

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("authorization");
    const id = req.nextUrl.searchParams.get("bookingId");

    const apiUrl = `${process.env.API_URL}admin/booking/approve/${id}`;

    const { data } = await axios.post<IAcceptBookingResponse>(apiUrl, null, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token || "",
      },
    });

    return NextResponse.json(data, { status: 200 });
  } catch (err: unknown) {
    console.error("accept booking error: ", err);
    return NextResponse.json(
      { error: "Failed to accept booking" },
      { status: 500 },
    );
  }
}
