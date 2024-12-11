import { NextResponse } from "next/server";
import { getContract } from "@/utils/getContract";

export async function POST() {
  try {
    const contractWithSigner = await getContract({
      withSigner: true,
      signer: process.env.PRIVATE_KEY,
    });

    try {
      const tx = await contractWithSigner.pause();
      const receipt = await tx.wait(1);

      return NextResponse.json({
        success: true,
        message: "Voting system paused successfully",
        transactionHash: receipt.hash,
      });
    } catch (error: any) {
      const errorMessage = error.message || "Unknown contract error";
      console.error("Contract error:", errorMessage);

      if (errorMessage.includes("execution reverted")) {
        let userError = "Contract error occurred";

        if (errorMessage.includes("Ownable: caller is not the owner")) {
          userError = "Only the contract owner can pause the voting system";
        } else if (errorMessage.includes("EnforcedPause")) {
          userError = "Voting system is already paused";
        }

        return NextResponse.json(
          { success: false, error: userError },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { success: false, error: "Failed to process request" },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Pause voting system error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to pause voting system",
      },
      { status: 500 }
    );
  }
}
