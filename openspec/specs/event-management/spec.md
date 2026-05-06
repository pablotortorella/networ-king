# event-management Specification

## Purpose
TBD - created by archiving change local-event-contacts-mvp. Update Purpose after archive.
## Requirements
### Requirement: Create owned event

The system SHALL allow the active profile to create an event for grouping contacts.

#### Scenario: Successful event creation

- **WHEN** the active profile enters an event name and submits the event form
- **THEN** the system stores an event with a generated ID, owner profile ID, timestamps, and the provided name
- **AND** the system stores optional start date, end date, and location values when provided
- **AND** the system makes the new event the active event

#### Scenario: Optional event details

- **WHEN** the active profile provides a start date, end date, or location while creating an event
- **THEN** the system stores those optional details with the event

### Requirement: Select event context

The system SHALL allow the active profile to select an owned event as the current contact capture context.

#### Scenario: Event selected

- **WHEN** the active profile selects one of their events from the secondary event actions surface
- **THEN** the system uses that event as the default event for new contacts and contact list filtering
- **AND** the main screen remains focused on contact capture and browsing rather than showing event creation as a primary form

### Requirement: List owned events

The system SHALL list only events owned by the active profile.

#### Scenario: Event list shown

- **WHEN** the active profile opens the event actions surface
- **THEN** the system shows events whose owner profile ID matches the active profile ID

### Requirement: Prioritize active event context over event creation

The system SHALL treat the active event as compact contextual information on the main screen once at least one owned event exists.

#### Scenario: Event exists

- **WHEN** the active profile has at least one owned event
- **THEN** the system shows the active event in a compact context treatment on the main screen
- **AND** the system does not show new-event creation as a primary always-visible form on that main screen

#### Scenario: No event exists

- **WHEN** the active profile has no owned events
- **THEN** the system presents event creation as the required primary setup action

### Requirement: Offer secondary event actions

The system SHALL expose event creation and event switching through a secondary navigation or action surface with lower visual prominence than contact capture.

#### Scenario: Open event actions

- **WHEN** the active profile activates the event actions control from the active event context
- **THEN** the system shows available owned events and an option to create a new event

### Requirement: Display event date range in context

The system SHALL support optional event start and end dates for display in the active event context.

#### Scenario: Event has date range

- **WHEN** the active event has a start date, an end date, or both
- **THEN** the system displays the available event date information in the compact active-event context

