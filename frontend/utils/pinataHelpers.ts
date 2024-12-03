import { PinataSDK } from "pinata";
import { VoteRecord } from "@/lib/types";

const pinata = new PinataSDK({
  pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT,
  pinataGateway: "lavender-historic-barnacle-198.mypinata.cloud",
});

export async function fetchVoteFromIPFS(cid: string): Promise<VoteRecord> {
  const response = await pinata.gateways.get(cid);
  const data = response.data as unknown;

  if (
    data &&
    typeof data === "object" &&
    "vote" in data &&
    "hash" in data &&
    typeof data.vote === "object" &&
    typeof data.hash === "string"
  ) {
    const voteRecord = data as VoteRecord;
    return voteRecord;
  }
  throw new Error(`Invalid vote data for CID: ${cid}`);
}
