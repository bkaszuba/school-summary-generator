export type Grade = "A" | "B" | "C" | "D";

export const SUBJECTS = [
  "Matematyka",
  "Język polski",
  "Przyroda",
  "Historia",
  "Język angielski",
  "Plastyka",
  "WF",
  "Muzyka",
] as const;

export type Subject = (typeof SUBJECTS)[number];

export type GradeMap = Record<Subject, Grade>;

export interface Student {
  id: string;
  name: string;
  grades: GradeMap;
  summary: string | null;
  loading: boolean;
}
