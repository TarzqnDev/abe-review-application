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
