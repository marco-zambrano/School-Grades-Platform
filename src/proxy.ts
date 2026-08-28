import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPaths = ["/entrar", "/registrarse"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublic =
    publicPaths.some((p) => pathname === p || pathname.startsWith(`${p}/`)) ||
    pathname.startsWith("/api/auth");

  const sessionCookie =
    request.cookies.get("authjs.session-token") ??
    request.cookies.get("__Secure-authjs.session-token");

  if (!isPublic && !sessionCookie) {
    const url = request.nextUrl.clone();
    url.pathname = "/entrar";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
