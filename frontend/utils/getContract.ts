import { ethers, Wallet, JsonRpcProvider } from "ethers";
import { VotingSystemABI, VotingTokenABI } from "@/lib/contracts/abi";

type ContractConfig = {
  withSigner?: boolean;
  signer?: Wallet | string;
  tokenContract?: boolean;
};

export async function getContract({
  withSigner = false,
  signer,
  tokenContract = false,
}: ContractConfig = {}): Promise<ethers.Contract> {
  const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL;
  const votingAddress = process.env.VOTING_ADDRESS;
  const votingTokenAddress = process.env.VOTING_TOKEN_ADDRESS;

  if (!rpcUrl || !votingAddress || !votingTokenAddress) {
    throw new Error("Missing environment variables");
  }

  const provider = new JsonRpcProvider(rpcUrl);

  // Explicitly create the contract interface
  const abi = tokenContract ? VotingTokenABI : VotingSystemABI;
  const contractInterface = new ethers.Interface(abi);

  const address = tokenContract ? votingTokenAddress : votingAddress;

  if (withSigner && signer) {
    const wallet =
      typeof signer === "string" ? new Wallet(signer, provider) : signer;
    return new ethers.Contract(address, contractInterface, wallet);
  }

  return new ethers.Contract(address, contractInterface, provider);
}
