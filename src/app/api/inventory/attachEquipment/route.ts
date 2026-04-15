import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import {
  IAssignInventoryResponse,
  IAssignEquipmentToBookingRequest,
} from "@/types/booking";

export async function POST(req: NextRequest) {
  try {
    const body: IAssignEquipmentToBookingRequest = await req.json();
    const token = req.headers.get("authorization");

    const apiUrl = `${process.env.API_URL}admin/inventory/assign-equipment`;

    const { data } = await axios.post<IAssignInventoryResponse>(apiUrl, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token || "",
      },
    });

    return NextResponse.json(data, { status: 200 });
  } catch (err: unknown) {
    console.error("assign equipment error: ", err);
    return NextResponse.json(
      { error: "Failed to assign equipment" },
      { status: 500 },
    );
  }
}
