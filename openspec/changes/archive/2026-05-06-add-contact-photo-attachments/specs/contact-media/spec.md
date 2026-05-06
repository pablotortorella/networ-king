## ADDED Requirements

### Requirement: Store contact media in separated groups

The system SHALL allow each contact to keep up to two general photos and up to one business card photo as separate media groups.

#### Scenario: Contact stores grouped media
- **WHEN** a contact has saved visual attachments
- **THEN** the system stores zero to two photos in the general photo group
- **AND** the system stores zero or one photo in the business card group

### Requirement: Preserve stable media references

The system SHALL associate saved media with the owning contact through stable references that survive app reloads.

#### Scenario: Contact reopened later
- **WHEN** the user reloads the app after saving contact media
- **THEN** the system restores the saved media references for that contact
- **AND** the contact still resolves its photos and business card photo

### Requirement: Remove unreferenced contact media

The system SHALL remove contact media that the user explicitly detaches from a contact during editing.

#### Scenario: Photo removed during edit
- **WHEN** the user removes a saved general photo or business card photo from a contact and saves the edit
- **THEN** the system deletes the detached media from contact storage
- **AND** the contact no longer references that media
