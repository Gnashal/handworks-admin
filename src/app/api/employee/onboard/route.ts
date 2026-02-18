import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { ISignUpEmployeeResponse } from "@/types/account";
import { IOnboardEmployeeRequest } from "@/types/admin";

export async function POST(req: NextRequest) {
  try {
    const body: IOnboardEmployeeRequest = await req.json();

    const currentUser = auth();
    const token = (await currentUser).getToken();
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const apiUrl = `${process.env.API_URL}admin/employee/onboard`;

    const { data } = await axios.post<ISignUpEmployeeResponse>(apiUrl, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return NextResponse.json(data, { status: 200 });
  } catch (err: unknown) {
    console.error("onboard employee error: ", err);
    return NextResponse.json(
      { error: "Failed to onboard employee" },
      { status: 500 },
    );
  }
}
