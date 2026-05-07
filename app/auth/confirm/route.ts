import { createSupabaseProxyClient } from "@/lib/supabase/proxy";
import { EmailOtpType } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const tokenHash = request.nextUrl.searchParams.get("token");
  const type = request.nextUrl.searchParams.get("type");
  const next = request.nextUrl.searchParams.get("next") ?? "/signup";
  const safeNext =
    next.startsWith("/") && !next.startsWith("//") ? next : "/signup";

  console.log("tokenHash:", tokenHash);
  console.log("type:", type);
  console.log("next:", next);
  console.log("safeNext:", safeNext);

  const redirectUrl = new URL(safeNext, request.url);

  if (!tokenHash || !type) {
    redirectUrl.searchParams.set("error", "Invalid invite link");

    return NextResponse.redirect(redirectUrl);
  }

  const response = NextResponse.redirect(redirectUrl);
  const { supabase, getResponse } = createSupabaseProxyClient(
    request,
    response,
  );

  const { error } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type: type as EmailOtpType,
  });

  if (error) {
    redirectUrl.searchParams.set("error", error.message);

    return NextResponse.redirect(redirectUrl);
  }

  return getResponse();
}
