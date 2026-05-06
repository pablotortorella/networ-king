## 1. Extend Contact Media Model

- [x] 1.1 Add contact media reference fields to the contact model and keep them optional for legacy contacts.
- [x] 1.2 Add domain validation for up to two general photos and up to one business card photo during contact creation and editing.
- [x] 1.3 Add domain-level support for preserving, removing, and replacing media references when editing a contact.

## 2. Add Local Media Persistence

- [x] 2.1 Create a browser media storage module backed by `IndexedDB` for saving, loading, and deleting contact media records.
- [x] 2.2 Update app persistence flow so contacts keep durable media references in structured state while blobs remain in media storage.
- [x] 2.3 Ensure existing saved contacts without media continue loading correctly after the persistence changes.

## 3. Update Contact Create And Edit UX

- [x] 3.1 Extend the contact form with separate `Fotos` and `Tarjeta de contacto` inputs, previews, and limit messaging.
- [x] 3.2 Support showing existing saved media in contact edit mode with per-item remove or replace actions.
- [x] 3.3 Wire form submission to persist newly selected media, retain untouched media, and delete removed media.

## 4. Show Media In Contact Detail

- [x] 4.1 Add dedicated detail sections for saved general photos and the saved business card photo.
- [x] 4.2 Omit empty media sections when a contact has no saved media.

## 5. Verification

- [x] 5.1 Add or update automated tests for contact media validation, legacy contact loading, and media-aware contact updates.
- [x] 5.2 Verify create and edit flows for adding, removing, and replacing contact photos and business card photo.
- [x] 5.3 Run available syntax checks and tests after the contact media changes.
