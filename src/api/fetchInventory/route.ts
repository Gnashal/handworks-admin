import { IInventoryItem } from "@/types/inventory";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization");
    const page = req.headers.get("page");
    const limit = req.headers.get("limit");

    const params = new URLSearchParams();
    if (page && limit) {
      params.append("page", page);
      params.append("limit", limit);
    }
    const apiUrl = `${process.env.API_URL}inventory/items?${params.toString()}`;
    const { data } = await axios.get<IInventoryItem>(apiUrl, {
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
