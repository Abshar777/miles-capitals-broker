import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

export default withAuth(
  async function middleware(req) {
    const path = req.nextUrl.pathname;
    const token = req.nextauth.token;
    const isLoggedIn = !!token;
    const userRole = token?.role;
    const isVerified = token?.verified;
    const isSuperAdminPage = path.startsWith("/admin/superAdmin");
    const otpAccess = token?.otpAccess;
    const conformPasswordAccess = !!token?.conformPasswordToken;

    const isAuthenticated = token?.token && token?.token !== "null";

    if (!otpAccess && path.startsWith("/auth/otp")) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
    if (!conformPasswordAccess && path.startsWith("/auth/conform-password")) {
      return NextResponse.redirect(new URL("/root/dashboard", req.url));
    }

    if (path.startsWith("/auth")) {
      if (otpAccess && path.startsWith("/auth/otp")) {
        return NextResponse.next();
      }
      if (conformPasswordAccess && path.startsWith("/auth/conform-password")) {
        return NextResponse.next();
      }

      if (path.startsWith("/auth/token")) {
        return NextResponse.next();
      }
      if (isAuthenticated) {
        return NextResponse.redirect(new URL("/root/dashboard", req.url));
      }
      return NextResponse.next();
    }

    if (path.startsWith("/root")) {
      if (!isAuthenticated) {
        return NextResponse.redirect(new URL("/auth/login", req.url));
      }

      return NextResponse.next();
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        return true;
      },
    },

    cookies: {
      sessionToken: {
        name: `client-mt5-session-token`,
      },
    },
  },
);

export const config = {
  matcher: [
    "/auth/:path*",
    "/admin/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
