import { getContract } from "../../../utils/getContract";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const contract = await getContract();

    const isInitialized = await contract.isInitialized();

    if (!isInitialized) {
      return NextResponse.json({
        isInitialized: false,
        message: "Voting period has not been initialized yet",
      });
    }

    const [startTime, endTime, tokenAddress, requiredTokens] =
      await Promise.all([
        contract.startTime(),
        contract.endTime(),
        contract.votingToken(),
        contract.requiredTokens(),
      ]);

    return NextResponse.json({
      isInitialized: true,
      startTime: Number(startTime),
      endTime: Number(endTime),
      tokenAddress,
      requiredTokens: Number(requiredTokens),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message || "Failed to fetch voting period details",
      },
      { status: 500 }
    );
  }
}
