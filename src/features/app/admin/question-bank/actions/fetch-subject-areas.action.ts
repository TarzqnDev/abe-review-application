"use server";

import { getTokenRoles } from "@/lib/auth/get-token-roles";
import { createActiveSupabaseServerActionClient } from "@/lib/supabase/server-action";

const subjectNameCollator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: "base",
});

export type AdminSubject = {
  id: number;
  name: string;
  area_id: number;
  created_at: string;
  updated_at: string;
};

export type AdminSubjectArea = {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  subjects: AdminSubject[];
};

export const fetchSubjectAreas = async () => {
  try {
    const supabase = await createActiveSupabaseServerActionClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      throw new Error("You must be logged in to view subject areas");
    }

    const roles = getTokenRoles(session);

    if (!roles.includes("admin")) {
      throw new Error("You are not authorized to view subject areas");
    }

    const { data, error } = await supabase
      .from("subject_areas")
      .select(
        "id, name, created_at, updated_at, subjects(id, name, area_id, created_at, updated_at)",
      )
      .order("id");

    if (error) {
      throw new Error(error.message);
    }

    const subjectAreas = ((data ?? []) as AdminSubjectArea[]).map((area) => ({
      ...area,
      subjects: [...(area.subjects ?? [])].sort(
        (firstSubject, secondSubject) =>
          subjectNameCollator.compare(firstSubject.name, secondSubject.name),
      ),
    }));

    return {
      success: true,
      subjectAreas,
    };
  } catch (error: unknown) {
    console.error(error);

    return {
      success: false,
      subjectAreas: [] as AdminSubjectArea[],
      error:
        error instanceof Error
          ? error.message
          : "Unable to fetch subject areas",
    };
  }
};
