const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const D = require("../src/domain.js");

function memoryStorage() {
  const data = new Map();
  return {
    getItem(key) {
      return data.has(key) ? data.get(key) : null;
    },
    setItem(key, value) {
      data.set(key, value);
    }
  };
}

test("creates profile, event, contact and persists schema version", () => {
  const storage = memoryStorage();
  const profile = D.createProfile({
    displayName: "Pablo",
    companyName: "NetworKing"
  });
  const event = D.createEvent(
    {
      name: "Expo B2B",
      startDate: "2026-04-23",
      endDate: "2026-04-24",
      location: "La Rural"
    },
    profile.id
  );
  const contact = D.createContact(
    {
      eventId: event.id,
      name: "Laura",
      companyName: "Acme",
      note: "Quiere conocer la oferta y acepta reunion.",
      contactType: "prospect",
      rating: "high",
      nextSteps: ["send_email", "schedule_meeting"]
    },
    profile.id,
    [event.id]
  );

  const state = {
    ...D.emptyState(),
    activeProfileId: profile.id,
    activeEventId: event.id,
    profiles: [profile],
    events: [event],
    contacts: [contact]
  };

  D.saveState(storage, state);
  const loaded = D.loadState(storage);

  assert.equal(loaded.schemaVersion, 1);
  assert.equal(loaded.events[0].startDate, "2026-04-23");
  assert.equal(loaded.events[0].endDate, "2026-04-24");
  assert.equal(loaded.contacts[0].eventId, event.id);
  assert.equal(loaded.contacts[0].ownerProfileId, profile.id);
  assert.equal(loaded.contacts[0].createdByProfileId, profile.id);
  assert.ok(loaded.contacts[0].createdAt);
  assert.ok(loaded.contacts[0].updatedAt);
});

test("rejects contacts without identity, note, event or next step", () => {
  const profile = D.createProfile({ displayName: "Pablo" });
  const event = D.createEvent({ name: "Evento" }, profile.id);
  const valid = {
    eventId: event.id,
    name: "Laura",
    note: "Hablamos de ventas.",
    contactType: "prospect",
    rating: "medium",
    nextSteps: ["send_email"]
  };

  assert.throws(() => D.createContact({ ...valid, eventId: "" }, profile.id, [event.id]), /evento/);
  assert.throws(() => D.createContact({ ...valid, name: "" }, profile.id, [event.id]), /nombre o empresa/);
  assert.throws(() => D.createContact({ ...valid, note: "" }, profile.id, [event.id]), /nota breve/);
  assert.throws(() => D.createContact({ ...valid, nextSteps: [] }, profile.id, [event.id]), /siguiente paso/);
});

test("filters contacts by owner and combined filters", () => {
  const profile = { id: "profile_a" };
  const state = {
    ...D.emptyState(),
    activeProfileId: profile.id,
    events: [
      { id: "event_a", ownerProfileId: "profile_a", name: "A" },
      { id: "event_b", ownerProfileId: "profile_b", name: "B" }
    ],
    contacts: [
      {
        id: "contact_a",
        eventId: "event_a",
        ownerProfileId: "profile_a",
        contactType: "prospect",
        rating: "high",
        nextSteps: ["send_email"],
        createdAt: "2026-04-22T10:00:00.000Z"
      },
      {
        id: "contact_b",
        eventId: "event_a",
        ownerProfileId: "profile_a",
        contactType: "partner",
        rating: "low",
        nextSteps: ["discard"],
        createdAt: "2026-04-22T11:00:00.000Z"
      },
      {
        id: "contact_other",
        eventId: "event_b",
        ownerProfileId: "profile_b",
        contactType: "prospect",
        rating: "high",
        nextSteps: ["send_email"],
        createdAt: "2026-04-22T12:00:00.000Z"
      }
    ]
  };

  const result = D.filterContacts(state, {
    eventId: "event_a",
    contactType: "prospect",
    rating: "high",
    nextStep: "send_email"
  });

  assert.deepEqual(result.map((contact) => contact.id), ["contact_a"]);
  assert.equal(D.findOwnedContact(state, "contact_other"), null);
});

