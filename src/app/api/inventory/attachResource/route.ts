import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import {
  IAssignInventoryResponse,
  IAssignResourcesToBookingRequest,
} from "@/types/booking";

export async function POST(req: NextRequest) {
  try {
    const body: IAssignResourcesToBookingRequest = await req.json();
    const token = req.headers.get("authorization");

    const apiUrl = `${process.env.API_URL}admin/inventory/assign-resources`;

    const { data } = await axios.post<IAssignInventoryResponse>(apiUrl, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token || "",
      },
    });

    return NextResponse.json(data, { status: 200 });
  } catch (err: unknown) {
    console.error("assign resource error: ", err);
    return NextResponse.json(
      { error: "Failed to assign resource" },
      { status: 500 },
    );
  }
}
