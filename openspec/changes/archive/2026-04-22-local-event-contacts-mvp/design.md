## Context

The repository currently contains OpenSpec configuration but no application code. The MVP needs to produce a usable mobile-first web app quickly for event contact capture, without authentication, backend services, shared accounts, export, or cross-device sync.

The app is local-first: data lives in the user's browser on the device where it is created. Even so, the data model must include ownership and creation fields so it can later migrate toward login, backend persistence, shared events, and export without reshaping the whole domain.

## Goals / Non-Goals

**Goals:**

- Provide a responsive web app optimized for phone use during and shortly after event conversations.
- Let one local user create a lightweight profile, create events, create contacts, classify them, assign ratings, choose one or more next steps, browse with filters, and open a contact detail view.
- Persist all data locally across reloads using a versioned app-state schema.
- Model profile, event, and contact ownership explicitly even though this MVP has only one active local profile.

**Non-Goals:**

- Google login or any other authentication.
- Shared events, event invitation codes, multi-user collaboration, or visibility into another person's contacts.
- CSV export.
- Backend API or database.
- Cross-device sync.
- Full CRM pipeline, reminders, notifications, or activity history.

## Decisions

### Scaffold a small single-page web app

Build a simple responsive SPA because the repository has no existing frontend. A SPA keeps setup and iteration small for a same-day MVP while supporting the flows needed on mobile: profile setup, event selection, contact creation, filtered list, and contact detail.

Alternative considered: server-rendered app with backend persistence. Rejected for this MVP because it adds infrastructure before the product flow is validated.

### Store a versioned app state locally

Use browser local persistence under a stable key, `event_contacts_mvp_v1`, with an app-level `schemaVersion`.

```ts
type AppState = {
  schemaVersion: 1;
  activeProfileId: string | null;
  profiles: Profile[];
  events: Event[];
  contacts: Contact[];
};
```

This keeps reads and writes simple and makes future migrations explicit.

Alternative considered: IndexedDB. Rejected initially because the data volume is small and a single JSON state is enough for the MVP. IndexedDB can be introduced later if attachments, large notes, or higher volume require it.

### Keep backend-ready identifiers and ownership fields

Every entity uses generated string IDs and timestamps. Events and contacts carry local ownership fields:

```ts
type Profile = {
  id: string;
  displayName: string;
  companyName?: string;
  role?: string;
  createdAt: string;
  updatedAt: string;
};

type Event = {
  id: string;
  ownerProfileId: string;
  name: string;
  startsOn?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
};

type Contact = {
  id: string;
  eventId: string;
  ownerProfileId: string;
  createdByProfileId: string;
  name?: string;
  companyName?: string;
  role?: string;
  email?: string;
  phone?: string;
  linkedinUrl?: string;
  note: string;
  contactType: ContactType;
  rating: ContactRating;
  nextSteps: NextStep[];
  otherNextStep?: string;
  createdAt: string;
  updatedAt: string;
};
```

For this MVP, `ownerProfileId` and `createdByProfileId` will usually match. Later, `createdByProfileId` can map to the person who captured a shared contact.

### Require minimal data for fast capture

Contact creation should require an event, a type, a rating, at least one next step, and enough identity to recognize the contact later. A contact is recognizable when either `name` or `companyName` is provided. Notes are short but required because they carry the conversation context.

Alternative considered: require email or phone. Rejected because many event conversations produce only a name, company, LinkedIn, badge scan, or quick memory during capture.

### Use fixed classification enums

Use stable internal enum values with user-facing labels:

```ts
type ContactType =
  | "prospect"
  | "partner"
  | "supplier"
  | "press"
  | "talent"
  | "other";

type ContactRating = "high" | "medium" | "low";

type NextStep =
  | "send_email"
  | "schedule_meeting"
  | "connect_linkedin"
  | "send_material"
  | "introduce_someone"
  | "discard"
  | "other";
```

Ratings are defined by follow-up intent:

- `high`: the person expressed clear interest in learning more about the commercial offer and accepts a later call, meeting, or conversation.
- `medium`: there is possible fit or interest, but no concrete commitment.
- `low`: the contact is worth keeping, but has no immediate commercial opportunity.

### Filter contacts client-side

All MVP data is local and small, so filtering can happen in memory. The list filters by event, contact type, rating, and next step, always scoped to the active profile.

Alternative considered: query abstraction similar to a backend API. Rejected for the initial build, but selectors/helper functions should keep filtering logic centralized enough to replace later.

## Risks / Trade-offs

- Local-only data can be lost if the browser storage is cleared → make the limitation visible in product copy and avoid any automatic data deletion.
- Data does not sync across devices → keep the MVP scoped to one browser/device and preserve ownership fields for future backend migration.
- Single JSON persistence can become inefficient with high contact volume → acceptable for the expected MVP volume; migrate to IndexedDB or backend if needed.
- No authentication means identity is self-declared → acceptable because users can only see data on their own device in this version.
- Without contact editing, typos during event capture may be painful → keep the contact detail model ready for editing in a later iteration, but do not include editing in this MVP unless implementation discovers it is necessary for basic usability.
