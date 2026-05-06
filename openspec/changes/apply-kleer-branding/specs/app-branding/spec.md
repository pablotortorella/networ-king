## ADDED Requirements

### Requirement: Show branded app identity

The system SHALL present the application with the visible identity `Networ-King by Kleer`.

#### Scenario: App header shown
- **WHEN** the user views the application shell
- **THEN** the system shows `Networ-King by Kleer` as the visible app identity

### Requirement: Show global branded footer

The system SHALL show a branded footer at the bottom of the experience.

#### Scenario: Footer visible in app
- **WHEN** the user views the onboarding screen or the main in-app experience
- **THEN** the system shows a footer with `© 2026 Networ-King by Kleer`
- **AND** the system shows the Kleer logo below that copyright text

### Requirement: Use Kleer favicon locally

The system SHALL serve the Kleer favicon from a local project asset.

#### Scenario: App loaded in browser tab
- **WHEN** the application document is loaded in a browser
- **THEN** the browser tab uses the Kleer favicon from a local asset path

### Requirement: Use Kleer-aligned background palette

The system SHALL use `#204864` as the main background base for the application experience.

#### Scenario: App background rendered
- **WHEN** the user opens the application
- **THEN** the main page background uses a palette anchored on `#204864`
- **AND** the foreground content remains visually legible on that background
