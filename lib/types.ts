export type Grade = "A" | "B" | "C" | "D";

export const SUBJECTS: string[] = [
  "Matematyka",
  "Język polski",
  "Przyroda",
  "Historia",
  "Język angielski",
  "Plastyka",
  "WF",
  "Muzyka",
];

export type Subject = string;

export type GradeMap = Record<string, Grade>;

export interface Student {
  id: string;
  name: string;
  grades: GradeMap;
  summary: string | null;
  loading: boolean;
}
