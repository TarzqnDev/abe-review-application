import { Session } from "@supabase/supabase-js";

export function getTokenRoles(session: Session | null): string[] {
  if (!session?.access_token) return [];

  try {
    const tokenPayload = session.access_token.split(".")[1];
    if (!tokenPayload) throw new Error("Access token is invalid.");

    const payload = JSON.parse(atob(tokenPayload));

    return payload.app_metadata?.roles || [];
  } catch {
    return [];
  }
}
