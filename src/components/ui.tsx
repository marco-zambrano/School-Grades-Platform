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
            className="text-accent mb-2 inline-block text-base font-medium underline-offset-4 hover:underline"
          >
            ← {backLabel}
          </Link>
        ) : null}
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {title}
        </h1>
        {subtitle ? (
          <p className="text-muted mt-2 max-w-2xl text-lg">{subtitle}</p>
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
      className={`btn-primary inline-flex min-h-12 items-center justify-center rounded-2xl px-5 py-3 text-lg font-semibold disabled:opacity-60 ${props.className ?? ""}`}
    >
      {children}
    </button>
  );
}

export function SecondaryLink({
  href,
  children,
  color = "stone",
}: {
  href: string;
  children: React.ReactNode;
  color?: "stone" | "rose" | "emerald" | "amber";
}) {
  const colors = {
    stone: "btn-secondary",
    rose: "bg-rose-700 text-white hover:bg-rose-800",
    emerald: "btn-primary",
    amber: "bg-amber-700 text-white hover:bg-amber-800",
  };
  return (
    <Link
      href={href}
      className={`inline-flex min-h-12 items-center justify-center rounded-2xl px-5 py-3 text-center text-lg font-semibold ${colors[color]}`}
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
      <span className="mb-1 block text-lg font-medium">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="form-control w-full rounded-xl px-4 py-3 text-lg outline-none"
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
      className="app-card block rounded-3xl p-6 transition hover:-translate-y-0.5 hover:border-[var(--accent)] hover:shadow-lg"
    >
      <h2 className="text-2xl font-bold">{title}</h2>
      {description ? (
        <p className="text-muted mt-2 text-lg">{description}</p>
      ) : null}
    </Link>
  );
}
