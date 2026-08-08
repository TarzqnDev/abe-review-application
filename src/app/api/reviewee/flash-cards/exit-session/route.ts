import { NextResponse } from "next/server";
import { createRevieweeFlashCardGameActionClient } from "@/features/app/reviewee/flash-cards/utils/game/createRevieweeFlashCardGameActionClient";
import { assertSessionId } from "@/features/app/reviewee/flash-cards/utils/game/validateFlashCardGameActionInput";

type ExitSessionRequestBody = {
  sessionId?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ExitSessionRequestBody;
    const sessionId = body.sessionId ?? "";
    assertSessionId(sessionId);

    const supabase = await createRevieweeFlashCardGameActionClient();
    const { error } = await supabase.rpc("exit_flash_card_session", {
      selected_session_id: sessionId,
    });

    if (error) {
      throw new Error(error.message);
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Unable to exit the flash card session" },
      { status: 400 },
    );
  }
}
