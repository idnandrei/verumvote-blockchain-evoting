import { RawVoteData, VoteRecord } from "@/lib/types";
import { generateRandomKeys, PublicKey, PrivateKey } from "paillier-bigint";

const MIN_KEY_SIZE = 2048;

export function getStoredPublicKey(): PublicKey | null {
  const n = process.env.ELECTION_PUBLIC_KEY_N;
  const g = process.env.ELECTION_PUBLIC_KEY_G;

  if (!n || !g) return null;

  return new PublicKey(BigInt(n), BigInt(g));
}

export function getStoredPrivateKey(): PrivateKey | null {
  const lambda = process.env.ELECTION_PRIVATE_KEY_LAMBDA;
  const mu = process.env.ELECTION_PRIVATE_KEY_MU;
  const n = process.env.ELECTION_PRIVATE_KEY_N;

  if (!lambda || !mu || !n) return null;

  return new PrivateKey(
    BigInt(lambda),
    BigInt(mu),
    new PublicKey(BigInt(n), BigInt(n + 1)) // g is typically n + 1
  );
}

export async function initializeElectionKeys() {
  const { publicKey, privateKey } = await generateRandomKeys(MIN_KEY_SIZE);

  // Add validation
  if (publicKey.bitLength < MIN_KEY_SIZE) {
    throw new Error("Generated key size is insufficient");
  }

  // Return the keys in a format that's easy to copy to env variables
  return {
    publicKey: {
      n: publicKey.n.toString(),
      g: publicKey.g.toString(),
    },
    privateKey: {
      lambda: privateKey.lambda.toString(),
      mu: privateKey.mu.toString(),
      n: privateKey.n.toString(),
    },
  };
}

export async function encryptVotes(
  voteData: RawVoteData,
  publicKey: PublicKey
): Promise<VoteRecord["vote"]> {
  const encryptedData: Record<string, string> = {};

  for (const [candidate, vote] of Object.entries(voteData)) {
    // Generate a random value for the encryption
    const message = BigInt(vote);
    const encrypted = publicKey.encrypt(message); // The library handles randomization internally
    encryptedData[candidate] = encrypted.toString();
  }

  return encryptedData;
}

export function decryptVote(
  encryptedVote: string | bigint,
  privateKey: PrivateKey
): bigint {
  const encryptedBigInt =
    typeof encryptedVote === "string" ? BigInt(encryptedVote) : encryptedVote;
  const decryptedValue = privateKey.decrypt(encryptedBigInt);
  return decryptedValue;
}
