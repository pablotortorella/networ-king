## 1. App Foundation

- [x] 1.1 Scaffold a small responsive single-page web app in the empty repository.
- [x] 1.2 Add shared domain types for profile, event, contact, contact type, rating, next step, and app state.
- [x] 1.3 Implement generated string IDs and ISO timestamp helpers for created and updated records.
- [x] 1.4 Establish mobile-first layout primitives for phone-sized use without horizontal scrolling.

## 2. Local Persistence

- [x] 2.1 Implement versioned local browser storage using the `event_contacts_mvp_v1` key and `schemaVersion: 1`.
- [x] 2.2 Implement state loading with an empty-state fallback when no saved data exists.
- [x] 2.3 Implement state saving after profile, event, and contact creation.
- [x] 2.4 Ensure persisted contacts include event ID, owner profile ID, created-by profile ID, and timestamps.

## 3. Profile And Event Flows

- [x] 3.1 Build the local profile creation flow with required display name and optional company and role.
- [x] 3.2 Gate event and contact features until an active local profile exists.
- [x] 3.3 Build event creation with required name and optional date and location.
- [x] 3.4 Build event selection/listing scoped to the active profile.

## 4. Contact Capture

- [x] 4.1 Build the mobile-first contact creation form for the selected event.
- [x] 4.2 Validate that each contact has either name or company name.
- [x] 4.3 Validate that each contact has a non-empty note, contact type, rating, and at least one next step.
- [x] 4.4 Support optional role, email, phone, LinkedIn URL, and other-next-step text.
- [x] 4.5 Persist created contacts under the active profile and selected event.

## 5. Contact Browsing And Detail

- [x] 5.1 Build the contact list scoped to the active profile.
- [x] 5.2 Add filters for event, contact type, rating, and next step.
- [x] 5.3 Ensure filters combine and preserve active profile ownership rules.
- [x] 5.4 Build contact summary rows/cards suitable for phone use.
- [x] 5.5 Build a contact detail view showing identity, event, channels, note, type, rating, next steps, and timestamps.
- [x] 5.6 Support returning from detail to list without clearing active filters.

## 6. Verification

- [x] 6.1 Verify the core happy path: create profile, create event, create contact, filter list, open detail, reload app, confirm data remains.
- [x] 6.2 Verify ownership filtering with test data that includes another profile's event/contact records.
- [x] 6.3 Verify phone-sized responsive layout for setup, capture, list, filters, and detail views.
- [x] 6.4 Run available build, lint, and test commands for the scaffolded app.
