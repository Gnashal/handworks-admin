import axios from "axios";
import { ISignUpAdminRequest, ISignUpAdminResponse } from "@/types/account";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body: ISignUpAdminRequest = await req.json();
    console.log("Signup req body", body);
    const apiUrl = `${process.env.API_URL}account/admin/signup`;
    const { data } = await axios.post<ISignUpAdminResponse>(apiUrl, body, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return NextResponse.json(data, { status: 200 });
  } catch (err: unknown) {
    console.error("signup error: ", err);
    return NextResponse.json(
      { error: "Failed to sign up user" },
      { status: 500 },
    );
  }
}
