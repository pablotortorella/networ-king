## ADDED Requirements

### Requirement: Reuse contact form for editing

The system SHALL use the contact form for both contact creation and contact editing.

#### Scenario: Edit form opened

- **WHEN** the active profile starts editing an owned contact
- **THEN** the system shows the contact form with the contact's current values preloaded

### Requirement: Save edited contact

The system SHALL save edits back into the existing owned contact record.

#### Scenario: Contact edit saved

- **WHEN** the active profile submits valid edits for an owned contact
- **THEN** the system updates the mutable contact fields in the existing record
- **AND** the system preserves the contact ID, event ID, owner profile ID, created-by profile ID, and created timestamp
- **AND** the system updates the contact's updated timestamp

#### Scenario: Contact edit invalid

- **WHEN** the active profile submits contact edits that violate the same required rules used for contact creation
- **THEN** the system rejects the edit and shows validation feedback
