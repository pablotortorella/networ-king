## 1. Contact Form Simplification

- [x] 1.1 Remove the visible event selector from the new-contact form when an active event context exists.
- [x] 1.2 Keep the form visually anchored to the active event context shown outside the form.

## 2. Implicit Event Association

- [x] 2.1 Submit new contacts using the active event ID from app state instead of a visible form field.
- [x] 2.2 Preserve validation so contact creation still fails when there is no active owned event context.

## 3. Verification

- [x] 3.1 Update automated tests to confirm contacts created in the form are associated with the active event.
- [x] 3.2 Verify the event field is absent from the contact form when an event is already selected.
- [x] 3.3 Run available syntax checks and tests after the form change.
