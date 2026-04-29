import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set({ name, value, ...options }),
            );
          } catch (error) {
            // `cookies().set()` is unavailable in some Server Component paths.
            // In those cases, Supabase session refresh should be handled elsewhere
            // (for example, middleware or a route handler).
            console.error(
              "There is some error in your supabase cookies setup:",
              error,
            );
          }
        },
      },
    },
  );
}
