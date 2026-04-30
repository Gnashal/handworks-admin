import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import {
  IUpdateEmployeeStatusRequest,
  IUpdateEmployeeStatusResponse,
} from "@/types/employee";

export async function PUT(req: NextRequest) {
  try {
    const token = req.headers.get("authorization");
    const body: IUpdateEmployeeStatusRequest = await req.json();
    const apiUrl = `${process.env.API_URL}account/employee/status`;

    const { data } = await axios.put<IUpdateEmployeeStatusResponse>(
      apiUrl,
      body,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: token || "",
        },
      },
    );

    return NextResponse.json(data, { status: 200 });
  } catch (err: unknown) {
    console.error("update employee status error: ", err);
    return NextResponse.json(
      { error: "Failed to update employee status" },
      { status: 500 },
    );
  }
}
