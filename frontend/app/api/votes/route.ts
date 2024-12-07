import { NextRequest, NextResponse } from "next/server";
import { encryptVotes, getStoredPublicKey } from "../../../utils/encryption";
import { getContract } from "../../../utils/getContract";
import { PinataSDK } from "pinata";
import { keccak256 } from "js-sha3";
import { RawVoteData, VoteRecord, VoteSubmissionResponse } from "@/lib/types";

const pinata = new PinataSDK({
  pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT,
  pinataGateway: "lavender-historic-barnacle-198.mypinata.cloud",
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    //const { voteData } = body;
    const { voteData, signerAddress } = body;

    const publicKey = getStoredPublicKey();
    if (!publicKey) {
      throw new Error(
        "Election public key not found. Has the election been initialized?"
      );
    }

    const encryptedResult = await encryptVotes(voteData, publicKey);
    const encryptedHash = keccak256(JSON.stringify(encryptedResult));
    const result = await pinata.upload.json({
      vote: encryptedResult,
      hash: encryptedHash,
    } as VoteRecord);

    if (!result.cid) {
      throw new Error("Failed to get CID from Pinata");
    }

    const contractWithSigner = await getContract({
      withSigner: true,
      // signer: signerAddress,
      signer: process.env.TEST_VOTER_PKEY,
      tokenContract: false,
    });

    try {
      const tx = await contractWithSigner.castVote(result.cid, encryptedHash);
      const receipt = await tx.wait(1);

      return NextResponse.json({
        success: true,
        cid: result.cid,
        hash: encryptedHash,
        transactionHash: receipt.hash,
      } as VoteSubmissionResponse);
    } catch (error: any) {
      const errorMessage = error.message || "Unknown contract error";
      console.error("Contract error:", errorMessage);

      if (errorMessage.includes("execution reverted")) {
        let userError = "Contract error occurred";

        if (errorMessage.includes("Voting period is not initialized")) {
          userError = "The voting period has not been initialized yet";
        } else if (errorMessage.includes("Not within the voting period")) {
          userError = "Voting is not currently active";
        } else if (errorMessage.includes("Already voted")) {
          userError = "You have already cast your vote";
        } else if (errorMessage.includes("Insufficient voting tokens")) {
          userError = "You don't have enough voting tokens";
        }

        return NextResponse.json(
          { success: false, error: userError },
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: "Failed to process vote. Please try again later.",
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Vote submission error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to submit vote",
      },
      { status: 500 }
    );
  }
}
