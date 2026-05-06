## Why

The current edit flows work functionally, but the page focus does not explicitly guide the user into the editing region or back to the updated result after saving. On mobile, that makes the interaction feel disjointed and can leave the user unsure whether the app moved to the right place.

## What Changes

- Move focus to the visible edit form when the user starts editing a contact or their own profile.
- After saving a profile edit, move focus back to the top of the page so the updated profile context is immediately visible.
- After saving a contact edit, return to the updated contact detail view and move focus there.
- Make these focus transitions explicit and consistent with the existing edit flows rather than relying on incidental browser behavior.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `contact-capture`: contact edit mode behavior changes to guide focus into the edit form and back into the updated result flow.
- `contact-detail`: returning from a saved contact edit now includes explicit focus on the updated detail view.
- `local-profile`: profile edit mode now includes explicit focus transitions into and out of the edit form.

## Impact

- Affects edit-mode state transitions and focus management in the UI.
- Improves mobile usability and confirmation after save without changing stored data shape.
