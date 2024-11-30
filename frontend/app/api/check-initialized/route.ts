import { getContract } from "../../../utils/getContract";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const contract = await getContract();
    const isInitialized = await contract.isInitialized();

    return NextResponse.json({ isInitialized: Boolean(isInitialized) });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message || "Failed to check initialization status",
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
