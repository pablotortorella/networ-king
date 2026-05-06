## Context

The app now supports editing contacts and the local profile, but the transition into and out of edit mode still depends too much on incidental page position and browser behavior. On a phone, users need a stronger sense that the interface has moved to the edit form they requested and then returned them to the updated result after save.

This is not a data-model change. It is a UX and accessibility improvement focused on explicit focus placement during edit transitions.

## Goals / Non-Goals

**Goals:**

- Move keyboard/screen-reader focus into the edit form when the user starts editing a contact or profile.
- Make the page scroll and focus land on the visible editing region rather than leaving the user at the previous scroll position.
- After saving a contact edit, return to the updated detail view and place focus there.
- After saving a profile edit, return focus to the top-of-page context so the updated profile presentation is immediately apparent.

**Non-Goals:**

- Redesigning edit forms themselves.
- Changing validation or persistence rules for contacts or profiles.
- Introducing general-purpose focus management for every view transition in the app.

## Decisions

### Treat edit transitions as explicit focus targets

When entering edit mode, the app should focus the first meaningful input in the edit form and scroll that form into view if needed. This makes the transition legible for both touch users and assistive technology users.

Alternative considered: only scrolling without moving focus. Rejected because it is weaker feedback for keyboard and screen-reader navigation.

### Return focus to the updated result, not just the page

After saving a contact edit, the app should focus the contact detail region or its heading so the updated record is clearly the current result. After saving a profile edit, the app should return focus to the top-level page/header region where the updated profile context is shown.

Alternative considered: focus only the success notice. Rejected because the notice is transient and does not represent the updated destination state.

### Reuse the existing pending-focus mechanism

The app already contains a small pending-focus pattern for the create-contact flow. Extend that approach with named targets for contact edit form, updated contact detail, profile edit form, and top-of-page context instead of introducing a larger focus framework.

Alternative considered: add a separate focus manager abstraction. Rejected because the app is still small and can stay clear with a few explicit targets.

## Risks / Trade-offs

- [Focus targets may break if markup changes] -> Target stable ids or clearly owned landmarks/headings instead of brittle selectors alone.
- [Automatic focus movement may feel jumpy] -> Limit it to edit entry and post-save completion, not every render.
- [Profile save destination may feel ambiguous] -> Focus the top-of-page heading or profile context element that visibly reflects the updated data.
