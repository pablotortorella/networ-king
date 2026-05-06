# contact-detail Specification

## Purpose
TBD - created by archiving change local-event-contacts-mvp. Update Purpose after archive.
## Requirements
### Requirement: View contact detail

The system SHALL allow the active profile to open a detail view for an owned contact.

#### Scenario: Owned contact opened

- **WHEN** the active profile opens a contact from the list
- **THEN** the system shows the contact's identity, event, contact channels, note, type, rating, next steps, and timestamps when available
- **AND** the system provides an edit action for that owned contact

#### Scenario: Contact not owned by profile

- **WHEN** the active profile attempts to open a contact whose owner profile ID differs from the active profile ID
- **THEN** the system does not show that contact's details

### Requirement: Return from detail to list

The system SHALL allow the active profile to return from a contact detail view to the contact list.

#### Scenario: Back to list

- **WHEN** the active profile leaves the contact detail view
- **THEN** the system returns to the contact list without clearing the active filters

### Requirement: Edit contact from detail view

The system SHALL allow the active profile to start editing an owned contact from its detail view.

#### Scenario: Edit contact chosen

- **WHEN** the active profile activates the edit action from an owned contact's detail view
- **THEN** the system opens contact editing for that contact

### Requirement: Return to updated detail after edit

The system SHALL return the active profile to the updated contact detail view after saving a contact edit.

#### Scenario: Contact edit completed

- **WHEN** the active profile saves valid changes while editing a contact
- **THEN** the system shows the updated detail view for that same contact

### Requirement: Focus updated contact detail after save

The system SHALL move focus to the updated contact detail view after saving a contact edit.

#### Scenario: Contact edit saved

- **WHEN** the active profile saves valid changes while editing an owned contact
- **THEN** the system shows the updated detail view for that contact
- **AND** the system moves focus to that updated detail view
