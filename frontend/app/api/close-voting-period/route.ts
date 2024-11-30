import { getContract } from "../../../utils/getContract";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const contract = await getContract();

    // Check if voting period has ended
    const [endTime, currentTime] = await Promise.all([
      contract.endTime(),
      contract.getCurrentTimeBlock(),
    ]);

    if (Number(currentTime) <= Number(endTime)) {
      return NextResponse.json(
        {
          error:
            "Voting period has not ended yet. Please wait until the end time or use force end.",
          currentTime: Number(currentTime),
          endTime: Number(endTime),
        },
        { status: 400 }
      );
    }

    // If we've passed the end time, proceed with closing
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
