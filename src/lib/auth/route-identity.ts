import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

export type AssignedAppRole = "admin" | "reviewee";

type AuthClaims = {
  app_metadata?: {
    roles?: unknown;
  };
  sub?: unknown;
};

export type AuthRouteIdentity = {
  assignedDashboardPath: "/admin" | "/reviewee" | null;
  assignedRole: AssignedAppRole | null;
  isAuthenticated: boolean;
  roles: string[];
  userId: string | null;
};

export function getRolesFromClaims(claims: AuthClaims | null): string[] {
  const roles = claims?.app_metadata?.roles;

  return Array.isArray(roles)
    ? roles.filter((role): role is string => typeof role === "string")
    : [];
}

export function getAssignedAppRole(roles: string[]): AssignedAppRole | null {
  if (roles.includes("admin")) return "admin";
  if (roles.includes("reviewee")) return "reviewee";

  return null;
}

export function getAssignedDashboardPath(
  role: AssignedAppRole | null,
): "/admin" | "/reviewee" | null {
  if (role === "admin") return "/admin";
  if (role === "reviewee") return "/reviewee";

  return null;
}

export async function getAuthRouteIdentity(
  supabase: SupabaseClient<Database>,
): Promise<AuthRouteIdentity> {
  const { data, error } = await supabase.auth.getClaims();
  const claims = error ? null : (data?.claims as AuthClaims | null) ?? null;
  const userId = typeof claims?.sub === "string" ? claims.sub : null;
  const roles = getRolesFromClaims(claims);
  const assignedRole = getAssignedAppRole(roles);

  return {
    assignedDashboardPath: getAssignedDashboardPath(assignedRole),
    assignedRole,
    isAuthenticated: Boolean(claims && userId),
    roles,
    userId,
  };
}
