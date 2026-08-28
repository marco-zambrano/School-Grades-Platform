import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";

const secret =
  process.env.AUTH_SECRET ??
  (process.env.NODE_ENV === "development"
    ? "school-grades-platform-development-secret-not-for-production"
    : undefined);

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  secret,
  session: { strategy: "jwt" },
  pages: { signIn: "/entrar" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Correo", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials.email ?? "")
          .trim()
          .toLowerCase();
        const password = String(credentials.password ?? "");
        if (!email || !password) return null;
        const teacher = await prisma.teacher.findUnique({ where: { email } });
        if (!teacher) return null;
        const valid = await compare(password, teacher.passwordHash);
        if (!valid) return null;
        return {
          id: teacher.id,
          email: teacher.email,
          name: teacher.name,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.name = typeof token.name === "string" ? token.name : null;
        session.user.email = typeof token.email === "string" ? token.email : "";
      }
      return session;
    },
  },
});
