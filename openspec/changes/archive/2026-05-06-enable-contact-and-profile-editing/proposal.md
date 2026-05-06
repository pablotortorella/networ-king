## Why

The app currently supports fast capture but not correction or completion after the fact, which is a poor fit for real event usage where people often add or fix details a few minutes later. We also need a lightweight way to update the local user's own profile data without recreating it.

## What Changes

- Allow users to edit a contact from that contact's detail view.
- Reuse the existing contact creation form as the contact editing form, preloaded with the current contact data.
- Allow users to save contact edits while preserving the same contact identity and updating timestamps.
- Allow users to edit their own local profile data from a secondary settings/action surface.
- Keep contact and profile validation rules aligned with their existing creation flows.
- Do not include moving contacts across events, event editing, or change-history tracking in this iteration.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `contact-capture`: the contact form behavior expands to support editing with preloaded values in addition to creation.
- `contact-detail`: the contact detail view now includes an edit action and save flow back into the updated detail view.
- `local-profile`: the local profile capability expands from create-only to create-and-edit behavior.

## Impact

- Affects contact detail UI, contact form state management, and local persistence updates for existing contacts.
- Adds profile editing UI and update behavior for locally stored profile data.
- Requires consistent timestamp updates and validation reuse for edit flows.
