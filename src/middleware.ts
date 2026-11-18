import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "wolves-basketball-club-super-secret-jwt-key-2025"
);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect /dashboard and /api/admin
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/api/admin")) {
    const token = req.cookies.get("wolves_session")?.value;

    if (!token) {
      if (pathname.startsWith("/api/admin")) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
      }
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      if (payload.role_id !== "admin") {
        if (pathname.startsWith("/api/admin")) {
          return NextResponse.json(
            { success: false, error: "Forbidden: Admin access required" },
            { status: 403 }
          );
        }
        const homeUrl = new URL("/?error=unauthorized_admin", req.url);
        return NextResponse.redirect(homeUrl);
      }
    } catch {
      if (pathname.startsWith("/api/admin")) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/admin/:path*"],
};
