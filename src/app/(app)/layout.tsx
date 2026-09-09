import { logoutTeacher } from "@/app/actions";
import { auth } from "@/auth";
import Link from "next/link";
import { connection } from "next/server";
import { ThemeToggle } from "@/components/theme-toggle";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: LayoutProps<"/">) {
  await connection();
  const session = await auth();

  return (
    <div className="app-shell min-h-full">
      {session?.user ? (
        <nav className="app-nav">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
            <Link href="/" className="text-xl font-bold tracking-tight text-accent">
              Libreta de notas
            </Link>
            <div className="flex items-center gap-4">
              <span className="hidden text-base text-muted sm:inline">
                {session.user.name}
              </span>
              <ThemeToggle />
              <form action={logoutTeacher}>
                <button
                  type="submit"
                  className="btn-secondary rounded-xl px-3 py-2 text-base font-semibold"
                >
                  Salir
                </button>
              </form>
            </div>
          </div>
        </nav>
      ) : null}
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
