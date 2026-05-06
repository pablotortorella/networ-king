## ADDED Requirements

### Requirement: Create local profile

The system SHALL allow a person to create a lightweight local profile before using event and contact features.

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
