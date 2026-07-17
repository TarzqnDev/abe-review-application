# Implemented Rules

- Question Bank database changes are provided as a Supabase SQL editor script, not as a local migration, because this project uses the cloud Supabase project directly.
- Manage Reviewees payment proofs use the private `payments` bucket and the path `payment-images/<auth-user-id>/<unique-image-file>`; the database stores only the object path.
- Payment proof uploads accept PNG, JPEG, or WebP images up to 5 MB.
- Accept-invite database changes are provided as a Supabase SQL Editor script under `supabase/sql-editor`, not as a migration.
- Admin and reviewee app pages use the shared role-aware app shell and navigation components.
- The unfinished gray content block in the ABE Trivia reference is intentionally omitted.
- Reviewee quiz gameplay database changes are supplied as a Supabase SQL Editor script, and answer keys remain server-private instead of being returned with playable questions.
