declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: {
        method: string;
        params?: readonly unknown[] | object;
      }) => Promise<unknown>;
      on: (event: string, listener: (args: unknown[]) => void) => void;
      removeListener: (
        event: string,
        listener: (args: unknown[]) => void
      ) => void;
      selectedAddress: string | null;
      isConnected: () => boolean;
      chainId: string;
      networkVersion: string;
      _state: {
        accounts: string[];
        isConnected: boolean;
        isUnlocked: boolean;
        initialized: boolean;
      };
    };
  }
}

export type VoteData = {
  president: string;
  vicePresident: string;
  senators: string[];
};

export interface VoteRecord {
  vote: {
    [candidate: string]: string; // Encrypted votes as strings
  };
  hash: string;
}

export interface RawVoteData {
  [candidate: string]: number; // 0 or 1 for each candidate
}

export interface TallyResult {
  [candidate: string]: number; // Final decrypted vote counts
}

export interface VoteSubmissionResponse {
  success: boolean;
  cid: string;
  hash: string;
  transactionHash: string;
}

export interface VoteSubmissionError {
  error: string;
}

export type VoteSubmissionResult = VoteSubmissionResponse | VoteSubmissionError;

export interface EncryptedVote {
  ipfsCid: string;
  verificationHash: string;
}
