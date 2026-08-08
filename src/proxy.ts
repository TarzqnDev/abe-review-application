import { NextRequest, NextResponse } from "next/server";
import { createSupabaseProxyClient } from "./lib/supabase/proxy";

import { protectedRoutes, authRoutes } from "./lib/auth/route-protection";
import {
  AUTH_NOTICES,
  AUTH_NOTICE_QUERY_PARAMETER,
} from "./features/app/layout/constants/authNotices";

function createRedirectResponse(
  redirectUrl: URL,
  supabaseResponse: NextResponse,
) {
  const redirectResponse = NextResponse.redirect(redirectUrl);

  supabaseResponse.cookies.getAll().forEach((cookie) => {
    redirectResponse.cookies.set(cookie);
  });

  ["cache-control", "expires", "pragma"].forEach((header) => {
    const value = supabaseResponse.headers.get(header);
    if (value) redirectResponse.headers.set(header, value);
  });

  return redirectResponse;
}

export async function proxy(request: NextRequest) {
  const response = NextResponse.next();

  const { supabase, getResponse } = createSupabaseProxyClient(
    request,
    response,
  );

  const pathname = request.nextUrl.pathname;

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const isAcceptInviteRoute = pathname.startsWith("/auth/accept-invite");

  const { data: claimsData } = await supabase.auth.getClaims();
  const claims = claimsData?.claims ?? null;
  const roles = Array.isArray(claims?.app_metadata?.roles)
    ? claims.app_metadata.roles.filter(
        (role): role is string => typeof role === "string",
      )
    : [];
  const isAuthenticated = Boolean(claims);

  // 🔒 App protection
  if (!isAuthenticated && !isAuthRoute && !isAcceptInviteRoute) {
    return createRedirectResponse(new URL("/login", request.url), getResponse());
  }

  // ✅ Already logged in, redirect to designated dashboard
  if (isAuthRoute && isAuthenticated) {
    const authNotice = pathname.startsWith("/auth/forgot-password")
      ? AUTH_NOTICES.forgotPasswordAlreadyLoggedIn
      : pathname.startsWith("/auth/reset-password")
        ? AUTH_NOTICES.resetPasswordAlreadyLoggedIn
        : AUTH_NOTICES.alreadyLoggedIn;
    const redirectUrl = new URL(
      roles.includes("admin") ? "/admin" : "/reviewee",
      request.url,
    );
    redirectUrl.searchParams.set(
      AUTH_NOTICE_QUERY_PARAMETER,
      authNotice,
    );

    if (roles.includes("admin") || roles.includes("reviewee")) {
      return createRedirectResponse(redirectUrl, getResponse());
    }
  }

  // Role authorization detection
  for (const [route, allowedRoles] of Object.entries(protectedRoutes)) {
    if (pathname.startsWith(route)) {
      const authorized = allowedRoles.some((role) => roles.includes(role));

      if (!authorized) {
        return createRedirectResponse(
          new URL("/unauthorized", request.url),
          getResponse(),
        );
      }
    }
  }

  return getResponse();
}

export const config = {
  matcher: [
    "/auth/accept-invite",
    "/auth/forgot-password",
    "/auth/reset-password",
    "/login",
    "/admin/:path*",
    "/reviewee/:path*",
  ],
};
