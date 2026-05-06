## MODIFIED Requirements

### Requirement: Create event contact

The system SHALL allow the active profile to create a contact associated with one owned event.

#### Scenario: Successful contact creation

- **WHEN** the active profile submits a contact within an active owned event context, with recognizable identity, note, type, rating, and at least one next step
- **THEN** the system stores the contact with generated ID, event ID, owner profile ID, created-by profile ID, timestamps, and submitted fields
- **AND** the system associates the contact with the active owned event context

#### Scenario: Missing required event

- **WHEN** the active profile attempts contact creation without an active owned event context
- **THEN** the system rejects the contact and asks for an event

## ADDED Requirements

### Requirement: Hide event field when context is active

The system SHALL not display a visible event field in the new-contact form when an active event context is already selected.

#### Scenario: Active event exists

- **WHEN** the active profile opens the new-contact form while an owned event is active
- **THEN** the system does not display a visible event field in the form
- **AND** the system uses the active event context for the new contact
