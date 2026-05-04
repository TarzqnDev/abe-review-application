import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export function createSupabaseProxyClient(
  request: NextRequest,
  response: NextResponse,
) {
  let workingResponse = response;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          workingResponse = NextResponse.next({ request });

          cookiesToSet.forEach(({ name, value, options }) => {
            workingResponse.cookies.set(name, value, options);
          });

          Object.entries(headers).forEach(([key, value]) => {
            workingResponse.headers.set(key, value);
          });
        },
      },
    },
  );

  return {
    supabase,
    getResponse: () => workingResponse,
  };
}
