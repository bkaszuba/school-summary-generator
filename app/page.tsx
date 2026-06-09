"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Student, GradeMap, SUBJECTS } from "@/lib/types";
import { StudentForm } from "@/components/StudentForm";
import { SubjectManager } from "@/components/SubjectManager";
import { SummaryCard } from "@/components/SummaryCard";

let nextId = 1;

export default function Home() {
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<string[]>(SUBJECTS);
  const initialized = useRef(false);

  // Load from DB on mount
  useEffect(() => {
    Promise.all([
      fetch("/api/students").then((r) => r.json()),
      fetch("/api/subjects").then((r) => r.json()),
    ]).then(([savedStudents, savedSubjects]: [Student[], string[]]) => {
      if (savedStudents.length > 0) {
        nextId = Math.max(...savedStudents.map((s) => Number(s.id))) + 1;
        setStudents(savedStudents.map((s) => ({ ...s, loading: false })));
      }
      setSubjects(savedSubjects);
      initialized.current = true;
    });
  }, []);

  // Persist students to DB whenever they change
  useEffect(() => {
    if (!initialized.current) return;
    fetch("/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(students),
    });
  }, [students]);

  // Persist subjects to DB whenever they change
  useEffect(() => {
    if (!initialized.current) return;
    fetch("/api/subjects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(subjects),
    });
  }, [subjects]);

  const [generatingAll, setGeneratingAll] = useState(false);

  function addSubject(subject: string) {
    setSubjects((prev) =>
      prev.includes(subject) ? prev : [...prev, subject]
    );
  }

  function removeSubject(subject: string) {
    setSubjects((prev) => prev.filter((s) => s !== subject));
  }

  function addStudent(data: Omit<Student, "id" | "summary" | "loading">) {
    setStudents((prev) => [
      ...prev,
      { ...data, id: String(nextId++), summary: null, loading: false },
    ]);
  }

  function removeStudent(id: string) {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  }

  const generateSummary = useCallback(async (id: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, loading: true } : s))
    );

    setStudents((prev) => {
      const student = prev.find((s) => s.id === id);
      if (!student) return prev;

      fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: student.name, grades: student.grades }),
      })
        .then((res) => res.json())
        .then(({ summary }) => {
          setStudents((cur) =>
            cur.map((s) =>
              s.id === id ? { ...s, summary, loading: false } : s
            )
          );
        })
        .catch(() => {
          setStudents((cur) =>
            cur.map((s) => (s.id === id ? { ...s, loading: false } : s))
          );
        });

      return prev;
    });
  }, []);

  async function generateForStudent(student: Student): Promise<void> {
    setStudents((prev) =>
      prev.map((s) => (s.id === student.id ? { ...s, loading: true } : s))
    );

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: student.name, grades: student.grades }),
      });
      const { summary } = await res.json();
      setStudents((prev) =>
        prev.map((s) =>
          s.id === student.id ? { ...s, summary, loading: false } : s
        )
      );
    } catch {
      setStudents((prev) =>
        prev.map((s) =>
          s.id === student.id ? { ...s, loading: false } : s
        )
      );
    }
  }

  async function generateAll() {
    setGeneratingAll(true);
    const withoutSummary = students.filter((s) => !s.summary && !s.loading);
    for (const student of withoutSummary) {
      await generateForStudent(student);
    }
    setGeneratingAll(false);
  }

  function exportTxt() {
    const lines = students
      .filter((s) => s.summary)
      .map((s) => `${s.name}\n${s.summary}`)
      .join("\n\n---\n\n");

    const blob = new Blob([lines], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "podsumowania.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  const withSummaries = students.filter((s) => s.summary).length;
  const withoutSummaries = students.filter((s) => !s.summary).length;

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Generator Podsumowań Uczniów
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Dodaj uczniów, przypisz oceny i wygeneruj podsumowania po polsku
          </p>
        </div>

        <SubjectManager
          subjects={subjects}
          onAdd={addSubject}
          onRemove={removeSubject}
        />

        <StudentForm subjects={subjects} onAdd={addStudent} />

        {students.length > 0 && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <p className="text-sm text-gray-600">
                Uczniów: <strong>{students.length}</strong>
                {withSummaries > 0 && (
                  <span className="ml-2 text-green-600">
                    ({withSummaries} z podsumowaniem)
                  </span>
                )}
              </p>
              <div className="flex flex-wrap gap-2">
                {withoutSummaries > 0 && (
                  <button
                    onClick={generateAll}
                    disabled={generatingAll}
                    className="text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-3 py-1.5 transition-colors disabled:opacity-50"
                  >
                    {generatingAll
                      ? "Generuję..."
                      : `Generuj wszystkich (${withoutSummaries})`}
                  </button>
                )}
                {withSummaries > 0 && (
                  <button
                    onClick={exportTxt}
                    className="text-sm bg-gray-700 hover:bg-gray-800 text-white rounded-lg px-3 py-1.5 transition-colors"
                  >
                    Eksportuj .txt ({withSummaries})
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-3">
              {students.map((student) => (
                <SummaryCard
                  key={student.id}
                  student={student}
                  onGenerate={(id) => {
                    const s = students.find((st) => st.id === id);
                    if (s) generateForStudent(s);
                  }}
                  onRemove={removeStudent}
                />
              ))}
            </div>
          </div>
        )}

        {students.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-8">
            Dodaj pierwszego ucznia powyżej
          </p>
        )}
      </div>
    </main>
  );
}
