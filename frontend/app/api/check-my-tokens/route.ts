import { getContract } from "../../../utils/getContract";
import { NextResponse } from "next/server";
import { ethers } from "ethers";

export async function GET() {
  try {
    const contract = await getContract({
      withSigner: true,
      signer: process.env.PRIVATE_KEY,
      tokenContract: true,
    });

    if (!process.env.TEST_VOTER3_ADDRESS) {
      throw new Error("TEST_VOTER3_ADDRESS not found in environment variables");
    }

    const address = ethers.getAddress(process.env.TEST_VOTER3_ADDRESS);
    const balance = await contract.balanceOf(address);
    console.log("Balance retrieved:", balance);

    return NextResponse.json({
      success: true,
      balance: Number(balance),
      address: address,
    });
  } catch (error: any) {
    console.error("Token balance check error:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to check token balance",
      },
      { status: 500 }
    );
  }
}
