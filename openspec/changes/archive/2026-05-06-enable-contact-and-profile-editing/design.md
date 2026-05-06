## Context

The current app is optimized for quick contact capture during an event, but after a contact or local profile is created there is no way to correct mistakes or add missing information. In real event usage, users often capture minimal information first and complete it a few minutes later, so the product now needs lightweight editing without losing the speed and simplicity of the original flow.

The current contact form already contains most of the fields we want to edit, which makes it a strong candidate for reuse rather than creating a second, divergent editing UI.

## Goals / Non-Goals

**Goals:**

- Allow a user to edit an owned contact from the contact detail view.
- Reuse the existing contact form for editing, with current contact values preloaded.
- Save contact edits without changing the contact ID or event association, while updating `updatedAt`.
- Allow a user to edit their own local profile from a secondary action surface.
- Reuse existing validation rules so create and edit flows remain consistent.

**Non-Goals:**

- Moving a contact to another event.
- Editing event records in this change.
- Adding change history, audit logs, autosave, or collaboration-aware conflict handling.
- Introducing a separate settings area beyond the lightweight profile edit entry point.

## Decisions

### Reuse the contact create form for editing

Use the same form component/structure for both create and edit modes. In edit mode, prefill current values and save back into the existing contact record.

Alternative considered: a compact inline editor inside the detail view. Rejected because it would duplicate field definitions and validation while making the detail screen denser and harder to scan on mobile.

### Launch contact editing from the detail view

The contact detail screen should remain the place where users decide whether a record needs correction. From there, an explicit edit action transitions into the reusable form.

Alternative considered: allow editing directly from list cards. Rejected because it is too easy to trigger while browsing and it weakens the role of the detail view.

### Preserve contact identity and event association

Editing a contact updates mutable fields only. The system keeps `id`, `eventId`, `ownerProfileId`, `createdByProfileId`, and `createdAt`, and writes a new `updatedAt`.

Alternative considered: allow moving a contact across events during editing. Rejected for now because it changes ownership semantics and creates extra UI/validation complexity.

### Keep profile editing lightweight and local

Expose "Editar mis datos" from the existing secondary action surface and reuse the profile fields already used during initial setup. Saving updates the same local profile record and refreshes `updatedAt`.

Alternative considered: separate profile management screen. Rejected because the profile is still a lightweight local concept, not a full account system.

## Risks / Trade-offs

- [Create and edit flows may drift over time] -> Use a shared contact form model and common validation rules.
- [Editing may feel heavier than quick capture] -> Keep creation as the primary action and reveal editing only from detail/profile actions.
- [Users may expect event reassignment while editing] -> Keep event visible in detail, but do not make it editable in this iteration.
- [Profile editing entry point may be overlooked] -> Place it in the existing secondary action surface where users already manage context-level actions.
