import { NextRequest, NextResponse } from "next/server";
import { initializeElectionKeys } from "../../../utils/encryption";
import { getContract } from "../../../utils/getContract";
import { PinataSDK } from "pinata";
import { ethers } from "ethers";

const pinata = new PinataSDK({
  pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT,
  pinataGateway: "lavender-historic-barnacle-198.mypinata.cloud",
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { startDateTime, duration } = body;

    if (!startDateTime || !duration) {
      return NextResponse.json(
        { error: "Start time and duration are required" },
        { status: 400 }
      );
    }

    // Generate election keys
    const keys = await initializeElectionKeys();

    // Upload only public key to IPFS
    const result = await pinata.upload.json({
      content: {
        publicKey: keys.publicKey,
      },
      name: "election-public-key",
    });

    if (!result.cid) {
      throw new Error("Failed to upload public key to IPFS");
    }

    // Initialize contract
    const contractWithSigner = await getContract({
      withSigner: true,
      signer: process.env.PRIVATE_KEY,
    });

    const startTimestamp = Math.floor(new Date(startDateTime).getTime() / 1000);
    const durationInSeconds = duration * 3600;

    const tx = await contractWithSigner.initializeVotingPeriod(
      BigInt(startTimestamp),
      BigInt(durationInSeconds),
      process.env.VOTING_TOKEN_ADDRESS,
      1
    );

    const receipt = await tx.wait(1);

    // Return everything including the private key (for manual storage)
    return NextResponse.json({
      success: true,
      transactionHash: receipt.hash,
      startDateTime,
      duration,
      publicKeyCid: result.cid,
      electionKeys: keys, // This will show both public and private keys
    });
  } catch (error: any) {
    console.error("Initialization error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to initialize voting period",
      },
      { status: 500 }
    );
  }
}
