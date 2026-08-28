"use client";

import { useActionState } from "react";
import { addStudent, updateStudent, type ActionState } from "@/app/actions";
import { PrimaryButton } from "./ui";

export function AddStudentForm({ courseId }: { courseId: string }) {
  const action = addStudent.bind(null, courseId);
  const [state, formAction] = useActionState<ActionState, FormData>(
    async (_prev, formData) => {
      return (await action(formData)) ?? {};
    },
    {},
  );

  return (
    <form action={formAction} className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <label className="block flex-1">
        <span className="mb-1 block text-lg font-medium">Nombre completo</span>
        <input
          name="fullName"
          required
          placeholder="Apellidos y nombres"
          className="w-full rounded-xl border-2 border-slate-300 px-4 py-3 text-lg outline-none focus:border-sky-600"
        />
      </label>
      <PrimaryButton type="submit">Añadir a la nómina</PrimaryButton>
      {state?.error ? (
        <p className="font-medium text-rose-700 sm:self-center">{state.error}</p>
      ) : null}
    </form>
  );
}

export function EditStudentForm({
  studentId,
  fullName,
}: {
  studentId: string;
  fullName: string;
}) {
  const action = updateStudent.bind(null, studentId);
  const [state, formAction] = useActionState<ActionState, FormData>(
    async (_prev, formData) => (await action(formData)) ?? {},
    {},
  );
  return (
    <form action={formAction} className="flex flex-1 flex-wrap gap-2">
      <input
        name="fullName"
        defaultValue={fullName}
        className="w-full rounded-xl border-2 border-slate-300 px-3 py-2 text-lg outline-none focus:border-sky-600"
      />
      <button
        type="submit"
        className="rounded-xl bg-slate-200 px-3 py-2 font-semibold text-slate-800 hover:bg-slate-300"
      >
        Guardar
      </button>
      {state.error ? <p className="w-full text-sm font-medium text-rose-700">{state.error}</p> : null}
    </form>
  );
}
