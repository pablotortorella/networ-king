## ADDED Requirements

### Requirement: Focus profile edit form on entry

The system SHALL move focus to the profile edit form when the active profile starts editing their local profile.

#### Scenario: Profile edit opened

- **WHEN** the active profile activates the profile edit action
- **THEN** the system shows the profile edit form
- **AND** the system moves focus to that edit form region

### Requirement: Focus top of page after profile save

The system SHALL move focus to the top-of-page context after saving valid profile edits.

#### Scenario: Profile edit saved

- **WHEN** the active profile saves valid profile changes
- **THEN** the system updates the existing profile record
- **AND** the system returns focus to the top-of-page context that reflects the updated profile information
