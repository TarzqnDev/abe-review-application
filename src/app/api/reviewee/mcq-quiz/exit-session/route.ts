import { NextResponse } from "next/server";
import { createRevieweeQuizActionClient } from "@/features/app/reviewee/mcq-quiz/utils/createRevieweeQuizActionClient";
import { assertSessionId } from "@/features/app/reviewee/mcq-quiz/utils/validateQuizActionInput";

type ExitSessionRequestBody = {
  sessionId?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ExitSessionRequestBody;
    const sessionId = body.sessionId ?? "";
    assertSessionId(sessionId);

    const supabase = await createRevieweeQuizActionClient();
    const { error } = await supabase.rpc("exit_quiz_session", {
      selected_session_id: sessionId,
    });

    if (error) {
      throw new Error(error.message);
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Unable to exit the quiz session" },
      { status: 400 },
    );
  }
}
