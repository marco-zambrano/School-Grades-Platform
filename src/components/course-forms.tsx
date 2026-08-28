"use client";

import { useActionState } from "react";
import {
  copyCourseToYear,
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
      {state.error ? <p className="font-medium text-rose-700">{state.error}</p> : null}
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
        <span className="mb-1 block text-lg font-medium text-slate-800">Año lectivo</span>
        <select name="schoolYearId" required className="w-full rounded-xl border-2 border-slate-300 bg-white px-4 py-3 text-lg outline-none focus:border-sky-600">
          <option value="">Elija un año</option>
          {years.map((year) => <option key={year.id} value={year.id}>{year.label}</option>)}
        </select>
      </label>
      <Field label="Grado" name="gradeLabel" required placeholder="5.º EGB" />
      <Field label="Paralelo" name="parallel" required placeholder="A" />
      {state.error ? <p className="font-medium text-rose-700">{state.error}</p> : null}
      <PrimaryButton type="submit">Crear curso</PrimaryButton>
    </form>
  );
}

export function CopyCourseForm({
  courseId,
  years,
}: {
  courseId: string;
  years: { id: string; label: string }[];
}) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    async (_previous, formData) => (await copyCourseToYear(formData)) ?? {},
    {},
  );
  return (
    <form action={formAction} className="mt-3 flex flex-wrap items-end gap-3">
      <input type="hidden" name="courseId" value={courseId} />
      <label className="min-w-52 flex-1">
        <span className="mb-1 block font-medium">Nuevo año lectivo</span>
        <select name="schoolYearId" required className="w-full rounded-xl border-2 border-slate-300 bg-white px-3 py-2 outline-none focus:border-sky-600">
          <option value="">Elija un año</option>
          {years.map((year) => <option key={year.id} value={year.id}>{year.label}</option>)}
        </select>
      </label>
      <PrimaryButton type="submit">Copiar curso y nómina</PrimaryButton>
      {state.error ? <p className="w-full font-medium text-rose-700">{state.error}</p> : null}
    </form>
  );
}
