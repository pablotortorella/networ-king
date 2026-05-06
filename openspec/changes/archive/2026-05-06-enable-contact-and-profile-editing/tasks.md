## 1. Update Model And Persistence

- [x] 1.1 Add profile update logic that preserves profile identity and created timestamp while refreshing updated timestamp.
- [x] 1.2 Add contact update logic that preserves contact identity, event association, and created timestamp while refreshing updated timestamp.
- [x] 1.3 Reuse existing validation rules for both contact creation and contact editing.

## 2. Contact Editing Flow

- [x] 2.1 Add an edit action to the contact detail view for owned contacts.
- [x] 2.2 Reuse the contact form in an edit mode with current values preloaded.
- [x] 2.3 Save contact edits back into the existing record and return to the updated detail view.
- [x] 2.4 Keep event association visible in detail but not editable from the contact edit flow.

## 3. Profile Editing Flow

- [x] 3.1 Add an "Editar mis datos" action to the existing secondary action surface.
- [x] 3.2 Reuse the profile creation fields as a profile edit form with current values preloaded.
- [x] 3.3 Save profile edits back into the active local profile and refresh visible profile context in the UI.

## 4. Verification

- [x] 4.1 Update automated tests for contact updates, profile updates, and timestamp behavior.
- [x] 4.2 Verify the contact edit flow loads current values and returns to the updated detail view after save.
- [x] 4.3 Verify the profile edit flow updates the visible local profile context.
- [x] 4.4 Run available syntax checks and tests after the editing flows are added.
