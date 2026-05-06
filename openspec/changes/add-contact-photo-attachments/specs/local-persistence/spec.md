## ADDED Requirements

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
