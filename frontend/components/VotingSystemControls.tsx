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
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [voteCount, setVoteCount] = useState<number | null>(null);

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

  const getNumberOfVotes = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/get-number-of-votes");
      const data = await response.json();
      setVoteCount(data.numberOfVotes);
      toast({
        title: "Total Votes",
        description: `Current number of votes: ${data.numberOfVotes}`,
      });
    } catch (error) {
      setVoteCount(null);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to fetch vote count",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePause = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/toggle-pause", {
        method: "POST",
      });
      const data = await response.json();

      toast({
        title: "Success",
        description: `Voting system has been ${
          data.isPaused ? "paused" : "unpaused"
        }`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to toggle pause state",
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
        <div className="grid grid-cols-2 gap-4">
          {/* First row */}
          <Button onClick={checkInitialized} disabled={isLoading}>
            Check Initialized
          </Button>
          <Button onClick={votingPeriodDetails} disabled={isLoading}>
            Voting Period Details
          </Button>

          {/* Second row - Vote count spans full width */}
          <div className="col-span-2 flex flex-col gap-2">
            <Button
              onClick={getNumberOfVotes}
              disabled={isLoading}
              className="w-full"
            >
              Number of Votes
            </Button>
            {voteCount !== null && (
              <div className="text-center p-2 bg-secondary rounded-md">
                Current Votes: {voteCount}
              </div>
            )}
          </div>

          {/* Third row */}
          <Button onClick={closeVotingPeriod} disabled={isLoading}>
            Close Voting Period
          </Button>
          <Button
            onClick={forceEndVotingPeriod}
            disabled={isLoading}
            variant="destructive"
          >
            Force End Voting
          </Button>

          {/* Fourth row  */}
          <Button onClick={() => togglePause()} disabled={isLoading}>
            Unpause Voting
          </Button>
          <Button
            onClick={() => togglePause()}
            disabled={isLoading}
            variant="destructive"
          >
            Pause Voting
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
