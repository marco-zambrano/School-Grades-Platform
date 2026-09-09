import Link from "next/link";
import { StudentRoster } from "@/components/student-roster";
import { PageHeader } from "@/components/ui";
import { getOwnedCourse } from "@/lib/queries";
import { requireTeacher } from "@/lib/session";
import { SUBJECTS, courseTitle, trimesterLabel } from "@/lib/subjects";
import { connection } from "next/server";

export const dynamic = "force-dynamic";

export default async function CoursePage({
  params,
}: PageProps<"/cursos/[courseId]">) {
  const { courseId } = await params;
  await connection();
  const user = await requireTeacher();
  const course = await getOwnedCourse(user.id, courseId);

  return (
    <>
      <PageHeader
        title={courseTitle(course.gradeLabel, course.parallel, course.schoolYear.label)}
        subtitle="Administre la nómina y abra la libreta por trimestre y materia."
        backHref="/"
        actions={<a href={`/api/cursos/${course.id}/exportar`} className="btn-primary inline-flex min-h-12 items-center justify-center rounded-2xl px-5 py-3 text-lg font-semibold">Exportar Excel</a>}
      />
      <StudentRoster courseId={course.id} students={course.students} />
      <section className="mt-8">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Trimestres</h2>
            <p className="text-muted mt-1">Abra una materia para registrar las calificaciones.</p>
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {course.trimesters.map((trimester) => (
            <section key={trimester.id} className="app-card rounded-3xl p-5">
              <h2 className="text-xl font-bold">{trimesterLabel(trimester.number)}</h2>
              <div className="mt-3 grid gap-2">
                {SUBJECTS.map((subject) => (
                  <Link key={subject.code} href={`/cursos/${course.id}/trimestres/${trimester.number}/${subject.code}`} className="btn-secondary rounded-xl px-3 py-2 font-semibold">
                    {subject.name}
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </>
  );
}