test("migrates legacy event date and resolves active event from owned events", () => {
  const storage = memoryStorage();
  storage.setItem(
    D.STORAGE_KEY,
    JSON.stringify({
      schemaVersion: 1,
      activeProfileId: "profile_a",
      activeEventId: "event_missing",
      profiles: [{ id: "profile_a", displayName: "Pablo" }],
      events: [
        {
          id: "event_a",
          ownerProfileId: "profile_a",
          name: "Expo Legacy",
          startsOn: "2026-05-01"
        },
        {
          id: "event_b",
          ownerProfileId: "profile_b",
          name: "Otro"
        }
      ],
      contacts: []
    })
  );

  const loaded = D.loadState(storage);
  const activeEvent = D.getActiveEvent(loaded);

  assert.equal(loaded.events[0].startDate, "2026-05-01");
  assert.equal(loaded.events[0].endDate, "2026-05-01");
  assert.equal(D.getActiveEventId(loaded), "event_a");
  assert.equal(activeEvent.name, "Expo Legacy");
});

test("contact form no longer renders a visible required event field", () => {
  const appSource = fs.readFileSync(path.join(__dirname, "..", "src", "app.js"), "utf8");

  assert.doesNotMatch(appSource, /<span>Evento \*<\/span>/);
});

test("updates profile while preserving identity and created timestamp", () => {
  const profile = D.createProfile({
    displayName: "Pablo",
    companyName: "NetworKing",
    role: "Socio"
  });

  const updated = D.updateProfile(profile, {
    displayName: "Pablo S.",
    companyName: "NetworKing Labs",
    role: "Co-founder"
  });

  assert.equal(updated.id, profile.id);
  assert.equal(updated.createdAt, profile.createdAt);
  assert.equal(updated.displayName, "Pablo S.");
  assert.equal(updated.companyName, "NetworKing Labs");
  assert.equal(updated.role, "Co-founder");
  assert.match(updated.updatedAt, /\d{4}-\d{2}-\d{2}T/);
});

test("updates contact while preserving identity, event, and created timestamp", () => {
  const profile = D.createProfile({ displayName: "Pablo" });
  const event = D.createEvent({ name: "Expo" }, profile.id);
  const contact = D.createContact(
    {
      eventId: event.id,
      name: "Laura",
      note: "Primer charla.",
      contactType: "prospect",
      rating: "medium",
      nextSteps: ["send_email"]
    },
    profile.id,
    [event.id]
  );

  const updated = D.updateContact(
    contact,
    {
      name: "Laura Gomez",
      companyName: "Acme",
      role: "Head of Sales",
      email: "laura@acme.com",
      phone: "",
      linkedinUrl: "",
      note: "Pide reunion la semana proxima.",
      contactType: "prospect",
      rating: "high",
      nextSteps: ["send_email", "schedule_meeting"],
      otherNextStep: ""
    },
    profile.id,
    [event.id]
  );

  assert.equal(updated.id, contact.id);
  assert.equal(updated.eventId, contact.eventId);
  assert.equal(updated.createdAt, contact.createdAt);
  assert.equal(updated.ownerProfileId, contact.ownerProfileId);
  assert.equal(updated.name, "Laura Gomez");
  assert.equal(updated.companyName, "Acme");
  assert.equal(updated.rating, "high");
  assert.deepEqual(updated.nextSteps, ["send_email", "schedule_meeting"]);
  assert.match(updated.updatedAt, /\d{4}-\d{2}-\d{2}T/);
});

test("validates contact media limits", () => {
  const profile = D.createProfile({ displayName: "Pablo" });
  const event = D.createEvent({ name: "Expo" }, profile.id);
  const base = {
    eventId: event.id,
    name: "Laura",
    note: "Conversamos de partnership.",
    contactType: "partner",
    rating: "medium",
    nextSteps: ["send_email"]
  };

  assert.throws(
    () =>
      D.createContact(
        {
          ...base,
          photos: [
            { id: "photo_1", name: "uno.jpg" },
            { id: "photo_2", name: "dos.jpg" },
            { id: "photo_3", name: "tres.jpg" }
          ]
        },
        profile.id,
        [event.id]
      ),
    /Fotos admite hasta dos imagenes/
  );

  assert.throws(
    () =>
      D.createContact(
        {
          ...base,
          businessCardPhoto: [
            { id: "card_1", name: "frente.jpg" },
            { id: "card_2", name: "dorso.jpg" }
          ]
        },
        profile.id,
        [event.id]
      ),
    /Tarjeta de contacto admite solo una imagen/
  );
});

