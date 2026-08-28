import { requireTeacher } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { CardLink, PageHeader, SecondaryLink } from "@/components/ui";
import { courseTitle } from "@/lib/subjects";
import { connection } from "next/server";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  await connection();
  const user = await requireTeacher();
  const years = await prisma.schoolYear.findMany({
    where: { teacherId: user.id },
    orderBy: { label: "desc" },
    include: { courses: { orderBy: { gradeLabel: "asc" } } },
  });

  const courses = years.flatMap((y) =>
    y.courses.map((c) => ({
      ...c,
      yearLabel: y.label,
    })),
  );

  return (
    <>
      <PageHeader
        title="Mis cursos"
        subtitle="Elija un curso para ver la nómina, los trimestres y las materias."
        actions={
          <>
            <SecondaryLink href="/anos-lectivos/nuevo">Año lectivo</SecondaryLink>
            <SecondaryLink href="/cursos/nuevo" color="emerald">
              Nuevo curso
            </SecondaryLink>
          </>
        }
      />

      {courses.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="text-xl text-slate-700">
            Todavía no hay cursos. Primero cree un año lectivo y luego un curso,
            por ejemplo 5.º EGB paralelo A.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <SecondaryLink href="/anos-lectivos/nuevo">
              Crear año lectivo
            </SecondaryLink>
            <SecondaryLink href="/cursos/nuevo" color="emerald">
              Crear curso
            </SecondaryLink>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {courses.map((course) => (
            <CardLink
              key={course.id}
              href={`/cursos/${course.id}`}
              title={courseTitle(course.gradeLabel, course.parallel, course.yearLabel)}
              description="Nómina, trimestres y materias"
            />
          ))}
        </div>
      )}
    </>
  );
}
