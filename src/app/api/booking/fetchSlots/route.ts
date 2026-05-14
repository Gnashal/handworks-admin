import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

type BookingSlotResponse = {
  message: string;
  notEnoughCleaners: boolean;
  occupiedSlots: {
    bookingID?: string;
    bookingId?: string;
    cleanersNeeded?: number;
    durationHours?: number;
    endSched: string;
    isFullyOccupied?: boolean;
    startSched: string;
    usedCleaners?: number;
  }[];
  totalActiveCleaners: number;
};

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization");

    const date = req.nextUrl.searchParams.get("date");
    const quoteId = req.nextUrl.searchParams.get("quoteId");
    const customerId = req.nextUrl.searchParams.get("customerId");

    if (!customerId) {
      return NextResponse.json(
        { error: "Missing customerId" },
        { status: 400 },
      );
    }

    const params = new URLSearchParams();

    if (date) {
      params.append("date", date);
    }

    if (quoteId) {
      params.append("quoteId", quoteId);
    }

    params.append("customerId", customerId);

    const apiUrl = `${process.env.API_URL}booking/slots?${params.toString()}`;

    const { data } = await axios.get<BookingSlotResponse>(apiUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token || "",
      },
    });

    return NextResponse.json(data, { status: 200 });
  } catch (err: unknown) {
    console.error("Failed to fetch booking slots data ", err);

    if (axios.isAxiosError(err) && err.response) {
      return NextResponse.json(err.response.data, {
        status: err.response.status,
      });
    }

    return NextResponse.json(
      { error: "Failed to fetch booking slots data" },
      { status: 500 },
    );
  }
}
