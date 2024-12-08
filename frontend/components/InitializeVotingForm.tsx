"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getSigner } from "../utils/metamask";
import { ElectionKeysToast } from "./ElectionKeysToast";

export default function InitializeVotingForm() {
  const [startDateTime, setStartDateTime] = useState("");
  const [duration, setDuration] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [electionKeys, setElectionKeys] = useState<any>(null);
  const { toast } = useToast();

  const initialize = async () => {
    if (!startDateTime || !duration) {
      toast({
        title: "Error",
        description: "Please fill in both start time and duration",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const signer = await getSigner();
      const signerAddress = await signer.getAddress();

      const response = await fetch("api/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startDateTime,
          duration: parseFloat(duration),
          signerAddress,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error);
      }

      // Show success toast
      toast({
        title: "Success",
        description: `Initialization successful. Start: ${new Date(
          data.startDateTime
        ).toLocaleString()}, Duration: ${data.duration}h`,
      });

      // Show election keys in a separate toast
      toast({
        title: "Election Keys (Save these securely)",
        description: <ElectionKeysToast electionKeys={data.electionKeys} />,
        duration: 20000, // 20 seconds
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to initialize",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-3/4">
      <CardHeader>
        <CardTitle>Initialize Voting Period</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          type="datetime-local"
          placeholder="Start Date and Time"
          value={startDateTime}
          onChange={(e) => setStartDateTime(e.target.value)}
          className="w-full text-center"
        />
        <Input
          type="number"
          placeholder="Duration (hours)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="w-full"
          min={0}
          step="any"
        />
        <Button
          onClick={initialize}
          disabled={isLoading}
          type="button"
          className="w-full"
        >
          Initialize Voting Period
        </Button>
      </CardContent>
    </Card>
  );
}
