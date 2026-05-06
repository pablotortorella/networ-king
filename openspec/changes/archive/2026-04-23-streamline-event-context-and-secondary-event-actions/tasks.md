## 1. Event Data And Persistence

- [x] 1.1 Replace the current single event date field with optional start-date and end-date fields in the shared event model.
- [x] 1.2 Add local-state compatibility logic for previously saved events that still use the old single-date shape.
- [x] 1.3 Update event creation helpers and persisted event records to save the new date-range fields.

## 2. Event Context UI

- [x] 2.1 Replace the always-visible main-screen event form with a compact active-event context header shown when at least one event exists.
- [x] 2.2 Show the active event name and any available start/end date information in that compact context.
- [x] 2.3 Keep first-event creation as the primary required setup flow when the profile has no events.

## 3. Secondary Event Actions

- [x] 3.1 Add a secondary event actions control with lower prominence than the contact-capture form.
- [x] 3.2 Implement event switching inside that secondary event actions surface.
- [x] 3.3 Move new-event creation into that same secondary event actions surface.
- [x] 3.4 After creating a new event, keep it active and return the user to the main contact-capture flow.

## 4. Contact Flow And Responsive Behavior

- [x] 4.1 Ensure the main screen prioritizes contact capture once an active event exists.
- [x] 4.2 Keep the contact form defaulted to the active event after event switching or event creation.
- [x] 4.3 Verify the secondary event actions remain discoverable and usable on phone-sized screens.

## 5. Verification

- [x] 5.1 Update automated tests for event creation, active-event switching, and local-state migration from legacy event dates.
- [x] 5.2 Verify the create-event flow returns directly to contact capture for the new active event.
- [x] 5.3 Run available syntax checks and tests after the UI and model updates.
