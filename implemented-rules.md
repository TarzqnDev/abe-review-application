# Implemented Rules

- Question Bank database changes are provided as a Supabase SQL editor script, not as a local migration, because this project uses the cloud Supabase project directly.
- Manage Reviewees payment proofs use the private `payments` bucket and the path `payment-images/<auth-user-id>/<unique-image-file>`; the database stores only the object path.
- Payment proof uploads accept PNG, JPEG, or WebP images up to 5 MB.
- Manage Reviewees invitation sends are logged in the database and atomically throttled per reviewee for five minutes; failed email-provider requests do not consume the cooldown.
- Supabase Auth email delivery and Postgres logging cannot share one transaction, so invitation actions reserve the cooldown before requesting delivery and finalize the log immediately afterward; interrupted `sending` reservations conservatively expire after five minutes.
- Accept-invite database changes are provided as a Supabase SQL Editor script under `supabase/sql-editor`, not as a migration.
- Admin and reviewee app pages use the shared role-aware app shell and navigation components.
- The unfinished gray content block in the ABE Trivia reference is intentionally omitted.
- Reviewee quiz gameplay database changes are supplied as a Supabase SQL Editor script, and answer keys remain server-private instead of being returned with playable questions.
- Reviewee flash-card database changes are supplied as a Supabase SQL Editor script; each reviewee has at most one deck per subject area and each deck is limited to 100 cards.
- `game_sessions` is the sole canonical activity-history source for MCQ and flash-card attempts; summary metrics are derived from the mode-specific session-item tables, and private answer-key tables remain the source for detailed results.
- Reviewee history database changes are supplied as a timestamped Supabase SQL Editor script, including removal of the redundant activity-history table and UUID-based, ownership-checked detail access.
- Flash-card game answers are compared server-side after trimming, collapsing repeated whitespace, and ignoring letter case; punctuation, accents, and word order remain significant.
- ABE Trivia database changes are supplied as a timestamped Supabase SQL Editor script; publish dates follow the Asia/Manila calendar, allow an unchanged historical date during editing, and otherwise cannot be in the past.
- ABE Trivia permits one trivia per publish date, restricts trivia management to administrators through row-level security, exposes only today's trivia to reviewees, groups admin listings by publish month, and paginates listings at four trivia per page.
- All successful application operations use the established animated teal success banner that slides down into view and slides back up after completion.
- Password recovery uses cloud-managed Supabase Auth and email-template settings, stores only a signed and expiring user ID recovery cookie, and never persists a Supabase recovery session in cookies.
- Subject areas and subjects remain readable by authenticated users, while their create, update, and delete operations are restricted to administrators through row-level security.
