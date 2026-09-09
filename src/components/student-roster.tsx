"use client";

import { useState } from "react";
import { deleteStudent } from "@/app/actions";
import { AddStudentForm } from "./student-forms";

type RosterStudent = { id: string; fullName: string };

export function StudentRoster({
  courseId,
  students,
}: {
  courseId: string;
  students: RosterStudent[];
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="app-card rounded-3xl p-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Nómina</h2>
          <p className="text-muted mt-1">Los estudiantes se guardan al añadirlos.</p>
        </div>
        <span className="text-accent text-sm font-semibold">
          {students.length} estudiante{students.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="mt-5">
        <AddStudentForm courseId={courseId} />
      </div>

      {students.length === 0 ? (
        <p className="text-muted mt-6">Aún no hay estudiantes en la nómina.</p>
      ) : (
        <>
          <button
            type="button"
            className="btn-secondary mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl px-4 py-2.5 font-semibold"
            aria-expanded={expanded}
            aria-controls="student-roster-list"
            onClick={() => setExpanded((current) => !current)}
          >
            <span aria-hidden="true">{expanded ? "⌃" : "⌄"}</span>
            {expanded ? "Ocultar estudiantes" : "Desplegar estudiantes"}
          </button>

          {expanded ? (
            <ol id="student-roster-list" className="mt-4 divide-y divide-[var(--border)] overflow-hidden rounded-2xl border">
              {students.map((student, index) => (
                <li key={student.id} className="app-card-muted flex min-h-14 items-center gap-3 px-4 py-2.5">
                  <span className="text-muted flex size-8 shrink-0 items-center justify-center rounded-full border text-sm font-semibold">
                    {index + 1}
                  </span>
                  <span className="min-w-0 flex-1 truncate font-semibold">{student.fullName}</span>
                  <form action={deleteStudent.bind(null, student.id)}>
                    <button type="submit" className="rounded-xl px-2 py-1.5 text-sm font-semibold text-rose-400 hover:bg-rose-950/30">
                      Eliminar
                    </button>
                  </form>
                </li>
              ))}
            </ol>
          ) : null}
        </>
      )}
    </section>
  );
}
