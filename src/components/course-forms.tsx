"use client";

import { useActionState } from "react";
import {
  createCourse,
  createSchoolYear,
  type ActionState,
} from "@/app/actions";
import { Field, PrimaryButton } from "./ui";

export function SchoolYearForm() {
  const [state, formAction] = useActionState<ActionState, FormData>(
    async (_previous, formData) => (await createSchoolYear(formData)) ?? {},
    {},
  );
  return (
    <form action={formAction} className="space-y-5">
      <Field label="Año lectivo" name="label" required placeholder="2026-2027" />
      {state.error ? <p className="font-medium text-rose-400">{state.error}</p> : null}
      <PrimaryButton type="submit">Crear año lectivo</PrimaryButton>
    </form>
  );
}

export function CourseForm({
  years,
}: {
  years: { id: string; label: string }[];
}) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    async (_previous, formData) => (await createCourse(formData)) ?? {},
    {},
  );
  return (
    <form action={formAction} className="space-y-5">
      <label className="block">
        <span className="mb-1 block text-lg font-medium">Año lectivo</span>
        <select name="schoolYearId" required className="form-control w-full rounded-xl px-4 py-3 text-lg outline-none">
          <option value="">Elija un año</option>
          {years.map((year) => <option key={year.id} value={year.id}>{year.label}</option>)}
        </select>
      </label>
      <Field label="Grado" name="gradeLabel" required placeholder="5.º EGB" />
      <Field label="Paralelo" name="parallel" required placeholder="A" />
      {state.error ? <p className="font-medium text-rose-400">{state.error}</p> : null}
      <PrimaryButton type="submit">Crear curso</PrimaryButton>
    </form>
  );
}
