## ADDED Requirements

### Requirement: Create event contact

The system SHALL allow the active profile to create a contact associated with one owned event.

#### Scenario: Successful contact creation

- **WHEN** the active profile submits a contact with a selected owned event, recognizable identity, note, type, rating, and at least one next step
- **THEN** the system stores the contact with generated ID, event ID, owner profile ID, created-by profile ID, timestamps, and submitted fields

#### Scenario: Missing required event

- **WHEN** the active profile submits a contact without a selected owned event
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
