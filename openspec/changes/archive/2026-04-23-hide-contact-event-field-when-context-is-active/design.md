## Context

The app now has a clearer active-event context on the main screen, but the new-contact form still repeats the event selector even when the user is already operating inside one selected event. That duplication slows capture and weakens the benefit of the active-event model.

This change is intentionally narrow: it only removes the visible event selector from the contact form when an active event context already exists, while keeping contact ownership and event association requirements intact.

## Goals / Non-Goals

**Goals:**

- Remove the visible event selector from the contact form when the app already has an active event context.
- Keep contact creation automatically bound to the current active event.
- Preserve the current validation rule that a contact must still belong to one owned event.
- Leave first-event setup and event switching outside the contact form unchanged.

**Non-Goals:**

- Changing how active event context is selected.
- Adding multi-event bulk capture or alternate event assignment from the contact form.
- Changing contact detail, filtering, or event-management flows beyond the implicit form binding.

## Decisions

### Use the active event as the form's source of truth

When an active event exists, the contact form should derive `eventId` from that active event state instead of rendering a visible field. This keeps the form shorter and aligns the UI with the already-selected context.

Alternative considered: keep the field visible but read-only. Rejected because it still takes vertical space and repeats information already shown in the event context header.

### Keep event validation in the domain layer

Even if the UI stops showing the event field, contact creation should still pass the active event ID into the same domain validation path. This preserves the invariant that every contact belongs to one owned event.

Alternative considered: bypass event validation in UI-only code. Rejected because it would weaken consistency and make the form behavior more fragile.

### Fall back to setup state when no active event exists

The form should only hide the event field when there is already an active event context. If no event exists, the app should continue showing the event-creation-first flow rather than attempting contact creation without an event.

## Risks / Trade-offs

- [Users may want to move a contact to another event from the form] -> Keep event switching available from the event context actions before starting the contact.
- [Implicit event association may become unclear] -> Keep the active event visible above the form so the current context is always apparent.
- [UI and domain behavior may drift] -> Continue validating contact creation against owned active events in the domain layer.
