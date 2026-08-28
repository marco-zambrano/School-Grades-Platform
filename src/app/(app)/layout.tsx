import { logoutTeacher } from "@/app/actions";
import { auth } from "@/auth";
import Link from "next/link";
import { connection } from "next/server";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: LayoutProps<"/">) {
  await connection();
  const session = await auth();

  return (
    <div className="min-h-full">
      {session?.user ? (
        <nav className="border-b-2 border-slate-200 bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
            <Link href="/" className="text-xl font-bold text-sky-800">
              Libreta de notas
            </Link>
            <div className="flex items-center gap-4">
              <span className="hidden text-base text-slate-600 sm:inline">
                {session.user.name}
              </span>
              <form action={logoutTeacher}>
                <button
                  type="submit"
                  className="rounded-xl px-3 py-2 text-base font-semibold text-slate-700 hover:bg-slate-100"
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
