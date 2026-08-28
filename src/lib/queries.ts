import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export async function getOwnedCourse(teacherId: string, courseId: string) {
  const course = await prisma.course.findFirst({
    where: { id: courseId, schoolYear: { teacherId } },
    include: {
      schoolYear: true,
      students: { orderBy: { sortOrder: "asc" } },
      trimesters: { orderBy: { number: "asc" } },
    },
  });
  if (!course) notFound();
  return course;
}

export async function getOwnedSubject(
  teacherId: string,
  courseId: string,
  trimesterNumber: number,
  subjectCode: string,
) {
  const subject = await prisma.subjectGradebook.findFirst({
    where: {
      subjectCode,
      trimester: {
        number: trimesterNumber,
        courseId,
        course: { schoolYear: { teacherId } },
      },
    },
    include: {
      activities: {
        orderBy: { sortOrder: "asc" },
        include: { grades: true },
      },
      trimester: {
        include: {
          course: {
            include: {
              schoolYear: true,
              students: { orderBy: { sortOrder: "asc" } },
            },
          },
        },
      },
    },
  });
  if (!subject) notFound();
  return subject;
}
