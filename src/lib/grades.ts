import { APORTE_TYPES, ACTIVITY_TYPES, MIN_APORTES } from "./subjects";

export const DIFFICULTY_THRESHOLD = 7;

export type ActivityScore = {
  type: string;
  value: number | null;
};

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function mean(values: number[]): number | null {
  if (values.length === 0) return null;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

export function parseGradeInput(raw: string): { ok: true; value: number | null } | { ok: false; error: string } {
  const trimmed = raw.trim().replace(",", ".");
  if (trimmed === "") return { ok: true, value: null };
  const n = Number(trimmed);
  if (!Number.isFinite(n)) {
    return { ok: false, error: "Escriba un número entre 0 y 10." };
  }
  if (n < 0 || n > 10) {
    return { ok: false, error: "La nota debe estar entre 0 y 10." };
  }
  return { ok: true, value: round2(n) };
}

export function aportesScores(activities: ActivityScore[]): number[] {
  return activities
    .filter((a) => APORTE_TYPES.includes(a.type as (typeof APORTE_TYPES)[number]))
    .map((a) => a.value)
    .filter((v): v is number => v !== null);
}

export function computeAportes70(activities: ActivityScore[]): number | null {
  const scores = aportesScores(activities);
  const m = mean(scores);
  if (m === null) return null;
  return round2(m * 0.7);
}

export function computeEval30(activities: ActivityScore[]): number | null {
  const proyecto =
    activities.find((a) => a.type === ACTIVITY_TYPES.PROYECTO)?.value ?? null;
  const sumativa =
    activities.find((a) => a.type === ACTIVITY_TYPES.SUMATIVA)?.value ?? null;
  const vals = [proyecto, sumativa].filter((v): v is number => v !== null);
  const m = mean(vals);
  if (m === null) return null;
  return round2(m * 0.3);
}

export function computeSubjectAverage(
  aportes70: number | null,
  eval30: number | null,
): number | null {
  if (aportes70 === null && eval30 === null) return null;
  return round2((aportes70 ?? 0) + (eval30 ?? 0));
}

/**
 * Hasta que existan las fórmulas de refuerzo del Excel, el promedio final
 * coincide con el promedio de asignatura. Las notas de refuerzo se guardan
 * pero no alteran este valor.
 */
export function computeFinalAverage(
  subjectAverage: number | null,
  refuerzo: ActivityScore[],
): number | null {
  void refuerzo;
  return subjectAverage;
}

export function isInDifficulty(average: number | null): boolean {
  return average !== null && average < DIFFICULTY_THRESHOLD;
}

export function aportesCount(activities: { type: string }[]): number {
  return activities.filter((a) =>
    APORTE_TYPES.includes(a.type as (typeof APORTE_TYPES)[number]),
  ).length;
}

export function needsMoreAportes(activities: { type: string }[]): boolean {
  return aportesCount(activities) < MIN_APORTES;
}

export function formatGrade(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  return value.toFixed(2);
}

export function summarizeStudent(activities: ActivityScore[]) {
  const aportes70 = computeAportes70(activities);
  const eval30 = computeEval30(activities);
  const subjectAverage = computeSubjectAverage(aportes70, eval30);
  const refuerzo = activities.filter((a) => a.type.startsWith("REFUERZO_"));
  const finalAverage = computeFinalAverage(subjectAverage, refuerzo);
  return { aportes70, eval30, subjectAverage, finalAverage };
}
