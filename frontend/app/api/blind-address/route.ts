import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";
import crypto from "node:crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address } = body;

    // Validate the Ethereum address
    if (!ethers.isAddress(address)) {
      return NextResponse.json(
        { error: "Invalid Ethereum address" },
        { status: 400 }
      );
    }

    // Use secp256k1 curve's generator point G (standard for Ethereum)
    const G =
      "0x79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798";

    // Generate a random blinding factor
    const r = crypto.randomBytes(32);
    const blindingFactor = BigInt("0x" + r.toString("hex"));

    // Convert address to a numeric value (A)
    const addressBytes = ethers.toUtf8Bytes(address.toLowerCase());
    const addressValue = BigInt(
      "0x" + Buffer.from(addressBytes).toString("hex")
    );

    // Calculate blinded address: A + r*G
    const gValue = BigInt(G);
    const blindedAddress = addressValue + blindingFactor * gValue;

    return NextResponse.json({
      success: true,
      blindedAddress: blindedAddress.toString(),
      blindingFactor: blindingFactor.toString(),
      originalAddress: address,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to generate blind address" },
      { status: 500 }
    );
  }
}
