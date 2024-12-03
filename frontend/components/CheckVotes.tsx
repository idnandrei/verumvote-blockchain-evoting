import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { TallyResult } from "@/lib/types";
import { allCandidates } from "@/lib/candidates";

const CheckVotes = () => {
  const [cids, setCids] = useState<string[]>([]);
  const [tallyResults, setTallyResults] = useState<TallyResult | null>(null);
  const [isTallying, setIsTallying] = useState(false);
  const { toast } = useToast();

  const fetchCIDs = async () => {
    try {
      const response = await fetch("/api/get-votes");
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to fetch votes");
      setCids(data.cids);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch votes",
        variant: "destructive",
      });
    }
  };

  const tallyVotes = async () => {
    setIsTallying(true);
    try {
      const response = await fetch("/api/tally-votes");
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to tally votes");

      setTallyResults(data.results);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to tally votes",
        variant: "destructive",
      });
    } finally {
      setIsTallying(false);
    }
  };

  const renderTallyResults = () => {
    if (!tallyResults) return null;

    return (
      <div className="mt-4 p-4 border-t">
        <h2 className="font-bold mb-4">Vote Tally Results:</h2>

        {/* President Results */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">President</h3>
          <div className="space-y-2">
            {allCandidates.president.map((candidate) => (
              <div
                key={candidate}
                className="flex justify-between items-center p-2 bg-gray-50 rounded"
              >
                <span className="font-medium">{candidate}</span>
                <span className="font-mono">
                  {tallyResults[candidate] || 0}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Vice President Results */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Vice President</h3>
          <div className="space-y-2">
            {allCandidates.vicePresident.map((candidate) => (
              <div
                key={candidate}
                className="flex justify-between items-center p-2 bg-gray-50 rounded"
              >
                <span className="font-medium">{candidate}</span>
                <span className="font-mono">
                  {tallyResults[candidate] || 0}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Senators Results */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Senators</h3>
          <div className="space-y-2">
            {allCandidates.senators.map((candidate) => (
              <div
                key={candidate}
                className="flex justify-between items-center p-2 bg-gray-50 rounded"
              >
                <span className="font-medium">{candidate}</span>
                <span className="font-mono">
                  {tallyResults[candidate] || 0}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full max-w-3xl mx-auto mt-6">
      <div className="p-4 space-y-4">
        <Button onClick={fetchCIDs} className="w-full">
          Get All IPFS CIDs
        </Button>

        {cids.length > 0 && (
          <Button onClick={tallyVotes} className="w-full" disabled={isTallying}>
            {isTallying ? "Tallying Votes..." : "Tally All Votes"}
          </Button>
        )}
      </div>

      {cids.length > 0 && (
        <div className="mt-4 p-4">
          <h2 className="font-bold mb-4">IPFS CIDs:</h2>
          <ul className="space-y-4">
            {cids.map((cid, index) => (
              <li
                key={index}
                className="flex items-center p-2 bg-gray-50 rounded"
              >
                <span className="font-mono">{cid}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {renderTallyResults()}
    </Card>
  );
};

export default CheckVotes;
