"use client";

import { useState } from "react";
import { Grade, GradeMap, SUBJECTS, Student } from "@/lib/types";

const GRADES: Grade[] = ["A", "B", "C", "D"];

const DEFAULT_GRADES = Object.fromEntries(
  SUBJECTS.map((s) => [s, "B"])
) as GradeMap;

interface Props {
  onAdd: (student: Omit<Student, "id" | "summary" | "loading">) => void;
}

export function StudentForm({ onAdd }: Props) {
  const [name, setName] = useState("");
  const [grades, setGrades] = useState<GradeMap>({ ...DEFAULT_GRADES });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({ name: name.trim(), grades: { ...grades } });
    setName("");
    setGrades({ ...DEFAULT_GRADES });
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

      <div className="grid grid-cols-2 gap-3">
        {SUBJECTS.map((subject) => (
          <div key={subject} className="flex items-center gap-2">
            <span className="text-sm text-gray-600 w-32 shrink-0">{subject}</span>
            <div className="flex gap-1">
              {GRADES.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() =>
                    setGrades((prev) => ({ ...prev, [subject]: g }))
                  }
                  className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                    grades[subject] === g
                      ? gradeColor(g)
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        ))}
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
