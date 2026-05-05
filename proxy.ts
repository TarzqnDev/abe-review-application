import { NextRequest, NextResponse } from "next/server";
import { createSupabaseProxyClient } from "./lib/supabase/proxy";

import { protectedRoutes, authRoutes } from "./lib/auth/route-protection";
import { getTokenRoles } from "./lib/auth/get-token-roles";

export async function proxy(request: NextRequest) {
  const response = NextResponse.next();

  const { supabase, getResponse } = createSupabaseProxyClient(
    request,
    response,
  );

  const pathname = request.nextUrl.pathname;

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session && !isAuthRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const roles = getTokenRoles(session);

  // ✅ Already logged in
  if (isAuthRoute && session) {
    if (roles.includes("admin"))
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    else if (roles.includes("reviewee"))
      return NextResponse.redirect(new URL("/reviewee/dashboard", request.url));
  }

  for (const [route, allowedRoles] of Object.entries(protectedRoutes)) {
    if (pathname.startsWith(route)) {
      const authorized = allowedRoles.some((role) => roles.includes(role));

      if (!authorized) {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    }
  }

  return getResponse();
}

export const config = {
  matcher: ["/", "/login", "/admin/:path*", "/reviewee/:path*"],
};
