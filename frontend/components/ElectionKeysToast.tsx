"use client";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

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

interface ElectionKeysToastProps {
  electionKeys: ElectionKeys;
}

export function ElectionKeysToast({ electionKeys }: ElectionKeysToastProps) {
  const [copiedFields, setCopiedFields] = useState<Set<string>>(new Set());

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedFields((prev) => new Set(prev).add(fieldName));

      setTimeout(() => {
        setCopiedFields((prev) => {
          const newSet = new Set(prev);
          newSet.delete(fieldName);
          return newSet;
        });
      }, 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const KeyField = ({ label, value }: { label: string; value: string }) => (
    <div className="flex items-center justify-between gap-2 py-1">
      <div className="flex-1">
        <p className="text-sm font-medium">{label}:</p>
        <p className="text-xs font-mono truncate">{value}</p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => copyToClipboard(value, label)}
        className="h-6 w-6 p-0"
      >
        {copiedFields.has(label) ? (
          <Check className="h-3 w-3 text-green-500" />
        ) : (
          <Copy className="h-3 w-3" />
        )}
      </Button>
    </div>
  );

  return (
    <div className="max-w-md space-y-3">
      <div>
        <h4 className="font-medium mb-1">Public Key</h4>
        <div className="space-y-1">
          <KeyField label="n" value={electionKeys.publicKey.n} />
          {electionKeys.publicKey.g && (
            <KeyField label="g" value={electionKeys.publicKey.g} />
          )}
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-1">Private Key</h4>
        <div className="space-y-1">
          <KeyField
            label="lambda"
            value={electionKeys.privateKey.lambda || ""}
          />
          <KeyField label="mu" value={electionKeys.privateKey.mu || ""} />
          <KeyField label="n" value={electionKeys.privateKey.n} />
        </div>
      </div>
    </div>
  );
}
