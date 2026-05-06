## Why

The current event screen gives event creation too much visual weight after setup, even though the main in-event job is capturing contacts quickly. We also need event date ranges so the active event context is clearer and better suited to real event usage.

## What Changes

- Change the main post-setup experience so the active event becomes contextual rather than a primary form on the main screen.
- After creating an event, automatically keep that event active and move the user directly into contact capture for that event.
- Move "create new event" into a secondary navigation/action surface with less prominence than contact capture.
- Allow users to switch the active event from that secondary event action surface.
- Expand event data to store both start date and end date instead of a single optional date.
- Show the active event context in a compact header treatment that supports quick orientation during mobile use.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `event-management`: event creation, event selection, and event metadata requirements change to support start/end dates and a secondary event action surface.
- `contact-capture`: the main app flow after event creation changes so contact capture becomes the primary next step inside the active event context.

## Impact

- Affects the event creation and event selection UI flow on the main mobile screen.
- Changes the event data model from one optional date field to start and end dates.
- Requires updates to active-event presentation in the header and post-create navigation behavior.
