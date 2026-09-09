import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { LoginForm } from "@/components/auth-forms";
import { connection } from "next/server";
import { ThemeToggle } from "@/components/theme-toggle";

export default async function LoginPage() {
  await connection();
  if (await auth()) redirect("/");
  return (
    <div className="app-shell flex min-h-screen items-center justify-center p-4 sm:p-8">
      <div className="app-card w-full max-w-md rounded-3xl p-7 sm:p-9">
        <div className="mb-8 flex items-center justify-between gap-4">
          <span className="text-sm font-bold tracking-wide text-accent">LIBRETA DE NOTAS</span>
          <ThemeToggle />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Entrar</h1>
        <p className="text-muted mt-2 text-lg">
          Esta libreta es personal: solo verá sus cursos y sus estudiantes.
        </p>
        <div className="mt-7">
          <LoginForm />
        </div>
        <p className="mt-7 text-lg">
          ¿Aún no tiene cuenta?{" "}
          <Link href="/registrarse" className="text-accent font-semibold underline underline-offset-4">
            Crear una
          </Link>
        </p>
      </div>
    </div>
  );
}
