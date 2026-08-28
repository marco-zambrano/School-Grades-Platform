"use client";

import { useActionState } from "react";
import { loginTeacher, registerTeacher, type ActionState } from "@/app/actions";
import { Field, PrimaryButton } from "./ui";

export function LoginForm() {
  const [state, formAction] = useActionState<ActionState, FormData>(
    async (_prev, formData) => {
      return (await loginTeacher(formData)) ?? {};
    },
    {},
  );

  return (
    <form action={formAction} className="space-y-4">
      <Field label="Correo" name="email" type="email" required />
      <Field label="Contraseña" name="password" type="password" required />
      {state?.error ? (
        <p className="text-lg font-medium text-rose-700">{state.error}</p>
      ) : null}
      <PrimaryButton type="submit" className="w-full">
        Entrar
      </PrimaryButton>
    </form>
  );
}

export function RegisterForm() {
  const [state, formAction] = useActionState<ActionState, FormData>(
    async (_prev, formData) => {
      return (await registerTeacher(formData)) ?? {};
    },
    {},
  );

  return (
    <form action={formAction} className="space-y-4">
      <Field label="Su nombre" name="name" required placeholder="Ej. María Pérez" />
      <Field label="Correo" name="email" type="email" required />
      <Field
        label="Contraseña (mínimo 6 caracteres)"
        name="password"
        type="password"
        required
      />
      {state?.error ? (
        <p className="text-lg font-medium text-rose-700">{state.error}</p>
      ) : null}
      <PrimaryButton type="submit" className="w-full">
        Crear mi cuenta
      </PrimaryButton>
    </form>
  );
}
