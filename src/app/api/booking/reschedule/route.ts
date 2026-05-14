import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

type RescheduleBookingRequest = {
  bookingId?: string;
  newStartSched: string;
  newEndSched: string;
};

type RescheduleBookingResponse = {
  bookingId: string;
};

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("authorization");
    const body: RescheduleBookingRequest = await req.json();

    const bookingId =
      body.bookingId || req.nextUrl.searchParams.get("bookingId") || "";

    if (!bookingId) {
      return NextResponse.json(
        { error: "Missing bookingId" },
        { status: 400 },
      );
    }

    if (!body.newStartSched || !body.newEndSched) {
      return NextResponse.json(
        { error: "Missing newStartSched or newEndSched" },
        { status: 400 },
      );
    }

    const apiUrl = `${process.env.API_URL}admin/booking/reschedule/${bookingId}`;

    const { data } = await axios.post<RescheduleBookingResponse>(
      apiUrl,
      {
        newStartSched: body.newStartSched,
        newEndSched: body.newEndSched,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: token || "",
        },
      },
    );

    return NextResponse.json(data, { status: 200 });
  } catch (err: unknown) {
    console.error("reschedule booking error: ", err);

    if (axios.isAxiosError(err) && err.response) {
      return NextResponse.json(err.response.data, {
        status: err.response.status,
      });
    }

    return NextResponse.json(
      { error: "Failed to reschedule booking" },
      { status: 500 },
    );
  }
}
