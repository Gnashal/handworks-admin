import { IGetCustomer } from "@/types/account";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization");
    const customerId = req.nextUrl.searchParams.get("customerId");

    if (!customerId) {
      return NextResponse.json(
        { error: "Missing customerId" },
        { status: 400 },
      );
    }
    const params = new URLSearchParams();
    params.append("id", customerId);
    const apiUrl = `${process.env.API_URL}account/customer?${params.toString()}`;

    const { data } = await axios.get<IGetCustomer>(apiUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token || "",
      },
    });

    return NextResponse.json(data, { status: 200 });
  } catch (err: unknown) {
    console.error("Failed to fetch customer data ", err);
    return NextResponse.json(
      { error: "Failed to fetch customer data" },
      { status: 500 },
    );
  }
}
