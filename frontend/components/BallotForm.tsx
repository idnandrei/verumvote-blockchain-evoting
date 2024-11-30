"use client";

import { allCandidates } from "@/lib/candidates";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

type BallotFormProps = {
  onSubmit: (e: React.FormEvent) => Promise<void>;
  isSubmitting: boolean;
  selections: {
    president: string;
    vicePresident: string;
    senators: string[];
  };
  onSelectionChange: {
    president: (value: string) => void;
    vicePresident: (value: string) => void;
    senators: (value: string[]) => void;
  };
};

export default function BallotForm({
  onSubmit,
  isSubmitting,
  selections,
  onSelectionChange,
}: BallotFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Official Voting Ballot
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* President */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Vote for President</h2>
          <RadioGroup
            onValueChange={onSelectionChange.president}
            value={selections.president}
          >
            {allCandidates.president.map((candidate) => (
              <div key={candidate} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={candidate}
                  id={`president-${candidate}`}
                />
                <Label htmlFor={`president-${candidate}`}>{candidate}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Vice President */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Vote for Vice President</h2>
          <RadioGroup
            onValueChange={onSelectionChange.vicePresident}
            value={selections.vicePresident}
          >
            {allCandidates.vicePresident.map((candidate) => (
              <div key={candidate} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={candidate}
                  id={`vicePresident-${candidate}`}
                />
                <Label htmlFor={`vicePresident-${candidate}`}>
                  {candidate}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Senators */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            Vote for Senators (Select up to 5)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allCandidates.senators.map((candidate) => (
              <div key={candidate} className="flex items-center space-x-2">
                <Checkbox
                  id={`senator-${candidate}`}
                  checked={selections.senators.includes(candidate)}
                  disabled={
                    !selections.senators.includes(candidate) &&
                    selections.senators.length >= 5
                  }
                  onCheckedChange={(checked) => {
                    if (checked) {
                      if (selections.senators.length < 5) {
                        onSelectionChange.senators([
                          ...selections.senators,
                          candidate,
                        ]);
                      }
                    } else {
                      onSelectionChange.senators(
                        selections.senators.filter((sen) => sen !== candidate)
                      );
                    }
                  }}
                />
                <Label htmlFor={`senator-${candidate}`}>{candidate}</Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Vote"}
        </Button>
      </CardFooter>
    </form>
  );
}
