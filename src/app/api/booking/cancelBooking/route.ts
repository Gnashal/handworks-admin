import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { ICancelBookingResponse } from "@/types/booking";

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("authorization");
    const id = req.nextUrl.searchParams.get("bookingId");

    const apiUrl = `${process.env.API_URL}admin/booking/cancel/${id}`;

    const { data } = await axios.post<ICancelBookingResponse>(apiUrl, null, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token || "",
      },
    });

    return NextResponse.json(data, { status: 200 });
  } catch (err: unknown) {
    console.error("cancel booking error: ", err);
    return NextResponse.json(
      { error: "Failed to cancel booking" },
      { status: 500 },
    );
  }
}
