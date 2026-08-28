import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { RegisterForm } from "@/components/auth-forms";
import { connection } from "next/server";

export default async function RegisterPage() {
  await connection();
  if (await auth()) redirect("/");
  return (
    <div className="mx-auto max-w-md rounded-3xl border-2 border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-3xl font-bold">Crear mi cuenta</h1>
      <p className="mt-2 text-lg text-slate-600">
        Cada docente tiene su propia libreta. Un colega puede registrarse por
        separado.
      </p>
      <div className="mt-6">
        <RegisterForm />
      </div>
      <p className="mt-6 text-lg">
        ¿Ya tiene cuenta?{" "}
        <Link href="/entrar" className="font-semibold text-sky-800 underline">
          Entrar
        </Link>
      </p>
    </div>
  );
}
