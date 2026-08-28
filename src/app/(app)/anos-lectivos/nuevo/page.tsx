import { SchoolYearForm } from "@/components/course-forms";
import { PageHeader } from "@/components/ui";
import { connection } from "next/server";

export default async function NewSchoolYearPage() {
  await connection();
  return (
    <div className="mx-auto max-w-xl">
      <PageHeader
        title="Nuevo año lectivo"
        subtitle="Cree el período en el que organizará sus cursos."
        backHref="/"
      />
      <section className="rounded-3xl border-2 border-slate-200 bg-white p-6 shadow-sm">
        <SchoolYearForm />
      </section>
    </div>
  );
}
