import Link from "next/link";
import { deleteStudent } from "@/app/actions";
import { AddStudentForm } from "@/components/student-forms";
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
      <section className="app-card rounded-3xl p-6">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold">Nómina</h2>
            <p className="text-muted mt-1">Los estudiantes se guardan al añadirlos.</p>
          </div>
          <span className="text-accent text-sm font-semibold">{course.students.length} estudiante{course.students.length === 1 ? "" : "s"}</span>
        </div>
        <div className="mt-5"><AddStudentForm courseId={course.id} /></div>
        {course.students.length === 0 ? (
          <p className="text-muted mt-6">Aún no hay estudiantes en la nómina.</p>
        ) : (
          <ol className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {course.students.map((student, index) => (
              <li key={student.id} className="app-card-muted flex items-center gap-3 rounded-2xl p-3">
                <span className="text-muted flex size-8 shrink-0 items-center justify-center rounded-full border text-sm font-semibold">{index + 1}</span>
                <span className="min-w-0 flex-1 truncate font-semibold">{student.fullName}</span>
                <form action={deleteStudent.bind(null, student.id)}>
                  <button type="submit" className="rounded-xl px-2 py-1.5 text-sm font-semibold text-rose-400 hover:bg-rose-950/30">Eliminar</button>
                </form>
              </li>
            ))}
          </ol>
        )}
      </section>
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
