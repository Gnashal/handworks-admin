import { NextResponse } from "next/server";

let employeeSettings = {
  allowEmployeeLogin: true,
  defaultRole: "staff",
  autoAssignBookings: false,
  maxBookingsPerDay: 10,
  enablePerformanceTracking: true,
};

export async function GET() {
  return NextResponse.json(employeeSettings);
}

export async function PATCH(req: Request) {
  const body = await req.json();

  employeeSettings = {
    ...employeeSettings,
    ...body,
  };

  return NextResponse.json(employeeSettings);
}