"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { saveGrade } from "@/app/actions";

export function GradeInput({
  activityId,
  studentId,
  initial,
}: {
  activityId: string;
  studentId: string;
  initial: number | null;
}) {
  const [raw, setRaw] = useState(initial === null ? "" : String(initial));
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState("");
  const [, startTransition] = useTransition();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  function persist(next: string) {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      startTransition(async () => {
        setStatus("saving");
        const result = await saveGrade({ activityId, studentId, raw: next });
        if (result.ok) {
          setStatus("saved");
          setMessage("");
        } else {
          setStatus("error");
          setMessage(result.error);
        }
      });
    }, 400);
  }

  return (
    <div>
      <input
        inputMode="decimal"
        value={raw}
        aria-label="Nota de 0 a 10"
        onChange={(e) => {
          setRaw(e.target.value);
          setStatus("idle");
          persist(e.target.value);
        }}
        onBlur={() => persist(raw)}
        className="form-control w-full min-w-20 rounded-xl px-3 py-3 text-center text-xl tabular-nums outline-none"
        placeholder="—"
      />
      {status === "error" ? (
        <p className="mt-1 text-sm font-medium text-rose-400">{message}</p>
      ) : null}
    </div>
  );
}
