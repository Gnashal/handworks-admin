import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import {
  IUnsubscribeNotificationResponse,
  IUnsubscribeNotificationRequest,
} from "@/types/notification";

export async function POST(req: NextRequest) {
  try {
    const body: IUnsubscribeNotificationRequest = await req.json();
    const token = req.headers.get("authorization");

    const apiUrl = `${process.env.API_URL}notifications/unsubscribe`;

    const { data } = await axios.post<IUnsubscribeNotificationResponse>(
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
    console.error("unsubscribe notification error: ", err);
    return NextResponse.json(
      { error: "Failed to unsubscribe from notifications" },
      { status: 500 },
    );
  }
}
