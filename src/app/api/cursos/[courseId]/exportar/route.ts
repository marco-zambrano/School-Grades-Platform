import ExcelJS from "exceljs";
import { auth } from "@/auth";
import { formatGrade, summarizeStudent } from "@/lib/grades";
import { prisma } from "@/lib/prisma";
import { subjectName, trimesterLabel } from "@/lib/subjects";

export async function GET(
  _request: Request,
  { params }: RouteContext<"/api/cursos/[courseId]/exportar">,
) {
  const session = await auth();
  const { courseId } = await params;
  if (!session?.user?.id) return new Response("No autorizado", { status: 401 });

  const course = await prisma.course.findFirst({
    where: { id: courseId, schoolYear: { teacherId: session.user.id } },
    include: {
      schoolYear: true,
      students: { orderBy: { sortOrder: "asc" } },
      trimesters: {
        orderBy: { number: "asc" },
        include: {
          subjects: {
            orderBy: { subjectCode: "asc" },
            include: { activities: { orderBy: { sortOrder: "asc" }, include: { grades: true } } },
          },
        },
      },
    },
  });
  if (!course) return new Response("Curso no encontrado", { status: 404 });

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Libreta de notas";
  for (const trimester of course.trimesters) {
    for (const subject of trimester.subjects) {
      const sheet = workbook.addWorksheet(`${trimester.number}-${subject.subjectCode}`.slice(0, 31));
      sheet.addRow([`${course.gradeLabel} ${course.parallel}`, course.schoolYear.label, trimesterLabel(trimester.number), subjectName(subject.subjectCode)]);
      sheet.addRow(["Estudiante", ...subject.activities.map((activity) => activity.name), "Aportes 70%", "Evaluación 30%", "Promedio"]);
      for (const student of course.students) {
        const scores = subject.activities.map((activity) => ({
          type: activity.type,
          value: activity.grades.find((grade) => grade.studentId === student.id)?.value ?? null,
        }));
        const summary = summarizeStudent(scores);
        sheet.addRow([
          student.fullName,
          ...scores.map((score) => score.value ?? ""),
          formatGrade(summary.aportes70),
          formatGrade(summary.eval30),
          formatGrade(summary.finalAverage),
        ]);
      }
      sheet.getRow(1).font = { bold: true, size: 12 };
      sheet.getRow(2).font = { bold: true };
      sheet.views = [{ state: "frozen", ySplit: 2, xSplit: 1 }];
      sheet.columns.forEach((column, index) => {
        column.width = index === 0 ? 28 : 16;
      });
    }
  }
  const file = await workbook.xlsx.writeBuffer();
  const filename = `libreta-${course.gradeLabel}-${course.parallel}-${course.schoolYear.label}.xlsx`.replaceAll(" ", "-");
  return new Response(file, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
