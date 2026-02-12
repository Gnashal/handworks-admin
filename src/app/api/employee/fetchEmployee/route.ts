import { IGetEmployee } from "@/types/account";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization");
    const employeeId = req.nextUrl.searchParams.get("employeeId");

    if (!employeeId) {
      return NextResponse.json(
        { error: "Missing employeeId" },
        { status: 400 },
      );
    }

    const apiUrl = `${process.env.API_URL}account/employee/${employeeId}`;

    const { data } = await axios.get<IGetEmployee>(apiUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token || "",
      },
    });

    return NextResponse.json(data, { status: 200 });
  } catch (err: unknown) {
    console.error("Failed to fetch employee data ", err);
    return NextResponse.json(
      { error: "Failed to fetch employee data" },
      { status: 500 },
    );
  }
}
