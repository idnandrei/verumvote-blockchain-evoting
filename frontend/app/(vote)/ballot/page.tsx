"use client";
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import BallotForm from "@/components/BallotForm";
import { useToast } from "@/hooks/use-toast";
import { allCandidates, type Candidate } from "@/lib/candidates";
import { Button } from "@/components/ui/button";
import {
  RawVoteData,
  VoteSubmissionResponse,
  VoteSubmissionResult,
} from "@/lib/types";

export default function VotingForm() {
  const [selections, setSelections] = useState<Candidate>({
    president: "",
    vicePresident: "",
    senators: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cid, setCid] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();
  const [isCheckingBalance, setIsCheckingBalance] = useState(false);
  const [voteHash, setVoteHash] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setCid(null);
    setErrorMessage(null);

    // Create vote data object with binary values
    const voteData: RawVoteData = Object.values(allCandidates)
      .flat()
      .reduce((acc, candidate) => {
        acc[candidate] = 0;
        return acc;
      }, {} as RawVoteData);

    // Update selected candidates
    if (selections.president) voteData[selections.president] = 1;
    if (selections.vicePresident) voteData[selections.vicePresident] = 1;
    selections.senators.forEach((senator) => {
      voteData[senator] = 1;
    });

    // Debug logs
    console.log("Current Selections:", {
      president: selections.president,
      vicePresident: selections.vicePresident,
      senators: selections.senators,
    });
    console.log("Vote Record:", voteData);

    try {
      const response = await fetch("api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voteData }),
      });

      const data: VoteSubmissionResult = await response.json();
      if (!response.ok || "error" in data) {
        throw new Error("error" in data ? data.error : "Failed to submit vote");
      }

      setCid(data.cid);
      setVoteHash(data.hash);
    } catch (error: any) {
      const errorMsg = error.message || "Unexpected error occurred.";
      setErrorMessage(errorMsg);
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const checkMyTokens = async () => {
    setIsCheckingBalance(true);
    try {
      const response = await fetch("/api/check-my-tokens");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      toast({
        title: "Token Balance",
        description: `You have ${data.balance} voting tokens`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to check token balance",
        variant: "destructive",
      });
    } finally {
      setIsCheckingBalance(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <div className="p-4">
        <Button
          onClick={checkMyTokens}
          disabled={isCheckingBalance}
          variant="outline"
          className="w-full"
        >
          {isCheckingBalance ? "Checking..." : "Check My Tokens"}
        </Button>
      </div>
      <BallotForm
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
        selections={selections}
        onSelectionChange={{
          president: (value) =>
            setSelections((prev) => ({ ...prev, president: value })),
          vicePresident: (value) =>
            setSelections((prev) => ({ ...prev, vicePresident: value })),
          senators: (value) =>
            setSelections((prev) => ({ ...prev, senators: value })),
        }}
      />

      {cid && (
        <div className="mt-6 p-4 border border-green-500 rounded-md">
          <h2 className="text-green-700 font-bold">Vote Submitted!</h2>
          <p>
            Your vote has been recorded successfully. Please store these values:
            <br />
            CID: <span className="font-mono">{cid}</span>
            <br />
            Vote Hash: <span className="font-mono">{voteHash}</span>
          </p>
        </div>
      )}
    </Card>
  );
}
