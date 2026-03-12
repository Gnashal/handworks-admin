import { NextResponse } from "next/server";

let bookingSettings = {
  defaultStatus: "pending",
  allowDoubleBooking: false,
  minimumNoticeHours: 24,
  requireDeposit: false,
  depositPercentage: 20,
};

export async function GET() {
  return NextResponse.json(bookingSettings);
}

export async function PATCH(req: Request) {
  const body = await req.json();

  bookingSettings = {
    ...bookingSettings,
    ...body,
  };

  return NextResponse.json(bookingSettings);
}