"use client";

import { useState } from "react";
import { Grade, Student } from "@/lib/types";

interface Props {
  student: Student;
  onGenerate: (id: string) => void;
  onRemove: (id: string) => void;
}

const GRADE_BG: Record<Grade, string> = {
  A: "bg-green-100 text-green-700",
  B: "bg-blue-100 text-blue-700",
  C: "bg-yellow-100 text-yellow-700",
  D: "bg-red-100 text-red-700",
};

export function SummaryCard({ student, onGenerate, onRemove }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!student.summary) return;
    await navigator.clipboard.writeText(student.summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-gray-800">{student.name}</h3>
        <button
          onClick={() => onRemove(student.id)}
          className="text-gray-400 hover:text-red-500 text-xs shrink-0"
        >
          Usuń
        </button>
      </div>

      <div className="flex flex-wrap gap-1">
        {(Object.entries(student.grades) as [string, Grade][]).map(
          ([subject, grade]) => (
            <span
              key={subject}
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${GRADE_BG[grade]}`}
            >
              {subject}: {grade}
            </span>
          )
        )}
      </div>

      {student.summary ? (
        <div className="space-y-2">
          <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-lg p-3">
            {student.summary}
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleCopy}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              {copied ? "Skopiowano!" : "Kopiuj"}
            </button>
            <button
              onClick={() => onGenerate(student.id)}
              disabled={student.loading}
              className="text-xs text-gray-500 hover:text-gray-700 disabled:opacity-50"
            >
              {student.loading ? "Generuję..." : "Generuj ponownie"}
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => onGenerate(student.id)}
          disabled={student.loading}
          className="text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg px-3 py-1.5 transition-colors disabled:opacity-50"
        >
          {student.loading ? "Generuję..." : "Generuj podsumowanie"}
        </button>
      )}
    </div>
  );
}
