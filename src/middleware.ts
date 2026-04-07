import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // 1. Clickjacking Protection (Global)
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Content-Security-Policy", "frame-ancestors 'none'");

  // 2. Admin Route Protection
  const session = request.cookies.get("session");
  const isLoginPage = pathname === "/admin/login";
  const isAdminRoute = pathname.startsWith("/admin") && !isLoginPage;

  if (isAdminRoute && !session) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (isLoginPage && session) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
