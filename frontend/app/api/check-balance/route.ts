import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");

  if (!address) {
    return NextResponse.json({ error: "Address is required" }, { status: 400 });
  }

  // Simulate checking balance for a given address
  const balance = Math.floor(Math.random() * 10000) / 100; // Random balance between 0 and 100

  return NextResponse.json({ balance, address });
}
