## ADDED Requirements

### Requirement: View contact detail

The system SHALL allow the active profile to open a detail view for an owned contact.

#### Scenario: Owned contact opened

- **WHEN** the active profile opens a contact from the list
- **THEN** the system shows the contact's identity, event, contact channels, note, type, rating, next steps, and timestamps when available

#### Scenario: Contact not owned by profile

- **WHEN** the active profile attempts to open a contact whose owner profile ID differs from the active profile ID
- **THEN** the system does not show that contact's details

### Requirement: Return from detail to list

The system SHALL allow the active profile to return from a contact detail view to the contact list.

#### Scenario: Back to list

- **WHEN** the active profile leaves the contact detail view
- **THEN** the system returns to the contact list without clearing the active filters
