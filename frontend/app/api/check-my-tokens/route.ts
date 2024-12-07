import { getContract } from "../../../utils/getContract";
import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";

export async function POST(req: NextRequest) {
  try {
    const { signerAddress } = await req.json();

    if (!signerAddress) {
      throw new Error("No signer address provided");
    }

    const contract = await getContract({
      withSigner: true,
      signer: process.env.PRIVATE_KEY,
      tokenContract: true,
    });

    const address = ethers.getAddress(signerAddress);
    console.log("Address:", address);
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
//   import { getContract } from "../../../utils/getContract";
// import { NextResponse } from "next/server";
// import { ethers } from "ethers";

// export async function GET() {
//   try {
//     const contract = await getContract({
//       withSigner: true,
//       signer: process.env.PRIVATE_KEY,
//       tokenContract: true,
//     });

//     if (!process.env.TEST_VOTER2_ADDRESS) {
//       throw new Error("TEST_VOTER2_ADDRESS not found in environment variables");
//     }

//     const address = ethers.getAddress(process.env.TEST_VOTER2_ADDRESS);
//     const balance = await contract.balanceOf(address);
//     console.log("Balance retrieved:", balance);

//     return NextResponse.json({
//       success: true,
//       balance: Number(balance),
//       address: address,
//     });
//   } catch (error: any) {
//     console.error("Token balance check error:", error);
//     return NextResponse.json(
//       {
//         error: error.message || "Failed to check token balance",
//       },
//       { status: 500 }
//     );
//   }
