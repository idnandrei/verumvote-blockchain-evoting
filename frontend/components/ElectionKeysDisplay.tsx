"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Copy, Check } from "lucide-react";

interface ElectionKey {
  n: string;
  g?: string;
  lambda?: string;
  mu?: string;
}

interface ElectionKeys {
  publicKey: ElectionKey;
  privateKey: ElectionKey;
}

interface ElectionKeysDisplayProps {
  electionKeys: ElectionKeys;
}

export function ElectionKeysDisplay({
  electionKeys,
}: ElectionKeysDisplayProps) {
  const { toast } = useToast();
  const [copiedFields, setCopiedFields] = useState<Set<string>>(new Set());

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedFields((prev) => new Set(prev).add(fieldName));
      toast({
        title: "Copied!",
        description: `${fieldName} has been copied to clipboard`,
      });

      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopiedFields((prev) => {
          const newSet = new Set(prev);
          newSet.delete(fieldName);
          return newSet;
        });
      }, 2000);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const KeyField = ({ label, value }: { label: string; value: string }) => (
    <div className="flex items-center justify-between gap-2 p-2 bg-gray-100 rounded-md">
      <div className="flex-1 overflow-hidden">
        <p className="font-semibold text-sm text-gray-700">{label}:</p>
        <p className="text-xs font-mono truncate">{value}</p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => copyToClipboard(value, label)}
        className="h-8 w-8 p-0"
      >
        {copiedFields.has(label) ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>
    </div>
  );

  return (
    <Card className="w-full mt-4">
      <CardHeader>
        <CardTitle>Election Keys</CardTitle>
        <CardDescription>Save these keys securely</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h4 className="font-semibold">Public Key</h4>
          <div className="space-y-2">
            <KeyField label="Public Key (n)" value={electionKeys.publicKey.n} />
            {electionKeys.publicKey.g && (
              <KeyField
                label="Public Key (g)"
                value={electionKeys.publicKey.g}
              />
            )}
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold">Private Key</h4>
          <div className="space-y-2">
            <KeyField
              label="Private Key (lambda)"
              value={electionKeys.privateKey.lambda || ""}
            />
            <KeyField
              label="Private Key (mu)"
              value={electionKeys.privateKey.mu || ""}
            />
            <KeyField
              label="Private Key (n)"
              value={electionKeys.privateKey.n}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
