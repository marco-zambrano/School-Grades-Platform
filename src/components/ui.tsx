import Link from "next/link";

export function PageHeader({
  title,
  subtitle,
  backHref,
  backLabel = "Volver",
  actions,
}: {
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        {backHref ? (
          <Link
            href={backHref}
            className="mb-2 inline-block text-base font-medium text-sky-800 underline-offset-4 hover:underline"
          >
            ← {backLabel}
          </Link>
        ) : null}
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-2 max-w-2xl text-lg text-slate-600">{subtitle}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </header>
  );
}

export function PrimaryButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`inline-flex min-h-12 items-center justify-center rounded-2xl bg-sky-700 px-5 py-3 text-lg font-semibold text-white shadow-sm hover:bg-sky-800 disabled:opacity-60 ${props.className ?? ""}`}
    >
      {children}
    </button>
  );
}

export function SecondaryLink({
  href,
  children,
  color = "sky",
}: {
  href: string;
  children: React.ReactNode;
  color?: "sky" | "rose" | "emerald" | "amber";
}) {
  const colors = {
    sky: "bg-sky-700 hover:bg-sky-800",
    rose: "bg-rose-600 hover:bg-rose-700",
    emerald: "bg-emerald-700 hover:bg-emerald-800",
    amber: "bg-amber-600 hover:bg-amber-700",
  };
  return (
    <Link
      href={href}
      className={`inline-flex min-h-12 items-center justify-center rounded-2xl px-5 py-3 text-center text-lg font-semibold text-white shadow-sm ${colors[color]}`}
    >
      {children}
    </Link>
  );
}

export function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-lg font-medium text-slate-800">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="w-full rounded-xl border-2 border-slate-300 bg-white px-4 py-3 text-lg text-slate-900 outline-none focus:border-sky-600"
      />
    </label>
  );
}

export function CardLink({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description?: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-3xl border-2 border-slate-200 bg-white p-6 shadow-sm transition hover:border-sky-400 hover:shadow-md"
    >
      <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
      {description ? (
        <p className="mt-2 text-lg text-slate-600">{description}</p>
      ) : null}
    </Link>
  );
}
