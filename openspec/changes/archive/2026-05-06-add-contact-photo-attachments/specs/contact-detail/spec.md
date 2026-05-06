## ADDED Requirements

### Requirement: Show saved contact photos

The system SHALL show saved general photos in the contact detail view.

#### Scenario: Contact has general photos
- **WHEN** the active profile opens a contact that has saved general photos
- **THEN** the detail view shows those photos as a dedicated Fotos section

### Requirement: Show saved business card photo

The system SHALL show the saved business card photo separately from general photos in the contact detail view.

#### Scenario: Contact has business card photo
- **WHEN** the active profile opens a contact that has a saved business card photo
- **THEN** the detail view shows it in a dedicated Tarjeta de contacto section

#### Scenario: Contact has no saved media
- **WHEN** the active profile opens a contact without photos or business card photo
- **THEN** the detail view omits those empty media sections
