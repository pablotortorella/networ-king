## ADDED Requirements

### Requirement: Attach general contact photos

The system SHALL allow the active profile to attach up to two general photos to a contact during creation and editing.

#### Scenario: General photos selected
- **WHEN** the active profile selects one or two image files in the Fotos section
- **THEN** the system shows those selections as general contact photos for the pending contact save

#### Scenario: Too many general photos selected
- **WHEN** the active profile attempts to save a contact with more than two general photos
- **THEN** the system rejects the save
- **AND** the system explains that Fotos supports at most two images

### Requirement: Attach one business card photo

The system SHALL allow the active profile to attach one business card photo to a contact during creation and editing.

#### Scenario: Business card selected
- **WHEN** the active profile selects an image file in the Tarjeta de contacto section
- **THEN** the system shows that selection as the pending business card photo

#### Scenario: More than one business card photo provided
- **WHEN** the active profile attempts to save a contact with more than one business card photo
- **THEN** the system rejects the save
- **AND** the system explains that Tarjeta de contacto supports only one image

### Requirement: Keep saved media while editing contact

The system SHALL let the active profile review and selectively remove or replace saved media while editing a contact.

#### Scenario: Edit form opened with saved media
- **WHEN** the active profile opens contact editing for a contact that already has saved photos
- **THEN** the system shows the currently saved general photos and business card photo

#### Scenario: One saved photo removed
- **WHEN** the active profile removes one saved photo or replaces the business card photo before saving
- **THEN** the system applies only the requested media changes to that contact on save
