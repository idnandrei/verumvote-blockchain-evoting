import { getContract } from "./getContract";

export async function getVotingPeriodDetails() {
  const contract = await getContract();

  // Check initialization first
  const isInitialized = await contract.isInitialized();

  if (!isInitialized) {
    return {
      isInitialized: false,
      message: "Voting period has not been initialized yet",
    };
  }

  // Only fetch other details if initialized
  const [startTime, endTime, tokenAddress, requiredTokens] = await Promise.all([
    contract.startTime(),
    contract.endTime(),
    contract.votingToken(),
    contract.requiredTokens(),
  ]);

  return {
    isInitialized: true,
    startTime: Number(startTime),
    endTime: Number(endTime),
    tokenAddress,
    requiredTokens: Number(requiredTokens),
  };
}
