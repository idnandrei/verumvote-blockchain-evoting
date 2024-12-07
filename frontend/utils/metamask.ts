import { ethers } from "ethers";

export async function getSigner() {
  if (!window.ethereum) {
    throw new Error("Please install MetaMask to use this feature");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  return signer;
}
