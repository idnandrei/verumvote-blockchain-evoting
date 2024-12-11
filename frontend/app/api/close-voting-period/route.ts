import { getContract } from "../../../utils/getContract";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const contractWithSigner = await getContract({
      withSigner: true,
      signer: process.env.PRIVATE_KEY,
    });

    const tx = await contractWithSigner.closeVotingPeriod();
    const receipt = await tx.wait(1);

    return NextResponse.json({
      success: true,
      message: "Voting period closed successfully",
      transactionHash: receipt.hash,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message || "Failed to close voting period",
      },
      { status: 500 }
    );
  }
}
