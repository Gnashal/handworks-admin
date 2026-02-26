import { IFetchAllQuotesResponse } from "@/types/payment";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization");
    const page = req.nextUrl.searchParams.get("page");
    const limit = req.nextUrl.searchParams.get("limit");
    const startDate = req.nextUrl.searchParams.get("startDate");
    const endDate = req.nextUrl.searchParams.get("endDate");
    const params = new URLSearchParams();
    if (page !== null && limit !== null) {
      params.append("page", page);
      params.append("limit", limit);
    }
    if (startDate !== null) {
      params.append("startDate", startDate);
    }
    if (endDate !== null) {
      params.append("endDate", endDate);
    }

    const apiUrl = `${process.env.API_URL}payment/quotes?${params.toString()}`;
    const { data } = await axios.get<IFetchAllQuotesResponse>(apiUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token || "",
      },
    });
    return NextResponse.json(data, { status: 200 });
  } catch (err: unknown) {
    console.error("Failed to fetch quotes data ", err);
    return NextResponse.json(
      { error: "Failed to fetch quotes data" },
      { status: 500 },
    );
  }
}
