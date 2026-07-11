# Implemented Features

- Question Bank: all question types now use the same question form shape.
  - Guess the Word, AB-Solution, and Situationship all use Question plus answer choices A-D.
  - Question choices A-D are required, unique, and include a selected correct answer.
  - Removed unused Explanation, Hint, Statement A, Statement B, and Situation/Scenario fields from the question bank app flow.
- Question Bank: Add New Subject modal shows the clicked area as a read-only preselected field instead of an area dropdown.
- Question Bank: modal logic now lives in each modal component's dedicated hook instead of the page hook.
- Question Bank: modals use a shared animation hook so modal-owned hooks still preserve entrance and exit transitions.
- Question Bank: question set cards now view questions only; individual question edit and delete actions live inside the question list modal.
- Question Bank: deleting a question now uses a confirmation modal and a server action that removes question options before deleting the question.
- Manage Reviewees: registration now assigns the join date automatically, records online or in-house review mode, and stores a validated payment proof in private Supabase Storage.
- Manage Reviewees: administrators can load payment proofs through short-lived signed URLs.
- Manage Reviewees: reviewee listings and payment proofs are restricted to accounts assigned the reviewee role; invited accounts receive that role immediately.
- Project Structure: all feature imports were aligned with the mirrored `src/features/app` and `src/features/auth` structure and verified.
- Manage Reviewees: user fetching and invitation server actions now live with the reviewees feature.
- Admin Layout: navigation components now use semantic names—the top navigation is `AdminNavbar`, and the side navigation is `AdminSidebar`.
- Authentication: invited users accept invitations at `/auth/accept-invite`, where they can complete their account in a centered branded flow or continue to the reviewee dashboard when the invitation was already accepted.
- Authentication: invited accounts track when account setup is completed.
- Payments: payment record IDs use generated bigint values.
