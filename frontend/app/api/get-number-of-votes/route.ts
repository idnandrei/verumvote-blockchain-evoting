import { NextResponse } from "next/server";
import { getContract } from "@/utils/getContract";

export async function GET() {
  try {
    const contract = await getContract();
    const totalVotes = await contract.totalVotes();

    return NextResponse.json({
      success: true,
      numberOfVotes: Number(totalVotes),
    });
  } catch (error) {
    console.error("Error fetching vote count:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to get vote count",
      },
      { status: 500 }
    );
  }
}
