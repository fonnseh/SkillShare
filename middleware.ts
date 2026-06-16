import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/", "/auth/login", "/auth/register", "/jobs", "/internships", "/about", "/find-talent"];
const AUTH_ONLY = ["/auth/login", "/auth/register"];

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const isLoggedIn = !!session;
  const isPublic = PUBLIC_ROUTES.some((r) => nextUrl.pathname === r || nextUrl.pathname.startsWith(r + "/"));
  const isAuthPage = AUTH_ONLY.includes(nextUrl.pathname);

  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard/job-seeker", nextUrl));
  }

  if (!isLoggedIn && !isPublic) {
    const callbackUrl = encodeURIComponent(nextUrl.pathname + nextUrl.search);
    return NextResponse.redirect(new URL(`/auth/login?callbackUrl=${callbackUrl}`, nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images|icons).*)"],
};
