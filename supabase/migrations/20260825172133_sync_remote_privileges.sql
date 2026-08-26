set local check_function_bodies = off;

revoke all on function "public"."advance_flash_card_session"(uuid) from "anon";

revoke all on function "public"."advance_quiz_session"(uuid) from "anon";

revoke all on function "public"."cancel_flash_card_session"(uuid) from "anon";

revoke all on function "public"."cancel_flash_card_session"(uuid) from "authenticated";

revoke all on function "public"."cancel_quiz_session"(uuid) from "anon";

revoke all on function "public"."cancel_quiz_session"(uuid) from "authenticated";

revoke all on function "public"."claim_reviewee_invitation"(uuid, text, text, uuid) from "anon";

revoke all on function "public"."claim_reviewee_invitation"(uuid, text, text, uuid) from "authenticated";

revoke all on function "public"."complete_reviewee_invitation"(bigint, boolean, uuid) from "anon";

revoke all on function "public"."complete_reviewee_invitation"(bigint, boolean, uuid) from "authenticated";

revoke all on function "public"."enforce_flash_card_deck_limit"() from "anon";

revoke all on function "public"."enforce_flash_card_deck_limit"() from "authenticated";

revoke all on function "public"."exit_flash_card_session"(uuid) from "anon";

revoke all on function "public"."exit_quiz_session"(uuid) from "anon";

revoke all on function "public"."flash_card_reviewee_user_id"() from "anon";

revoke all on function "public"."flash_card_reviewee_user_id"() from "authenticated";

revoke all on function "public"."flash_card_session_summary"(uuid, uuid) from "anon";

revoke all on function "public"."flash_card_session_summary"(uuid, uuid) from "authenticated";

revoke all on function "public"."get_activity_history_details"(uuid) from "anon";

revoke all on function "public"."get_activity_history_details_active_internal"(uuid) from "anon";

revoke all on function "public"."get_activity_history_details_active_internal"(uuid) from "authenticated";

revoke all on function "public"."is_current_user_active"() from "anon";

revoke all on function "public"."is_current_user_active_admin"() from "anon";

revoke all on function "public"."normalize_flash_card_answer"(text) from "anon";

revoke all on function "public"."normalize_flash_card_answer"(text) from "authenticated";

revoke all on function "public"."prepare_flash_card_session"(bigint) from "anon";

revoke all on function "public"."prepare_paes_quiz_session"(bigint) from "anon";

revoke all on function "public"."prepare_paes_quiz_session"(bigint) from "authenticated";

revoke all on function "public"."prepare_quiz_session"(bigint, text, text) from "anon";

revoke all on function "public"."prepare_quiz_session"(bigint, text, text) from "authenticated";

revoke all on function "public"."preview_flash_card_session"(bigint) from "anon";

revoke all on function "public"."preview_paes_quiz_session"(bigint) from "anon";

revoke all on function "public"."preview_quiz_session"(bigint, text, text) from "anon";

revoke all on function "public"."prune_game_session_history"() from "anon";

revoke all on function "public"."prune_game_session_history"() from "authenticated";

revoke all on function "public"."quiz_reviewee_user_id"() from "anon";

revoke all on function "public"."quiz_reviewee_user_id"() from "authenticated";

revoke all on function "public"."quiz_session_summary"(uuid, uuid) from "anon";

revoke all on function "public"."quiz_session_summary"(uuid, uuid) from "authenticated";

revoke all on function "public"."quiz_timer_seconds"(text, text) from "anon";

revoke all on function "public"."quiz_timer_seconds"(text, text) from "authenticated";

revoke all on function "public"."record_reviewee_activity_stats"(uuid) from "anon";

revoke all on function "public"."record_reviewee_activity_stats"(uuid) from "authenticated";

revoke all on function "public"."record_reviewee_activity_stats_after_terminal"() from "anon";

revoke all on function "public"."record_reviewee_activity_stats_after_terminal"() from "authenticated";

revoke all on function "public"."record_reviewee_activity_stats_after_terminal"() from "service_role";

revoke all on function "public"."reveal_flash_card_answer"(bigint) from "anon";

revoke all on function "public"."reveal_quiz_answer"(bigint) from "anon";

revoke all on function "public"."start_flash_card_session"(uuid) from "anon";

revoke all on function "public"."start_flash_card_session"(uuid) from "authenticated";

revoke all on function "public"."start_flash_card_session_after_countdown"(bigint) from "anon";

revoke all on function "public"."start_paes_quiz_session_after_countdown"(bigint) from "anon";

revoke all on function "public"."start_quiz_session"(uuid) from "anon";

revoke all on function "public"."start_quiz_session"(uuid) from "authenticated";

revoke all on function "public"."start_quiz_session_after_countdown"(bigint, text, text) from "anon";

revoke all on function "public"."submit_flash_card_answer"(bigint, text, timestamp with time zone) from "anon";

revoke all on function "public"."submit_quiz_answer"(bigint, bigint, timestamp with time zone) from "anon";

revoke all on function "public"."timeout_flash_card"(bigint) from "anon";

revoke all on function "public"."timeout_quiz_question"(bigint) from "anon";

revoke all on function "public"."touch_flash_card_deck"() from "anon";

revoke all on function "public"."touch_flash_card_deck"() from "authenticated";

revoke all on function "public"."validate_trivia_publish_date"() from "anon";

revoke all on function "public"."validate_trivia_publish_date"() from "authenticated";

revoke all on table "public"."flash_card_decks" from "anon";

revoke all on table "public"."flash_cards" from "anon";

revoke all on table "public"."game_session_answer_keys" from "anon";

revoke all on table "public"."game_session_answer_keys" from "authenticated";

revoke all on table "public"."game_session_flash_card_answer_keys" from "anon";

revoke all on table "public"."game_session_flash_card_answer_keys" from "authenticated";

revoke all on table "public"."game_session_flash_cards" from "anon";

revoke all on table "public"."game_session_questions" from "anon";

revoke all on table "public"."game_sessions" from "anon";

revoke all on table "public"."quiz_timer_configurations" from "anon";

revoke all on table "public"."quiz_timer_configurations" from "authenticated";

revoke all on table "public"."reviewee_activity_stats" from "anon";

revoke all on table "public"."reviewee_invitation_email_logs" from "anon";

revoke all on table "public"."reviewee_invitation_email_logs" from "authenticated";

revoke all on table "public"."trivias" from "anon";
