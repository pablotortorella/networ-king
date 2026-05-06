## Context

The current MVP already supports local profiles, events, and contact capture, but the main screen still treats event creation as a first-class action even after an event exists. During real use at an event, the primary repetitive action is creating contacts, so the UI hierarchy should make the active event feel like context and keep event-management actions available but secondary.

This change also expands event dates from a single optional date to an optional start/end range. That affects both the event data model and the compact event context shown in the UI.

## Goals / Non-Goals

**Goals:**

- Make the active event a compact contextual header element once at least one event exists.
- Move "create new event" out of the main screen's primary flow into a lower-prominence navigation surface.
- Keep event switching available from that same secondary surface.
- After creating an event, keep it active and immediately return the user to contact capture for that event.
- Support optional event start and end dates instead of a single event date.

**Non-Goals:**

- Adding collaboration, event sharing, or login.
- Redesigning contact capture fields beyond the event-context behavior change.
- Adding full event editing in this change unless needed to support the new secondary event actions surface.
- Changing persistence technology beyond small shape updates needed for the new event fields.

## Decisions

### Represent the active event in a compact top-level context bar

When events exist, the main screen should show the current event as contextual information near the top rather than a full event-creation form. This keeps orientation visible without competing with contact capture.

Alternative considered: leave the event form visible but collapsed. Rejected because even a collapsed form still frames event creation as a primary repeated task.

### Use a secondary event actions menu/sheet

Event switching and new-event creation should move into a secondary interaction surface such as a hamburger-triggered menu or a compact event action sheet. The specific control can adapt to the current UI, but the important design rule is that contact capture stays visually dominant.

Alternative considered: keep a visible "New event" button inline next to the header. Rejected because it still grants too much primary emphasis to an infrequent action.

### Automatically return to contact capture after event creation

Creating an event should set that event as active, close the secondary event-management surface, and place the user back into the main contact-capture flow for the newly created event. This matches the real usage pattern: create or switch event once, then capture many contacts.

Alternative considered: leave the user inside the event-management surface after creating an event. Rejected because it adds one more step before the main workflow resumes.

### Replace single event date with start and end dates

The event entity should store optional `startDate` and `endDate` fields rather than a single `startsOn` field. This better reflects real event spans and gives the compact event context enough information to orient the user.

Migration approach: when older local data includes the legacy single date field, treat it as both start and end for display and persistence migration, or map it to the start date while leaving end date empty if that better fits the implementation.

Alternative considered: keep the single date and only change UI hierarchy. Rejected because the product direction already calls for a fuller event context and this is a small, aligned data-model improvement.

## Risks / Trade-offs

- [Secondary actions become too hidden] -> Keep the event context visible and make the menu trigger clearly associated with it.
- [Switching events may become slower] -> Include event switching directly in the same secondary surface instead of burying it in deeper navigation.
- [Local stored events may use the old single-date field] -> Add a small compatibility path when loading persisted state.
- [More compact header may lose useful detail] -> Show the event name prominently and display the date range only when present.
