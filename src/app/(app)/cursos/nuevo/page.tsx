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
        <section className="app-card rounded-3xl border-dashed p-8 text-center">
          <p className="text-muted text-lg">Primero cree un año lectivo para este curso.</p>
          <div className="mt-5"><SecondaryLink href="/anos-lectivos/nuevo">Crear año lectivo</SecondaryLink></div>
          <Link className="text-accent mt-5 inline-block font-medium underline" href="/">Volver a mis cursos</Link>
        </section>
      ) : (
        <section className="app-card rounded-3xl p-6"><CourseForm years={years} /></section>
      )}
    </div>
  );
}
