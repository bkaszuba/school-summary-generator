"use client";

import { useState } from "react";
import { Grade, GradeMap, Student } from "@/lib/types";

const GRADES: Grade[] = ["A", "B", "C", "D"];

const SUBJECT_SUGGESTIONS = [
  "Matematyka",
  "Język polski",
  "Język angielski",
  "Język niemiecki",
  "Język francuski",
  "Język rosyjski",
  "Przyroda",
  "Biologia",
  "Chemia",
  "Fizyka",
  "Geografia",
  "Historia",
  "Wiedza o społeczeństwie",
  "Informatyka",
  "Technika",
  "Plastyka",
  "Muzyka",
  "WF",
  "Religia",
  "Etyka",
  "Edukacja dla bezpieczeństwa",
];

interface Props {
  subjects: string[];
  onAdd: (student: Omit<Student, "id" | "summary" | "loading">) => void;
  onAddSubject: (subject: string) => void;
  onRemoveSubject: (subject: string) => void;
}

export function StudentForm({
  subjects,
  onAdd,
  onAddSubject,
  onRemoveSubject,
}: Props) {
  const [name, setName] = useState("");
  const [grades, setGrades] = useState<GradeMap>(() =>
    Object.fromEntries(subjects.map((s) => [s, "B" as Grade]))
  );
  const [newSubject, setNewSubject] = useState("");

  // Keep grades in sync when subjects change externally
  const syncedGrades: GradeMap = Object.fromEntries(
    subjects.map((s) => [s, grades[s] ?? "B"])
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({ name: name.trim(), grades: { ...syncedGrades } });
    setName("");
    setGrades(Object.fromEntries(subjects.map((s) => [s, "B" as Grade])));
  }

  function handleAddSubject(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = newSubject.trim();
    if (!trimmed) return;
    onAddSubject(trimmed);
    setGrades((prev) => ({ ...prev, [trimmed]: "B" }));
    setNewSubject("");
  }

  function handleRemoveSubject(subject: string) {
    onRemoveSubject(subject);
    setGrades((prev) => {
      const next = { ...prev };
      delete next[subject];
      return next;
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl border border-gray-200 p-5 space-y-4"
    >
      <h2 className="font-semibold text-gray-800">Dodaj ucznia</h2>

      <div>
        <label className="block text-sm text-gray-600 mb-1">
          Imię i nazwisko
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="np. Anna Kowalska"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {subjects.map((subject) => (
          <div key={subject} className="flex items-center gap-2">
            <span className="text-sm text-gray-600 w-28 shrink-0">
              {subject}
            </span>
            <div className="flex gap-1">
              {GRADES.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() =>
                    setGrades((prev) => ({ ...prev, [subject]: g }))
                  }
                  className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                    syncedGrades[subject] === g
                      ? gradeColor(g)
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => handleRemoveSubject(subject)}
              disabled={subjects.length <= 1}
              className="ml-auto text-gray-300 hover:text-red-400 disabled:opacity-30 text-xs shrink-0"
              title="Usuń przedmiot"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <datalist id="subject-suggestions">
        {SUBJECT_SUGGESTIONS.filter((s) => !subjects.includes(s)).map((s) => (
          <option key={s} value={s} />
        ))}
      </datalist>

      <div className="flex gap-2 pt-1">
        <input
          type="text"
          list="subject-suggestions"
          value={newSubject}
          onChange={(e) => setNewSubject(e.target.value)}
          placeholder="Nowy przedmiot…"
          spellCheck
          lang="pl"
          className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={handleAddSubject}
          disabled={!newSubject.trim()}
          className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg px-3 py-1.5 transition-colors disabled:opacity-40 shrink-0"
        >
          + Dodaj przedmiot
        </button>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 text-sm font-medium transition-colors"
      >
        + Dodaj ucznia
      </button>
    </form>
  );
}

function gradeColor(grade: Grade): string {
  const map: Record<Grade, string> = {
    A: "bg-green-500 text-white",
    B: "bg-blue-500 text-white",
    C: "bg-yellow-500 text-white",
    D: "bg-red-500 text-white",
  };
  return map[grade];
}
