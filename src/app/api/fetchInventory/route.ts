import { IInventoryListResponse } from "@/types/inventory";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization");
    const page = req.nextUrl.searchParams.get("page");
    const limit = req.nextUrl.searchParams.get("limit");
    const type = req.nextUrl.searchParams.get("type");
    const status = req.nextUrl.searchParams.get("status");
    const category = req.nextUrl.searchParams.get("category");
    const params = new URLSearchParams();
    if (page !== null && limit !== null) {
      params.append("page", page);
    }
    if (type !== null) {
      params.append("type", type);
    }
    if (status !== null) {
      params.append("status", status);
    }
    if (category !== null) {
      params.append("category", category);
    }
    const apiUrl = `${process.env.API_URL}inventory/items?${params.toString()}`;
    const { data } = await axios.get<IInventoryListResponse>(apiUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token || "",
      },
    });
    return NextResponse.json(data, { status: 200 });
  } catch (err: unknown) {
    console.error("Failed to fetch inventory data ", err);
    return NextResponse.json(
      { error: "Failed to fetch inventory data" },
      { status: 500 },
    );
  }
}
