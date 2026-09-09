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

      {years.length === 0 ? (
        <div className="app-card rounded-3xl border-dashed p-10 text-center">
          <p className="text-muted text-xl">
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
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {years.map((year) => (
            <section key={year.id} className="app-card rounded-3xl p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-xl font-bold">{year.label}</h2>
                <span className="text-muted text-sm font-semibold">{year.courses.length} curso{year.courses.length === 1 ? "" : "s"}</span>
              </div>
              {year.courses.length ? (
                <div className="grid gap-3">
                  {year.courses.map((course) => (
                    <CardLink
                      key={course.id}
                      href={`/cursos/${course.id}`}
                      title={courseTitle(course.gradeLabel, course.parallel, year.label)}
                      description="Nómina, trimestres y materias"
                    />
                  ))}
                </div>
              ) : (
                <p className="text-muted rounded-2xl border border-dashed p-4 text-sm">Aún no hay cursos en este año lectivo.</p>
              )}
            </section>
          ))}
        </div>
      )}
    </>
  );
}
