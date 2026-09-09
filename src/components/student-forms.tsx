"use client";

import { useActionState } from "react";
import { addStudent, type ActionState } from "@/app/actions";
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
          className="form-control w-full rounded-xl px-4 py-3 text-lg outline-none"
        />
      </label>
      <PrimaryButton type="submit">Añadir a la nómina</PrimaryButton>
      {state?.error ? (
        <p className="font-medium text-rose-400 sm:self-center">{state.error}</p>
      ) : null}
    </form>
  );
}
