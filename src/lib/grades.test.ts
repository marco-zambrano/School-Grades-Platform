import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  computeAportes70,
  computeEval30,
  parseGradeInput,
  summarizeStudent,
} from "./grades";

describe("grade rules", () => {
  it("accepts decimal commas and rejects grades outside 0–10", () => {
    assert.deepEqual(parseGradeInput("8,25"), { ok: true, value: 8.25 });
    assert.equal(parseGradeInput("10.01").ok, false);
  });

  it("weights aportes and evaluations at 70/30", () => {
    const activities = [
      { type: "INDIVIDUAL", value: 8 },
      { type: "GRUPAL", value: 10 },
      { type: "PROYECTO", value: 8 },
      { type: "SUMATIVA", value: 10 },
    ];
    assert.equal(computeAportes70(activities), 6.3);
    assert.equal(computeEval30(activities), 2.7);
    assert.equal(summarizeStudent(activities).finalAverage, 9);
  });

  it("leaves a missing component empty instead of inventing a score", () => {
    assert.equal(computeEval30([{ type: "PROYECTO", value: null }]), null);
  });
});
