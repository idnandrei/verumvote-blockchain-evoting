import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const voteNumber = searchParams.get("number");

  if (!voteNumber) {
    return NextResponse.json(
      { error: "Vote number is required" },
      { status: 400 }
    );
  }

  // Simulate checking a vote
  const isValid = Math.random() < 0.5;

  return NextResponse.json({ isValid, voteNumber });
}
