import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import {
  ISubscribeNotificationRequest,
  ISubscribeNotificationResponse,
} from "@/types/notification";

export async function POST(req: NextRequest) {
  try {
    const body: ISubscribeNotificationRequest = await req.json();
    const token = req.headers.get("authorization");

    const apiUrl = `${process.env.API_URL}notifications/subscribe`;

    const { data } = await axios.post<ISubscribeNotificationResponse>(
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
    console.error("subscribe notification error: ", err);
    return NextResponse.json(
      { error: "Failed to subscribe to notifications" },
      { status: 500 },
    );
  }
}
