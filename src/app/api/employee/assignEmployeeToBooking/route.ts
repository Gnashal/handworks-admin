import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import {
  IAssignEmployeeToBookingRequest,
  IAssignEmployeeToBookingResponse,
} from "@/types/admin";

export async function POST(req: NextRequest) {
  try {
    const body: IAssignEmployeeToBookingRequest = await req.json();
    const token = req.headers.get("authorization");

    const apiUrl = `${process.env.API_URL}admin/employee/assign`;

    const { data } = await axios.post<IAssignEmployeeToBookingResponse>(
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
    console.error("assign employee to booking error: ", err);
    return NextResponse.json(
      { error: "Failed to assign employee to booking" },
      { status: 500 },
    );
  }
}
