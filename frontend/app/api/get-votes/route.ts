import { NextRequest, NextResponse } from "next/server";
import { getVotesFromContract } from "../../../utils/contractHelpers";
import { fetchVoteFromIPFS } from "../../../utils/pinataHelpers";
import { VoteRecord } from "@/lib/types";

export async function GET(req: NextRequest) {
  try {
    const votes = await getVotesFromContract();
    const cids = votes.map((vote) => vote.ipfsCid);

    const { searchParams } = new URL(req.url);
    const requestedCid = searchParams.get("cid");

    if (requestedCid) {
      try {
        const voteRecord = await fetchVoteFromIPFS(requestedCid);
        return NextResponse.json({ data: voteRecord });
      } catch (error: any) {
        console.error("Error fetching vote details:", error);
        return NextResponse.json(
          { error: "Failed to fetch vote details" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ cids });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch votes" },
      { status: 500 }
    );
  }
}
