# local-persistence Specification

## Purpose
TBD - created by archiving change local-event-contacts-mvp. Update Purpose after archive.
## Requirements
### Requirement: Persist local app state

The system SHALL persist profiles, events, and contacts locally in the browser.

#### Scenario: Data saved

- **WHEN** the active profile creates a profile, event, or contact
- **THEN** the system saves the updated app state to local browser persistence

#### Scenario: App reloaded

- **WHEN** the user reloads the app in the same browser
- **THEN** the system restores the previously saved profile, events, and contacts

### Requirement: Version persisted schema

The system SHALL include a schema version in persisted app state.

#### Scenario: Initial schema saved

- **WHEN** the system saves MVP app state
- **THEN** the persisted state includes schemaVersion 1

### Requirement: Preserve local data

The system MUST NOT automatically delete local profiles, events, or contacts during normal app use.

#### Scenario: App reopened later

- **WHEN** the user reopens the app in the same browser after previously creating data
- **THEN** the system keeps the existing local data available unless the browser storage was externally cleared

### Requirement: Use migration-friendly state shape

The system SHALL store data using profile, event, and contact entities with IDs and ownership fields.

#### Scenario: Contact persisted

- **WHEN** the system persists a contact
- **THEN** the contact includes event ID, owner profile ID, created-by profile ID, created timestamp, and updated timestamp

### Requirement: Persist contact media locally

The system SHALL persist contact media locally in the browser so saved photos remain available after reload.

#### Scenario: Media saved with contact

- **WHEN** the active profile saves a contact with one or more photos
- **THEN** the system stores the contact media locally in browser storage
- **AND** the system stores durable references from the contact to that media

### Requirement: Load contact media with existing contacts

The system SHALL load saved contact media when restoring previously persisted app state.

#### Scenario: App reopened with saved media

- **WHEN** the user reopens the app after saving contacts with media
- **THEN** the system restores both the contact state and the corresponding contact media

### Requirement: Support legacy contacts without media

The system MUST continue loading previously saved contacts that do not contain any media references.

#### Scenario: Legacy contact restored

- **WHEN** the app loads a contact created before contact media support existed
- **THEN** the system restores that contact successfully
- **AND** the contact behaves as having no saved media
