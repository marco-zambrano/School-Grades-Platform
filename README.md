# Libreta de notas

Aplicación personal para docentes: organiza cursos por año lectivo, administra nóminas, registra calificaciones por trimestre y materia, y exporta la libreta a Excel.

## Requisitos y puesta en marcha

Use Node.js 20.9 o superior. Copie la configuración de ejemplo y cree la base local:

```bash
cp .env.example .env
npm install
npm run prisma:generate
npm run db:migrate
npm run dev
```

Abra `http://localhost:3000`, cree una cuenta y luego un año lectivo y curso. SQLite guarda los datos en `prisma/dev.db`; no suba este archivo al repositorio.

## Comandos

```bash
npm run dev              # servidor de desarrollo
npm run lint             # reglas de ESLint y Next.js
npm test                 # pruebas de las reglas de calificación
npm run build            # compilación de producción
npm run db:deploy        # aplica migraciones existentes (producción)
```

## Configuración de producción

Defina `DATABASE_URL` en un almacenamiento persistente y un `AUTH_SECRET` aleatorio (por ejemplo, `openssl rand -base64 32`). SQLite es adecuada para una instalación individual con disco persistente; use una base gestionada para despliegues con varias instancias.
