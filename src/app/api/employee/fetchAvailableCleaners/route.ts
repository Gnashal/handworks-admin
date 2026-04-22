import { IAvailableCleanersResponse } from "@/types/admin";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization");
    const bookingId = req.nextUrl.searchParams.get("bookingId");

    if (!bookingId) {
      return NextResponse.json({ error: "Missing bookingId" }, { status: 400 });
    }
    const params = new URLSearchParams({ bookingId });
    const apiUrl = `${process.env.API_URL}admin/employee/available?${params.toString()}`;

    const { data } = await axios.get<IAvailableCleanersResponse>(apiUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token || "",
      },
    });

    return NextResponse.json(data, { status: 200 });
  } catch (err: unknown) {
    console.error("Failed to fetch available cleaners data ", err);
    return NextResponse.json(
      { error: "Failed to fetch available cleaners data" },
      { status: 500 },
    );
  }
}
