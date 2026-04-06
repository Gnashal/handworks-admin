import { IOrder } from "@/types/payment";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization");
    const orderId = request.nextUrl.searchParams.get("orderId");

    if (!token) {
      return NextResponse.json({ status: 401 });
    }

    const apiUrl = `${process.env.API_URL}payment/order?id=${orderId}`;

    const data = await axios.get<IOrder>(apiUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      signal: AbortSignal.timeout(10000),
    });

    return NextResponse.json(data.data, { status: 200 });
  } catch (error) {
    console.error("fetch order error:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 },
    );
  }
}
