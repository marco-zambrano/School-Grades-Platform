"use server";

import { hash } from "bcryptjs";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth, signIn, signOut } from "@/auth";
import { seedCourseGradebooks } from "@/lib/bootstrap-course";
import { parseGradeInput } from "@/lib/grades";
import { prisma } from "@/lib/prisma";
import { APORTE_TYPES, type ActivityType } from "@/lib/subjects";

export type ActionState = { error?: string };

async function teacherId() {
  const session = await auth();
  if (!session?.user?.id) redirect("/entrar");
  return session.user.id;
}

export async function registerTeacher(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!name || !email || password.length < 6) {
    return { error: "Complete nombre, correo y una contraseña de al menos 6 caracteres." };
  }
  const exists = await prisma.teacher.findUnique({ where: { email } });
  if (exists) {
    return { error: "Ese correo ya está registrado. Entre con su cuenta." };
  }
  const passwordHash = await hash(password, 10);
  await prisma.teacher.create({ data: { name, email, passwordHash } });
  try {
    await signIn("credentials", { email, password, redirectTo: "/" });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "La cuenta se creó, pero no se pudo entrar. Intente en Entrar." };
    }
    throw error;
  }
}

export async function loginTeacher(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  try {
    await signIn("credentials", { email, password, redirectTo: "/" });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Correo o contraseña incorrectos." };
    }
    throw error;
  }
}

export async function logoutTeacher() {
  await signOut({ redirectTo: "/entrar" });
}

export async function createSchoolYear(formData: FormData) {
  const id = await teacherId();
  const label = String(formData.get("label") ?? "").trim();
  if (!label) return { error: "Escriba el año lectivo, por ejemplo 2026-2027." };
  try {
    await prisma.schoolYear.create({ data: { teacherId: id, label } });
  } catch {
    return { error: "Ese año lectivo ya existe en su cuenta." };
  }
  revalidatePath("/");
  redirect("/");
}

export async function createCourse(formData: FormData) {
  const id = await teacherId();
  const schoolYearId = String(formData.get("schoolYearId") ?? "");
  const gradeLabel = String(formData.get("gradeLabel") ?? "").trim();
  const parallel = String(formData.get("parallel") ?? "").trim().toUpperCase();
  if (!schoolYearId || !gradeLabel || !parallel) {
    return { error: "Elija el año y complete grado y paralelo." };
  }
  const year = await prisma.schoolYear.findFirst({
    where: { id: schoolYearId, teacherId: id },
  });
  if (!year) return { error: "No se encontró ese año lectivo." };
  let course;
  try {
    course = await prisma.course.create({
      data: { schoolYearId, gradeLabel, parallel },
    });
  } catch {
    return { error: "Ese curso ya existe en el año lectivo seleccionado." };
  }
  await seedCourseGradebooks(course.id);
  revalidatePath("/");
  redirect(`/cursos/${course.id}`);
}

export async function addStudent(courseId: string, formData: FormData) {
  const id = await teacherId();
  const fullName = String(formData.get("fullName") ?? "").trim();
  if (!fullName) return { error: "Escriba el nombre del estudiante." };
  const course = await prisma.course.findFirst({
    where: { id: courseId, schoolYear: { teacherId: id } },
    include: { students: { orderBy: { sortOrder: "desc" }, take: 1 } },
  });
  if (!course) return { error: "Curso no encontrado." };
  const nextOrder = (course.students[0]?.sortOrder ?? 0) + 1;
  await prisma.student.create({
    data: { courseId, fullName, sortOrder: nextOrder },
  });
  revalidatePath(`/cursos/${courseId}`);
}

export async function deleteStudent(studentId: string) {
  const id = await teacherId();
  const student = await prisma.student.findFirst({
    where: { id: studentId, course: { schoolYear: { teacherId: id } } },
  });
  if (!student) return;
  await prisma.student.delete({ where: { id: studentId } });
  revalidatePath(`/cursos/${student.courseId}`);
}

export async function addActivity(
  subjectGradebookId: string,
  formData: FormData,
) {
  const id = await teacherId();
  const name = String(formData.get("name") ?? "").trim();
  const type = String(formData.get("type") ?? "") as ActivityType;
  if (!name) return { error: "Escriba el nombre de la actividad." };
  if (!APORTE_TYPES.includes(type)) {
    return { error: "Elija si es individual o grupal." };
  }
  const book = await prisma.subjectGradebook.findFirst({
    where: {
      id: subjectGradebookId,
      trimester: { course: { schoolYear: { teacherId: id } } },
    },
    include: { activities: true, trimester: true },
  });
  if (!book) return { error: "Materia no encontrada." };
  const aportes = book.activities.filter((a) =>
    APORTE_TYPES.includes(a.type as ActivityType),
  );
  const maxOrder = aportes.reduce((m, a) => Math.max(m, a.sortOrder), -1);
  await prisma.activity.create({
    data: {
      subjectGradebookId,
      name,
      type,
      sortOrder: maxOrder + 1,
      locked: false,
    },
  });
  revalidatePath(
    `/cursos/${book.trimester.courseId}/trimestres/${book.trimester.number}/${book.subjectCode}`,
  );
}

export async function deleteActivity(activityId: string) {
  const id = await teacherId();
  const activity = await prisma.activity.findFirst({
    where: {
      id: activityId,
      subjectGradebook: {
        trimester: { course: { schoolYear: { teacherId: id } } },
      },
    },
    include: { subjectGradebook: { include: { trimester: true } } },
  });
  if (!activity || activity.locked) return { error: "No se puede borrar esta actividad." };
  await prisma.activity.delete({ where: { id: activityId } });
  revalidatePath(
    `/cursos/${activity.subjectGradebook.trimester.courseId}/trimestres/${activity.subjectGradebook.trimester.number}/${activity.subjectGradebook.subjectCode}`,
  );
}

export async function saveGrade(input: {
  activityId: string;
  studentId: string;
  raw: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const id = await teacherId();
  const parsed = parseGradeInput(input.raw);
  if (!parsed.ok) return parsed;
  const activity = await prisma.activity.findFirst({
    where: {
      id: input.activityId,
      subjectGradebook: {
        trimester: { course: { schoolYear: { teacherId: id } } },
      },
    },
    include: { subjectGradebook: { include: { trimester: true } } },
  });
  const student = await prisma.student.findFirst({
    where: {
      id: input.studentId,
      course: { schoolYear: { teacherId: id } },
    },
  });
  if (
    !activity ||
    !student ||
    activity.subjectGradebook.trimester.courseId !== student.courseId
  ) {
    return { ok: false, error: "No se pudo guardar la nota." };
  }
  const path = `/cursos/${student.courseId}/trimestres/${activity.subjectGradebook.trimester.number}/${activity.subjectGradebook.subjectCode}`;
  if (parsed.value === null) {
    await prisma.grade.deleteMany({
      where: { activityId: input.activityId, studentId: input.studentId },
    });
    revalidatePath(path);
    return { ok: true };
  }
  await prisma.grade.upsert({
    where: {
      activityId_studentId: {
        activityId: input.activityId,
        studentId: input.studentId,
      },
    },
    create: {
      activityId: input.activityId,
      studentId: input.studentId,
      value: parsed.value,
    },
    update: { value: parsed.value },
  });
  revalidatePath(path);
  return { ok: true };
}
