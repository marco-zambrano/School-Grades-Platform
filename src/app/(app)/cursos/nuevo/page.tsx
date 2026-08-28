import Link from "next/link";
import { CourseForm } from "@/components/course-forms";
import { PageHeader, SecondaryLink } from "@/components/ui";
import { prisma } from "@/lib/prisma";
import { requireTeacher } from "@/lib/session";
import { connection } from "next/server";

export const dynamic = "force-dynamic";

export default async function NewCoursePage() {
  await connection();
  const user = await requireTeacher();
  const years = await prisma.schoolYear.findMany({
    where: { teacherId: user.id },
    orderBy: { label: "desc" },
    select: { id: true, label: true },
  });

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader title="Nuevo curso" subtitle="Al crearlo se preparan los tres trimestres y las materias." backHref="/" />
      {years.length === 0 ? (
        <section className="rounded-3xl border-2 border-dashed border-slate-300 bg-white p-8 text-center">
          <p className="text-lg text-slate-700">Primero cree un año lectivo para este curso.</p>
          <div className="mt-5"><SecondaryLink href="/anos-lectivos/nuevo">Crear año lectivo</SecondaryLink></div>
          <Link className="mt-5 inline-block font-medium text-sky-800 underline" href="/">Volver a mis cursos</Link>
        </section>
      ) : (
        <section className="rounded-3xl border-2 border-slate-200 bg-white p-6 shadow-sm"><CourseForm years={years} /></section>
      )}
    </div>
  );
}
