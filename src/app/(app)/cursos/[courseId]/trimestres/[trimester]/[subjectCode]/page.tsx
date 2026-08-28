import { notFound } from "next/navigation";
import { AddActivityForm, DeleteActivityButton } from "@/components/add-activity-form";
import { GradeInput } from "@/components/grade-input";
import { PageHeader } from "@/components/ui";
import { formatGrade, needsMoreAportes, summarizeStudent } from "@/lib/grades";
import { getOwnedSubject } from "@/lib/queries";
import { requireTeacher } from "@/lib/session";
import { isSubjectCode, subjectName, trimesterLabel } from "@/lib/subjects";
import { connection } from "next/server";

export const dynamic = "force-dynamic";

export default async function SubjectPage({
  params,
}: PageProps<"/cursos/[courseId]/trimestres/[trimester]/[subjectCode]">) {
  const { courseId, trimester: trimesterParam, subjectCode } = await params;
  const trimester = Number(trimesterParam);
  if (!Number.isInteger(trimester) || trimester < 1 || trimester > 3 || !isSubjectCode(subjectCode)) notFound();

  await connection();
  const user = await requireTeacher();
  const subject = await getOwnedSubject(user.id, courseId, trimester, subjectCode);
  const { course } = subject.trimester;
  const hasEnoughAportes = !needsMoreAportes(subject.activities);
  const gradesByActivity = new Map(
    subject.activities.map((activity) => [
      activity.id,
      new Map(activity.grades.map((grade) => [grade.studentId, grade.value])),
    ]),
  );

  return (
    <>
      <PageHeader
        title={subjectName(subject.subjectCode)}
        subtitle={`${course.gradeLabel} ${course.parallel} · ${trimesterLabel(trimester)}. Las notas van de 0 a 10.`}
        backHref={`/cursos/${courseId}`}
        backLabel="Volver al curso"
      />
      {!hasEnoughAportes ? <p className="mb-5 rounded-2xl border-2 border-amber-200 bg-amber-50 p-4 font-medium text-amber-950">Faltan actividades de aporte: se recomiendan al menos 9 entre individuales y grupales.</p> : null}
      <div className="overflow-x-auto rounded-3xl border-2 border-slate-200 bg-white shadow-sm">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="bg-slate-100 text-slate-800">
            <tr>
              <th className="sticky left-0 z-10 min-w-52 bg-slate-100 p-3">Estudiante</th>
              {subject.activities.map((activity) => <th key={activity.id} className="min-w-28 p-3 text-center"><span className="block">{activity.name}</span><span className="mt-1 block text-xs font-normal text-slate-500">{activity.type.replaceAll("_", " ")}</span></th>)}
              <th className="min-w-24 p-3 text-center">Aportes 70%</th>
              <th className="min-w-24 p-3 text-center">Evaluación 30%</th>
              <th className="min-w-24 p-3 text-center">Promedio</th>
            </tr>
          </thead>
          <tbody>
            {course.students.map((student) => {
              const scores = subject.activities.map((activity) => ({ type: activity.type, value: gradesByActivity.get(activity.id)?.get(student.id) ?? null }));
              const summary = summarizeStudent(scores);
              return <tr key={student.id} className="border-t border-slate-200">
                <th className="sticky left-0 z-10 bg-white p-3 font-semibold">{student.fullName}</th>
                {subject.activities.map((activity) => <td key={activity.id} className="p-2"><GradeInput activityId={activity.id} studentId={student.id} initial={gradesByActivity.get(activity.id)?.get(student.id) ?? null} /></td>)}
                <td className="p-3 text-center tabular-nums">{formatGrade(summary.aportes70)}</td>
                <td className="p-3 text-center tabular-nums">{formatGrade(summary.eval30)}</td>
                <td className="p-3 text-center font-bold tabular-nums">{formatGrade(summary.finalAverage)}</td>
              </tr>;
            })}
          </tbody>
        </table>
      </div>
      {course.students.length === 0 ? <p className="mt-4 text-slate-600">Añada estudiantes a la nómina antes de registrar notas.</p> : null}
      <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_26rem]">
        <div className="rounded-3xl border-2 border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">Actividades configuradas</h2>
          <ul className="mt-3 space-y-2">
            {subject.activities.map((activity) => <li key={activity.id} className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2"><span>{activity.name}{activity.locked ? <span className="ml-2 text-sm text-slate-500">(predeterminada)</span> : null}</span>{!activity.locked ? <DeleteActivityButton activityId={activity.id} /> : null}</li>)}
          </ul>
        </div>
        <AddActivityForm subjectGradebookId={subject.id} />
      </section>
    </>
  );
}
