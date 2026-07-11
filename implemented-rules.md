# Implemented Rules

- Question Bank database changes are provided as a Supabase SQL editor script, not as a local migration, because this project uses the cloud Supabase project directly.
- Manage Reviewees payment proofs use the private `payments` bucket and the path `payment-images/<auth-user-id>/<unique-image-file>`; the database stores only the object path.
- Payment proof uploads accept PNG, JPEG, or WebP images up to 5 MB.
- Accept-invite database changes are provided as a Supabase SQL Editor script under `supabase/sql-editor`, not as a migration.
