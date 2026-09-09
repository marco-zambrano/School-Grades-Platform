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
      <section className="app-card rounded-3xl p-6">
        <SchoolYearForm />
      </section>
    </div>
  );
}
