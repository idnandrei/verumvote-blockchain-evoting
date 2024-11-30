import { getContract } from "../../../utils/getContract";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const contractWithSigner = await getContract({
      withSigner: true,
      signer: process.env.PRIVATE_KEY,
    });

    try {
      const tx = await contractWithSigner.forceEndVotingPeriod();
      const receipt = await tx.wait(1);

      return NextResponse.json({
        success: true,
        message: "Voting period force ended successfully",
        transactionHash: receipt.hash,
      });
    } catch (error: any) {
      const errorMessage = error.message || "Unknown contract error";
      console.error("Contract error:", errorMessage);

      if (errorMessage.includes("execution reverted")) {
        let userError = "Contract error occurred";

        if (errorMessage.includes("Voting period is not initialized")) {
          userError = "The voting period has not been initialized yet";
        } else if (errorMessage.includes("Ownable: caller is not the owner")) {
          userError = "Only the contract owner can force end the voting period";
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
    console.error("Force end voting period error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to force end voting period",
      },
      { status: 500 }
    );
  }
}
