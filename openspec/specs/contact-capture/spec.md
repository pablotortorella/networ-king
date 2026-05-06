# contact-capture Specification

## Purpose
TBD - created by archiving change local-event-contacts-mvp. Update Purpose after archive.
## Requirements
### Requirement: Create event contact

The system SHALL allow the active profile to create a contact associated with one owned event.

#### Scenario: Successful contact creation

- **WHEN** the active profile submits a contact within an active owned event context, with recognizable identity, note, type, rating, and at least one next step
- **THEN** the system stores the contact with generated ID, event ID, owner profile ID, created-by profile ID, timestamps, and submitted fields
- **AND** the system associates the contact with the active owned event context

#### Scenario: Missing required event

- **WHEN** the active profile attempts contact creation without an active owned event context
- **THEN** the system rejects the contact and asks for an event

### Requirement: Capture recognizable identity

The system MUST require enough identity information to recognize the contact later.

#### Scenario: Name or company provided

- **WHEN** the active profile submits a contact with either name or company name
- **THEN** the system accepts the contact identity fields

#### Scenario: No recognizable identity

- **WHEN** the active profile submits a contact without name and without company name
- **THEN** the system rejects the contact and asks for at least one of those fields

### Requirement: Capture short note

The system SHALL require a brief note describing the conversation or context.

#### Scenario: Note provided

- **WHEN** the active profile submits a contact with a non-empty note
- **THEN** the system stores the note with the contact

#### Scenario: Note missing

- **WHEN** the active profile submits a contact without a note
- **THEN** the system rejects the contact and asks for a brief note

### Requirement: Classify contact type

The system SHALL allow the active profile to classify a contact by type.

#### Scenario: Contact type selected

- **WHEN** the active profile selects prospect, partner, supplier, press, talent, or other
- **THEN** the system stores the selected contact type

### Requirement: Rate opportunity quality

The system SHALL allow the active profile to assign a commercial opportunity rating.

#### Scenario: High rating selected

- **WHEN** the active profile selects high rating
- **THEN** the system records that the contact expressed clear interest in learning more and accepts a later call, meeting, or conversation

#### Scenario: Medium or low rating selected

- **WHEN** the active profile selects medium or low rating
- **THEN** the system stores the selected rating for later filtering

### Requirement: Mark multiple next steps

The system SHALL allow the active profile to select one or more follow-up next steps for a contact.

#### Scenario: Multiple next steps selected

- **WHEN** the active profile selects more than one next step
- **THEN** the system stores all selected next steps with the contact

#### Scenario: Other next step selected

- **WHEN** the active profile selects other as a next step
- **THEN** the system allows the active profile to provide free-text details for that next step

#### Scenario: No next step selected

- **WHEN** the active profile submits a contact without any next step
- **THEN** the system rejects the contact and asks for at least one next step

### Requirement: Return to contact capture after event creation

The system SHALL return the user to contact capture after creating a new event.

#### Scenario: Event created from secondary surface

- **WHEN** the active profile creates a new event from the secondary event actions surface
- **THEN** the system keeps that event active
- **AND** the system returns focus to the main contact-capture experience for that event

### Requirement: Hide event field when context is active

The system SHALL not display a visible event field in the new-contact form when an active event context is already selected.

#### Scenario: Active event exists

- **WHEN** the active profile opens the new-contact form while an owned event is active
- **THEN** the system does not display a visible event field in the form
- **AND** the system uses the active event context for the new contact

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

### Requirement: Focus contact edit form on entry

The system SHALL move focus to the contact edit form when the active profile starts editing an owned contact.

#### Scenario: Contact edit opened

- **WHEN** the active profile activates edit from an owned contact detail view
- **THEN** the system shows the contact edit form
- **AND** the system moves focus to that edit form region
