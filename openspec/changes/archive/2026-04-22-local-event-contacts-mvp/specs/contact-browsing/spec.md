## ADDED Requirements

### Requirement: List owned contacts

The system SHALL show a list of contacts owned by the active profile.

#### Scenario: Contact list opened

- **WHEN** the active profile opens the contact list
- **THEN** the system shows contacts whose owner profile ID matches the active profile ID

#### Scenario: Contact belongs to another profile

- **WHEN** a stored contact has an owner profile ID different from the active profile ID
- **THEN** the system excludes that contact from the list

### Requirement: Filter contacts

The system SHALL allow the active profile to filter visible contacts by event, contact type, rating, and next step.

#### Scenario: Event filter applied

- **WHEN** the active profile selects an event filter
- **THEN** the system shows only owned contacts associated with that event

#### Scenario: Type filter applied

- **WHEN** the active profile selects a contact type filter
- **THEN** the system shows only owned contacts with that contact type

#### Scenario: Rating filter applied

- **WHEN** the active profile selects a rating filter
- **THEN** the system shows only owned contacts with that rating

#### Scenario: Next step filter applied

- **WHEN** the active profile selects a next step filter
- **THEN** the system shows only owned contacts containing that next step

### Requirement: Combine filters

The system SHALL apply selected filters together.

#### Scenario: Multiple filters applied

- **WHEN** the active profile selects event, type, rating, or next step filters in combination
- **THEN** the system shows only owned contacts matching all selected filters

### Requirement: Mobile-friendly browsing

The system SHALL present the contact list and filters in a layout usable on phone-sized screens.

#### Scenario: Phone viewport

- **WHEN** the active profile views contacts on a phone-sized viewport
- **THEN** the system presents filters, contact summaries, and primary actions without horizontal scrolling