test("loads legacy contacts without media and preserves saved media refs on update", () => {
  const storage = memoryStorage();
  storage.setItem(
    D.STORAGE_KEY,
    JSON.stringify({
      schemaVersion: 1,
      activeProfileId: "profile_a",
      activeEventId: "event_a",
      profiles: [{ id: "profile_a", displayName: "Pablo" }],
      events: [{ id: "event_a", ownerProfileId: "profile_a", name: "Expo" }],
      contacts: [
        {
          id: "contact_legacy",
          eventId: "event_a",
          ownerProfileId: "profile_a",
          createdByProfileId: "profile_a",
          name: "Laura",
          note: "Sin media",
          contactType: "prospect",
          rating: "medium",
          nextSteps: ["send_email"],
          createdAt: "2026-05-01T10:00:00.000Z",
          updatedAt: "2026-05-01T10:00:00.000Z"
        }
      ]
    })
  );

  const loaded = D.loadState(storage);
  assert.deepEqual(loaded.contacts[0].photos, []);
  assert.equal(loaded.contacts[0].businessCardPhoto, undefined);

  const updated = D.updateContact(
    {
      ...loaded.contacts[0],
      photos: [{ id: "photo_1", name: "uno.jpg", kind: "photo" }],
      businessCardPhoto: { id: "card_1", name: "tarjeta.jpg", kind: "business-card" }
    },
    {
      name: "Laura Gomez",
      companyName: "Acme",
      role: "",
      email: "",
      phone: "",
      linkedinUrl: "",
      note: "Actualizado.",
      contactType: "prospect",
      rating: "high",
      nextSteps: ["send_email"],
      otherNextStep: "",
      photos: [{ id: "photo_1", name: "uno.jpg", kind: "photo" }],
      businessCardPhoto: { id: "card_1", name: "tarjeta.jpg", kind: "business-card" }
    },
    "profile_a",
    ["event_a"]
  );

  assert.deepEqual(updated.photos, [{ id: "photo_1", name: "uno.jpg", kind: "photo" }]);
  assert.deepEqual(updated.businessCardPhoto, {
    id: "card_1",
    name: "tarjeta.jpg",
    kind: "business-card"
  });
});

test("app source exposes contact and profile edit actions", () => {
  const appSource = fs.readFileSync(path.join(__dirname, "..", "src", "app.js"), "utf8");

  assert.match(appSource, /Editar mis datos/);
  assert.match(appSource, /Editar contacto|>Editar</);
});

test("app source exposes stable focus targets for edit transitions", () => {
  const appSource = fs.readFileSync(path.join(__dirname, "..", "src", "app.js"), "utf8");

  assert.match(appSource, /id="page-title"/);
  assert.match(appSource, /id="contact-detail-title"/);
  assert.match(appSource, /id="profile-edit-title"/);
  assert.match(appSource, /pendingFocusSelector = "#contact-edit-title"/);
  assert.match(appSource, /focusContactEditForm/);
  assert.match(appSource, /focusContactDetail/);
  assert.match(appSource, /focusProfileEditForm/);
  assert.match(appSource, /focusTopContext/);
});

test("app source exposes contact media inputs and media store wiring", () => {
  const appSource = fs.readFileSync(path.join(__dirname, "..", "src", "app.js"), "utf8");
  const htmlSource = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");

  assert.match(appSource, /Tarjeta de contacto/);
  assert.match(appSource, /input name="photos" type="file"/);
  assert.match(appSource, /input name="businessCardPhoto" type="file"/);
  assert.match(appSource, /NetworKingMediaStore/);
  assert.match(htmlSource, /src\/media-store\.js/);
});
