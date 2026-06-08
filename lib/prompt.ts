import { GradeMap, Subject } from "./types";

const GRADE_LABELS: Record<string, string> = {
  A: "celujący",
  B: "bardzo dobry",
  C: "dobry",
  D: "dostateczny",
};

export function buildPrompt(name: string, grades: GradeMap): string {
  const gradeLines = (Object.entries(grades) as [Subject, string][])
    .map(([subject, grade]) => `  - ${subject}: ${grade} (${GRADE_LABELS[grade]})`)
    .join("\n");

  return `Napisz krótkie podsumowanie osiągnięć ucznia szkoły podstawowej w 2-3 zdaniach po polsku.
Podsumowanie powinno brzmieć naturalnie, być napisane w trzeciej osobie i różnić się od standardowych szablonowych formułek.
Wspomnij mocne strony ucznia oraz obszary wymagające poprawy. Unikaj suchego wyliczania ocen.

Uczeń: ${name}
Oceny:
${gradeLines}

Skala ocen: A = celujący, B = bardzo dobry, C = dobry, D = dostateczny

Napisz tylko samo podsumowanie, bez żadnych nagłówków ani dodatkowych informacji.`;
}
