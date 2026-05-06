## Why

Once the user already selected an active event, asking for the event again in the new-contact form adds friction and visual noise. The contact form should trust the active event context and stay focused on capture speed.

## What Changes

- Remove the visible "Evento" field from the new-contact form when an active event context is already selected.
- Keep new contacts automatically associated with the active event context.
- Preserve the existing requirement that a contact must still belong to one owned event.
- Keep first-event setup and event switching behavior unchanged outside the contact form itself.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `contact-capture`: the contact creation form behavior changes so the event association is implicit when the user already has an active event context.

## Impact

- Affects only the new-contact form and the way it derives the event for contact creation.
- No changes to login, collaboration, filtering, or contact detail behavior.
