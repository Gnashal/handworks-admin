import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { IInventoryItem, ICreateItemRequest } from "@/types/inventory";

export async function POST(req: NextRequest) {
  try {
    const body: ICreateItemRequest = await req.json();
    const token = req.headers.get("authorization");

    const apiUrl = `${process.env.API_URL}inventory`;

    const { data } = await axios.post<IInventoryItem>(apiUrl, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token || "",
      },
    });

    return NextResponse.json(data, { status: 200 });
  } catch (err: unknown) {
    console.error("create inventory item error: ", err);
    return NextResponse.json(
      { error: "Failed to create inventory item" },
      { status: 500 },
    );
  }
}
