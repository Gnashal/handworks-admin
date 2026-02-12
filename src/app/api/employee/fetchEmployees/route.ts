import { IEmployees } from "@/types/account";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization");
    const page = req.nextUrl.searchParams.get("page");
    const limit = req.nextUrl.searchParams.get("limit");
    const params = new URLSearchParams();
    if (page !== null && limit !== null) {
      params.append("page", page);
      params.append("limit", limit);
    }
    const apiUrl = `${process.env.API_URL}account/employee?${params.toString()}`;
    const { data } = await axios.get<IEmployees>(apiUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token || "",
      },
    });
    return NextResponse.json(data, { status: 200 });
  } catch (err: unknown) {
    console.error("Failed to fetch all employees", err);
    return NextResponse.json(
      { error: "Failed to fetch all employees" },
      { status: 500 },
    );
  }
}
