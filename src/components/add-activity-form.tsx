"use client";

import { useActionState, useState, useTransition } from "react";
import { addActivity, deleteActivity, type ActionState } from "@/app/actions";
import { PrimaryButton } from "./ui";

export function AddActivityForm({
  subjectGradebookId,
}: {
  subjectGradebookId: string;
}) {
  const action = addActivity.bind(null, subjectGradebookId);
  const [state, formAction] = useActionState<ActionState, FormData>(
    async (_prev, formData) => {
      return (await action(formData)) ?? {};
    },
    {},
  );

  return (
    <form
      action={formAction}
      className="app-card rounded-3xl border-dashed p-6"
    >
      <h3 className="text-xl font-bold">Añadir actividad</h3>
      <p className="text-muted mt-1">
        Use esto en lugar de columnas vacías. Ponga el nombre que usa en clase.
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="mb-1 block text-lg font-medium">Nombre</span>
          <input
            name="name"
            required
            placeholder="Ej. Comprensión lectora 2"
            className="form-control w-full rounded-xl px-4 py-3 text-lg outline-none"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1 block text-lg font-medium">Tipo</span>
          <select
            name="type"
            className="form-control w-full rounded-xl px-4 py-3 text-lg outline-none"
            defaultValue="INDIVIDUAL"
          >
            <option value="INDIVIDUAL">Individual</option>
            <option value="GRUPAL">Grupal</option>
          </select>
        </label>
      </div>
      {state?.error ? (
        <p className="mt-3 font-medium text-rose-400">{state.error}</p>
      ) : null}
      <div className="mt-4">
        <PrimaryButton type="submit">Guardar actividad</PrimaryButton>
      </div>
    </form>
  );
}

export function DeleteActivityButton({ activityId }: { activityId: string }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  return (
    <div className="text-right">
      <button
        type="button"
        disabled={pending}
        onClick={() => startTransition(async () => {
          const result = await deleteActivity(activityId);
          setError(result?.error ?? "");
        })}
        className="rounded-lg px-2 py-1 text-sm font-semibold text-rose-400 hover:bg-rose-950/30 disabled:opacity-60"
      >
        {pending ? "Eliminando…" : "Eliminar"}
      </button>
      {error ? <p className="mt-1 text-xs font-medium text-rose-400">{error}</p> : null}
    </div>
  );
}
