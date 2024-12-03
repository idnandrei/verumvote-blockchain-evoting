import { NextResponse } from "next/server";
import { getVotesFromContract } from "../../../utils/contractHelpers";
import { fetchVoteFromIPFS } from "../../../utils/pinataHelpers";
import {
  decryptVote,
  getStoredPrivateKey,
  getStoredPublicKey,
} from "../../../utils/encryption";
import { TallyResult, EncryptedVote, VoteRecord } from "@/lib/types";
import { PublicKey, PrivateKey } from "paillier-bigint";

export async function GET() {
  try {
    const votes: EncryptedVote[] = await getVotesFromContract();
    const privateKey = getStoredPrivateKey();
    const publicKey = getStoredPublicKey();

    if (!privateKey || !publicKey) {
      throw new Error("Election keys not found");
    }

    // Get all votes from IPFS and verify their integrity
    const votePromises = votes.map(async (vote) => {
      const voteRecord = await fetchVoteFromIPFS(vote.ipfsCid);
      if (voteRecord.hash !== vote.verificationHash) {
        console.warn(`Hash mismatch for vote ${vote.ipfsCid}`);
        throw new Error(`Vote integrity check failed for CID: ${vote.ipfsCid}`);
      }
      return voteRecord.vote;
    });

    const verifiedVotes: VoteRecord["vote"][] = await Promise.all(votePromises);

    // Initialize tally object for homomorphic addition
    const encryptedTallies: { [candidate: string]: bigint } = {};

    // Sum all encrypted votes using homomorphic addition
    verifiedVotes.forEach((candidateVotes) => {
      Object.entries(candidateVotes).forEach(([candidate, encryptedValue]) => {
        const newEncryptedValue = BigInt(encryptedValue);

        if (!encryptedTallies[candidate]) {
          encryptedTallies[candidate] = newEncryptedValue;
        } else {
          // Use the public key's addition method for homomorphic addition
          encryptedTallies[candidate] = publicKey.addition(
            encryptedTallies[candidate],
            newEncryptedValue
          );
        }
      });
    });

    // Decrypt only the final sums
    const results: TallyResult = {};
    Object.entries(encryptedTallies).forEach(([candidate, encryptedSum]) => {
      console.log(`Decrypting for ${candidate}: ${encryptedSum}`);
      const decryptedValue = decryptVote(encryptedSum, privateKey);
      console.log(`Decrypted value for ${candidate}: ${decryptedValue}`);
      results[candidate] = Number(decryptedValue);
    });
    console.log(results);
    return NextResponse.json({ results });
  } catch (error: any) {
    console.error("Tally error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to tally votes" },
      { status: 500 }
    );
  }
}
