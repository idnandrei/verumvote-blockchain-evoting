"use client";

import VotingSystemControls from "@/components/VotingSystemControls";
import InitializeVotingForm from "@/components/InitializeVotingForm";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-20 text-blue-500">
        Voting System Dashboard
      </h1>
      <div className="w-full max-w-4xl space-x-8 flex items-center">
        <VotingSystemControls />
        <InitializeVotingForm />
      </div>
    </main>
  );
}
