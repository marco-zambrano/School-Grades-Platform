import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Libreta de notas",
  description: "Plantillas de calificaciones por curso, trimestre y materia",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full bg-slate-100 font-sans text-slate-900">
        {children}
      </body>
    </html>
  );
}
