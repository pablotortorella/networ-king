## MODIFIED Requirements

### Requirement: Create local profile

The system SHALL allow a person to create and later edit a lightweight local profile before using event and contact features.

#### Scenario: Successful profile creation

- **WHEN** the user enters a display name and submits the profile form
- **THEN** the system stores a profile with a generated ID, timestamps, and the provided display name
- **AND** the system sets that profile as the active profile

#### Scenario: Optional profile details

- **WHEN** the user provides company name or role while creating the profile
- **THEN** the system stores those optional details with the profile

## ADDED Requirements

### Requirement: Edit local profile

The system SHALL allow the active profile to update its own local profile data.

#### Scenario: Profile edit opened

- **WHEN** the active profile activates the profile edit action from the secondary action surface
- **THEN** the system shows the profile form with the current profile values preloaded

#### Scenario: Profile edit saved

- **WHEN** the active profile submits valid profile changes
- **THEN** the system updates the existing profile record
- **AND** the system preserves the profile ID and created timestamp
- **AND** the system updates the profile's updated timestamp
