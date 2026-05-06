## ADDED Requirements

### Requirement: Create owned event

The system SHALL allow the active profile to create an event for grouping contacts.

#### Scenario: Successful event creation

- **WHEN** the active profile enters an event name and submits the event form
- **THEN** the system stores an event with a generated ID, owner profile ID, timestamps, and the provided name

#### Scenario: Optional event details

- **WHEN** the active profile provides a date or location while creating an event
- **THEN** the system stores those optional details with the event

### Requirement: Select event context

The system SHALL allow the active profile to select an owned event as the current contact capture context.

#### Scenario: Event selected

- **WHEN** the active profile selects one of their events
- **THEN** the system uses that event as the default event for new contacts and contact list filtering

### Requirement: List owned events

The system SHALL list only events owned by the active profile.

#### Scenario: Event list shown

- **WHEN** the active profile opens the event selection area
- **THEN** the system shows events whose owner profile ID matches the active profile ID
