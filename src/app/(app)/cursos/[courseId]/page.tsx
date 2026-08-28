import Link from "next/link";
import { deleteStudent } from "@/app/actions";
import { CopyCourseForm } from "@/components/course-forms";
import { AddStudentForm, EditStudentForm } from "@/components/student-forms";
import { PageHeader } from "@/components/ui";
import { getOwnedCourse } from "@/lib/queries";
import { prisma } from "@/lib/prisma";
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
  const [course, years] = await Promise.all([
    getOwnedCourse(user.id, courseId),
    prisma.schoolYear.findMany({
      where: { teacherId: user.id },
      orderBy: { label: "desc" },
      select: { id: true, label: true },
    }),
  ]);
  const targetYears = years.filter((year) => year.id !== course.schoolYearId);

  return (
    <>
      <PageHeader
        title={courseTitle(course.gradeLabel, course.parallel, course.schoolYear.label)}
        subtitle="Administre la nómina y abra la libreta por trimestre y materia."
        backHref="/"
        actions={<a href={`/api/cursos/${course.id}/exportar`} className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-emerald-700 px-5 py-3 text-lg font-semibold text-white shadow-sm hover:bg-emerald-800">Exportar Excel</a>}
      />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <section className="space-y-5">
          <div className="rounded-3xl border-2 border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold">Nómina</h2>
            <div className="mt-5"><AddStudentForm courseId={course.id} /></div>
            {course.students.length === 0 ? (
              <p className="mt-6 text-slate-600">Aún no hay estudiantes en la nómina.</p>
            ) : (
              <ol className="mt-6 space-y-3">
                {course.students.map((student, index) => (
                  <li key={student.id} className="flex flex-col gap-2 rounded-2xl bg-slate-50 p-3 sm:flex-row sm:items-center">
                    <span className="w-8 font-semibold text-slate-500">{index + 1}.</span>
                    <EditStudentForm studentId={student.id} fullName={student.fullName} />
                    <form action={deleteStudent.bind(null, student.id)}>
                      <button type="submit" className="rounded-xl px-3 py-2 font-semibold text-rose-700 hover:bg-rose-50">Eliminar</button>
                    </form>
                  </li>
                ))}
              </ol>
            )}
          </div>
          <div className="rounded-3xl border-2 border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold">Copiar al siguiente año</h2>
            <p className="mt-1 text-slate-600">Copia la estructura y la nómina, sin las notas.</p>
            {targetYears.length ? <CopyCourseForm courseId={course.id} years={targetYears} /> : <p className="mt-3 text-slate-600">Cree otro año lectivo para habilitar esta opción.</p>}
          </div>
        </section>
        <aside className="space-y-5">
          {course.trimesters.map((trimester) => (
            <section key={trimester.id} className="rounded-3xl border-2 border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-bold">{trimesterLabel(trimester.number)}</h2>
              <div className="mt-3 grid gap-2">
                {SUBJECTS.map((subject) => (
                  <Link key={subject.code} href={`/cursos/${course.id}/trimestres/${trimester.number}/${subject.code}`} className="rounded-xl bg-sky-50 px-3 py-2 font-semibold text-sky-900 hover:bg-sky-100">
                    {subject.name}
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </aside>
      </div>
    </>
  );
}
