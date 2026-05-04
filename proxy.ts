import { NextRequest, NextResponse } from "next/server";
import { createSupabaseProxyClient } from "./lib/supabase/proxy";

import {
  protectedRoutes,
  authRoutes,
} from "./features/auth/utils/protectedRoutes";

export async function proxy(request: NextRequest) {
  const response = NextResponse.next();

  const { supabase, getResponse } = createSupabaseProxyClient(
    request,
    response,
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // 🚫 Not logged in
  if (isProtected && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ✅ Already logged in
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return getResponse();
}

export const config = {
  matcher: ["/", "/login", "/register", "/admin/:path*", "/reviewee/:path*"],
};
