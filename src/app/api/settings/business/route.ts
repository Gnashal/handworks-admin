import { NextResponse } from "next/server";

let businessSettings = {
  businessName: "Handworks",
  contactEmail: "support@handworks.com",
  contactPhone: "09123456789",
  address: "Cebu City, Philippines",
  currency: "PHP",
  taxRate: 12,
};

export async function GET() {
  return NextResponse.json(businessSettings);
}

export async function PATCH(req: Request) {
  const body = await req.json();

  businessSettings = {
    ...businessSettings,
    ...body,
  };

  return NextResponse.json(businessSettings);
}