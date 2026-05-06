## Why

We need a lightweight, mobile-first app that lets a person capture event conversations quickly during or shortly after an event. The first MVP should be usable today without login, backend setup, sync, or collaboration, while keeping the data model ready for those additions later.

## What Changes

- Add a local personal profile so the app can associate events and contacts with the current person.
- Add event creation so contacts can be grouped by event.
- Add contact creation with basic identity fields, optional contact channels, a short note, type, rating, and one or more next steps.
- Add mobile-first contact list browsing with filters for event, type, rating, and next steps.
- Add a contact detail view summarizing all captured information for follow-up.
- Persist all MVP data locally in the browser with a versioned schema.
- Keep each local profile isolated: the current user can see only their own locally created contacts.

## Capabilities

### New Capabilities

- `local-profile`: create and maintain a lightweight personal profile stored locally.
- `event-management`: create and select events owned by the local profile.
- `contact-capture`: create contacts associated with an event, including note, classification, rating, and next steps.
- `contact-browsing`: view and filter the current profile's contacts.
- `contact-detail`: view the full summary for an individual contact.
- `local-persistence`: persist app data locally with a migration-friendly schema.

### Modified Capabilities

- None.

## Impact

- Introduces local browser persistence for profile, event, and contact data.
- Adds mobile-first UI flows for setup, event selection, contact capture, list filtering, and contact detail viewing.
- No authentication, backend API, shared events, CSV export, or cross-device sync are included in this MVP.
