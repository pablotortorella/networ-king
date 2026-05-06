# local-profile Specification

## Purpose
TBD - created by archiving change local-event-contacts-mvp. Update Purpose after archive.
## Requirements
### Requirement: Create local profile

The system SHALL allow a person to create and later edit a lightweight local profile before using event and contact features.

#### Scenario: Successful profile creation

- **WHEN** the user enters a display name and submits the profile form
- **THEN** the system stores a profile with a generated ID, timestamps, and the provided display name
- **AND** the system sets that profile as the active profile

#### Scenario: Optional profile details

- **WHEN** the user provides company name or role while creating the profile
- **THEN** the system stores those optional details with the profile

### Requirement: Require active profile for app data

The system MUST require an active local profile before the user can create or view events and contacts.

#### Scenario: No profile exists

- **WHEN** the app loads without a stored active profile
- **THEN** the system shows the profile creation flow before event or contact flows

#### Scenario: Profile exists

- **WHEN** the app loads with a stored active profile
- **THEN** the system makes that profile active and allows access to that profile's events and contacts

### Requirement: Isolate profile-owned data

The system SHALL scope event and contact visibility to the active local profile.

#### Scenario: Viewing owned data

- **WHEN** the active profile views the app
- **THEN** the system displays only events and contacts owned by that profile

#### Scenario: Data belongs to another profile

- **WHEN** stored data has an owner profile ID different from the active profile ID
- **THEN** the system does not include that data in event or contact views

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

### Requirement: Show branded welcome before profile use

The system SHALL show the welcome experience with Kleer branding before the user starts using profiles, events, and contacts.

#### Scenario: No profile exists

- **WHEN** the application loads without an active local profile
- **THEN** the system shows the welcome/profile setup experience branded as `Networ-King by Kleer`
- **AND** the system shows the Kleer logo at the bottom of that screen
