import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { LoginForm } from "@/components/auth-forms";
import { connection } from "next/server";

export default async function LoginPage() {
  await connection();
  if (await auth()) redirect("/");
  return (
    <div className="mx-auto max-w-md rounded-3xl border-2 border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-3xl font-bold">Entrar</h1>
      <p className="mt-2 text-lg text-slate-600">
        Esta libreta es personal: solo verá sus cursos y sus estudiantes.
      </p>
      <div className="mt-6">
        <LoginForm />
      </div>
      <p className="mt-6 text-lg">
        ¿Aún no tiene cuenta?{" "}
        <Link href="/registrarse" className="font-semibold text-sky-800 underline">
          Crear una
        </Link>
      </p>
    </div>
  );
}
