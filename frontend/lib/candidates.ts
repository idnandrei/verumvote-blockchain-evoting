export const allCandidates = {
  president: ["John Doe", "Jane Smith", "Bob Johnson"],
  vicePresident: ["Alice Brown", "Charlie Davis", "Eva Wilson"],
  senators: [
    "Sen1",
    "Sen2",
    "Sen3",
    "Sen4",
    "Sen5",
    "Sen6",
    "Sen7",
    "Sen8",
    "Sen9",
    "Sen10",
  ],
} as const;

export type Candidate = {
  president: string;
  vicePresident: string;
  senators: string[];
};
