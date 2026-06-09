"use client";

import { useState } from "react";

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
  onAdd: (subject: string) => void;
  onRemove: (subject: string) => void;
}

export function SubjectManager({ subjects, onAdd, onRemove }: Props) {
  const [newSubject, setNewSubject] = useState("");

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = newSubject.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setNewSubject("");
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
      <h2 className="font-semibold text-gray-800">Przedmioty</h2>

      <div className="flex flex-wrap gap-2">
        {subjects.map((subject) => (
          <span
            key={subject}
            className="flex items-center gap-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg px-3 py-1"
          >
            {subject}
            <button
              onClick={() => onRemove(subject)}
              disabled={subjects.length <= 1}
              className="text-gray-400 hover:text-red-500 disabled:opacity-30 leading-none"
              title="Usuń przedmiot"
            >
              ×
            </button>
          </span>
        ))}
      </div>

      <datalist id="subject-suggestions">
        {SUBJECT_SUGGESTIONS.filter((s) => !subjects.includes(s)).map((s) => (
          <option key={s} value={s} />
        ))}
      </datalist>

      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          type="text"
          list="subject-suggestions"
          value={newSubject}
          onChange={(e) => setNewSubject(e.target.value)}
          placeholder="Dodaj przedmiot…"
          spellCheck
          lang="pl"
          className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={!newSubject.trim()}
          className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg px-3 py-1.5 transition-colors disabled:opacity-40 shrink-0"
        >
          + Dodaj
        </button>
      </form>
    </div>
  );
}
