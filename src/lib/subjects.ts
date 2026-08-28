export const SUBJECTS = [
  { code: "LENGUA", name: "Lengua y Literatura" },
  { code: "MATEMATICA", name: "Matemática" },
  { code: "CIENCIAS", name: "Ciencias Naturales" },
  { code: "SOCIALES", name: "Estudios Sociales" },
  { code: "ECA", name: "Educación Cultural y Artística" },
  { code: "ED_FISICA", name: "Educación Física" },
  { code: "INGLES", name: "Inglés" },
] as const;

export type SubjectCode = (typeof SUBJECTS)[number]["code"];

export function subjectName(code: string): string {
  return SUBJECTS.find((s) => s.code === code)?.name ?? code;
}

export function isSubjectCode(value: string): value is SubjectCode {
  return SUBJECTS.some((s) => s.code === value);
}

export const TRIMESTERS = [1, 2, 3] as const;

export function trimesterLabel(n: number): string {
  if (n === 1) return "1.er trimestre";
  if (n === 2) return "2.º trimestre";
  return "3.er trimestre";
}

export const ACTIVITY_TYPES = {
  INDIVIDUAL: "INDIVIDUAL",
  GRUPAL: "GRUPAL",
  PROYECTO: "PROYECTO",
  SUMATIVA: "SUMATIVA",
  REFUERZO_DIRECTA: "REFUERZO_DIRECTA",
  REFUERZO_MEJORA: "REFUERZO_MEJORA",
  REFUERZO_CALIFICACION: "REFUERZO_CALIFICACION",
  REFUERZO_SUPLETORIA: "REFUERZO_SUPLETORIA",
} as const;

export type ActivityType = (typeof ACTIVITY_TYPES)[keyof typeof ACTIVITY_TYPES];

export const APORTE_TYPES: ActivityType[] = [
  ACTIVITY_TYPES.INDIVIDUAL,
  ACTIVITY_TYPES.GRUPAL,
];

export const MIN_APORTES = 9;

export const DEFAULT_INDIVIDUAL_ACTIVITIES = [
  "Cuaderno",
  "Escritura",
  "Dictado",
  "Lectura comprensiva",
];

export const REFUERZO_ACTIVITIES: { type: ActivityType; name: string }[] = [
  { type: ACTIVITY_TYPES.REFUERZO_DIRECTA, name: "Directa" },
  {
    type: ACTIVITY_TYPES.REFUERZO_MEJORA,
    name: "Evaluación de mejora",
  },
  {
    type: ACTIVITY_TYPES.REFUERZO_CALIFICACION,
    name: "Calificación del refuerzo",
  },
  {
    type: ACTIVITY_TYPES.REFUERZO_SUPLETORIA,
    name: "Evaluación supletoria",
  },
];

export function courseTitle(gradeLabel: string, parallel: string, yearLabel: string) {
  return `${gradeLabel} ${parallel} — ${yearLabel}`;
}
