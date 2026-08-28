import { prisma } from "./prisma";
import {
  ACTIVITY_TYPES,
  DEFAULT_INDIVIDUAL_ACTIVITIES,
  REFUERZO_ACTIVITIES,
  SUBJECTS,
  TRIMESTERS,
} from "./subjects";

export async function seedCourseGradebooks(courseId: string) {
  for (const number of TRIMESTERS) {
    const trimester = await prisma.trimesterGradebook.create({
      data: { courseId, number },
    });
    for (const subject of SUBJECTS) {
      const subjectBook = await prisma.subjectGradebook.create({
        data: {
          trimesterId: trimester.id,
          subjectCode: subject.code,
        },
      });
      let order = 0;
      for (const name of DEFAULT_INDIVIDUAL_ACTIVITIES) {
        await prisma.activity.create({
          data: {
            subjectGradebookId: subjectBook.id,
            name,
            type: ACTIVITY_TYPES.INDIVIDUAL,
            sortOrder: order++,
            locked: false,
          },
        });
      }
      await prisma.activity.create({
        data: {
          subjectGradebookId: subjectBook.id,
          name: "Proyecto interdisciplinar",
          type: ACTIVITY_TYPES.PROYECTO,
          sortOrder: 100,
          locked: true,
        },
      });
      await prisma.activity.create({
        data: {
          subjectGradebookId: subjectBook.id,
          name: "Evaluación sumativa",
          type: ACTIVITY_TYPES.SUMATIVA,
          sortOrder: 101,
          locked: true,
        },
      });
      let refuerzoOrder = 200;
      for (const item of REFUERZO_ACTIVITIES) {
        await prisma.activity.create({
          data: {
            subjectGradebookId: subjectBook.id,
            name: item.name,
            type: item.type,
            sortOrder: refuerzoOrder++,
            locked: true,
          },
        });
      }
    }
  }
}
