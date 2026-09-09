import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Libreta de notas",
  description: "Plantillas de calificaciones por curso, trimestre y materia",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className="dark h-full antialiased" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "try { const theme = localStorage.getItem('theme'); if (theme === 'light') document.documentElement.classList.replace('dark', 'light'); } catch {}" }} />
      </head>
      <body className="min-h-full font-sans">
        {children}
      </body>
    </html>
  );
}
