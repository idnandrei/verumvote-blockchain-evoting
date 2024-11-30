"use client";

import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useToast } from "../hooks/use-toast";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";

export default function VotingSystemControls() {
  const [voteNumber, setVoteNumber] = useState("");
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const checkInitialized = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("api/check-initialized");
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      toast({
        title: "Initialization Status",
        description: `Is initialized: ${data.isInitialized}`,
      });
    } catch (error: any) {
      toast({
        title: "Connection Error",
        description: error.message || "Failed to connect to blockchain",
        variant: "destructive",
      });
      console.error("Detailed error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkVote = async () => {
    if (!voteNumber) {
      toast({
        title: "Error",
        description: "Please enter a vote number",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/check-vote?number=${voteNumber}`);
      const data = await response.json();
      toast({
        title: "Vote Check Result",
        description: `Vote ${data.voteNumber} is ${
          data.isValid ? "valid" : "invalid"
        }`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const checkBalance = async () => {
    if (!address) {
      toast({
        title: "Error",
        description: "Please enter a hash address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/check-balance?address=${encodeURIComponent(address)}`
      );
      const data = await response.json();
      toast({
        title: "Balance Check Result",
        description: `Balance for address ${
          data.address
        }: $${data.balance.toFixed(2)}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const votingPeriodDetails = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/voting-period-details");
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (!data.isInitialized) {
        toast({
          title: "Voting Period Details",
          description: data.message,
          variant: "destructive",
        });
        return;
      }

      // Only format and display dates if initialized
      const startDate = new Date(data.startTime * 1000).toLocaleString();
      const endDate = new Date(data.endTime * 1000).toLocaleString();

      toast({
        title: "Voting Period Details",
        description: (
          <div className="mt-2 flex flex-col gap-1">
            <p>Start Time: {startDate}</p>
            <p>End Time: {endDate}</p>
            <p>Token Address: {data.tokenAddress}</p>
            <p>Required Tokens: {data.requiredTokens}</p>
          </div>
        ),
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to fetch voting period details",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const forceEndVotingPeriod = async () => {
    setIsLoading(true);
    try {
      // Check if initialized first
      const initResponse = await fetch("/api/check-initialized");
      const initData = await initResponse.json();

      if (!initData.isInitialized) {
        toast({
          title: "Error",
          description: "Voting period has not been initialized yet",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch("/api/force-end-voting-period", {
        method: "POST",
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error);
      }

      toast({
        title: "Success",
        description: "Voting period has been force ended.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to force end voting period",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const closeVotingPeriod = async () => {
    setIsLoading(true);
    try {
      // Check if initialized first
      const initResponse = await fetch("/api/check-initialized");
      const initData = await initResponse.json();

      if (!initData.isInitialized) {
        toast({
          title: "Error",
          description: "Voting period has not been initialized yet",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch("/api/close-voting-period", {
        method: "POST",
      });
      const data = await response.json();

      if (!response.ok) {
        // Format the time remaining if available
        if (data.currentTime && data.endTime) {
          throw new Error(`Voting period is still active.`);
        }
        throw new Error(data.error);
      }

      toast({
        title: "Success",
        description: "Voting period has been closed naturally.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to close voting period",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Voting System Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2 justify-center">
          <Button onClick={checkInitialized} disabled={isLoading}>
            Check Initialized
          </Button>
          <Button
            onClick={forceEndVotingPeriod}
            disabled={isLoading}
            variant="destructive"
          >
            Force End Voting
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Input
            placeholder="Enter vote number"
            value={voteNumber}
            onChange={(e) => setVoteNumber(e.target.value)}
          />
          <Button onClick={checkVote} disabled={isLoading}>
            Check Vote
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Input
            placeholder="Enter hash address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <Button onClick={checkBalance} disabled={isLoading}>
            Check Balance
          </Button>
        </div>

        <div className="flex items-center space-x-2 justify-center">
          <Button onClick={votingPeriodDetails} disabled={isLoading}>
            Voting Period Details
          </Button>
          <Button onClick={closeVotingPeriod} disabled={isLoading}>
            Close Voting Period
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
