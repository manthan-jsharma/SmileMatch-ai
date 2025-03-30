import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isAuthenticated = !!token;

  const isAuthPage = req.nextUrl.pathname.startsWith("/auth");
  const isApiAuthRoute = req.nextUrl.pathname.startsWith("/api/auth");
  const isPublicPage =
    req.nextUrl.pathname === "/" ||
    req.nextUrl.pathname.startsWith("/api/analyze-smile");

  // Allow public pages and API routes
  if (isPublicPage || isApiAuthRoute) {
    return NextResponse.next();
  }

  // Redirect to login if not authenticated and trying to access protected routes
  if (!isAuthenticated && !isAuthPage) {
    return NextResponse.redirect(new URL("/authpage/signin", req.url));
  }

  // Redirect to dashboard if authenticated and trying to access auth pages
  if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Check role-based access
  if (isAuthenticated && token.role) {
    // Doctor routes protection
    if (req.nextUrl.pathname.startsWith("/doctor") && token.role !== "doctor") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Admin routes protection (if needed in the future)
    if (req.nextUrl.pathname.startsWith("/admin") && token.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/doctor/:path*",
    "/auth/:path*",
    "/api/doctor/:path*",
    "/api/appointments/:path*",
  ],
};
