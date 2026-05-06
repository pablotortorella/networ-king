(function initDomain(globalScope) {
  "use strict";

  const STORAGE_KEY = "event_contacts_mvp_v1";
  const SCHEMA_VERSION = 1;

  const CONTACT_TYPES = [
    { value: "prospect", label: "Prospecto" },
    { value: "partner", label: "Partner" },
    { value: "supplier", label: "Proveedor" },
    { value: "press", label: "Prensa" },
    { value: "talent", label: "Talento" },
    { value: "other", label: "Otro" }
  ];

  const RATINGS = [
    {
      value: "high",
      label: "Alta",
      description: "Acepta llamada, reunion o siguiente conversacion."
    },
    {
      value: "medium",
      label: "Media",
      description: "Hay fit o interes posible, sin compromiso concreto."
    },
    {
      value: "low",
      label: "Baja",
      description: "Contacto util, sin oportunidad inmediata."
    }
  ];

  const NEXT_STEPS = [
    { value: "send_email", label: "Enviar email" },
    { value: "schedule_meeting", label: "Agendar reunion" },
    { value: "connect_linkedin", label: "Conectar LinkedIn" },
    { value: "send_material", label: "Enviar material" },
    { value: "introduce_someone", label: "Presentar a alguien" },
    { value: "discard", label: "Descartar" },
    { value: "other", label: "Otro" }
  ];

  function emptyState() {
    return {
      schemaVersion: SCHEMA_VERSION,
      activeProfileId: null,
      activeEventId: null,
      profiles: [],
      events: [],
      contacts: []
    };
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function generateId(prefix) {
    const random =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2) + Date.now().toString(36);
    return `${prefix}_${random}`;
  }

  function normalizeText(value) {
    return typeof value === "string" ? value.trim() : "";
  }

  function optionalText(value) {
    const normalized = normalizeText(value);
    return normalized ? normalized : undefined;
  }

  function normalizeMediaRef(ref, kind) {
    if (!ref || typeof ref !== "object") {
      return null;
    }

    const id = normalizeText(ref.id);
    if (!id) {
      return null;
    }

    const name = optionalText(ref.name) || "Imagen";
    return {
      id,
      name,
      kind
    };
  }

  function normalizePhotos(value) {
    if (!Array.isArray(value)) {
      return [];
    }

    return value
      .map((ref) => normalizeMediaRef(ref, "photo"))
      .filter(Boolean)
      .slice(0, 2);
  }

  function normalizeBusinessCardPhoto(value) {
    return normalizeMediaRef(value, "business-card") || undefined;
  }

  function validateContactMedia(input) {
    const rawPhotos = Array.isArray(input.photos) ? input.photos : [];
    const rawBusinessCard = Array.isArray(input.businessCardPhoto)
      ? input.businessCardPhoto
      : input.businessCardPhoto
        ? [input.businessCardPhoto]
        : [];
    const photos = normalizePhotos(rawPhotos);
    const businessCardPhoto = normalizeBusinessCardPhoto(rawBusinessCard[0]);

    if (rawPhotos.length > 2) {
      throw new Error("Fotos admite hasta dos imagenes.");
    }
    if (rawBusinessCard.length > 1) {
      throw new Error("Tarjeta de contacto admite solo una imagen.");
    }
    if (rawBusinessCard.length === 1 && !businessCardPhoto) {
      throw new Error("La tarjeta de contacto debe ser una imagen valida.");
    }

    return {
      photos,
      businessCardPhoto
    };
  }

  function createProfile(input) {
    const displayName = normalizeText(input.displayName);
    if (!displayName) {
      throw new Error("El nombre es obligatorio.");
    }

    const timestamp = nowIso();
    return {
      id: generateId("profile"),
      displayName,
      companyName: optionalText(input.companyName),
      role: optionalText(input.role),
      createdAt: timestamp,
      updatedAt: timestamp
    };
  }

  function updateProfile(existingProfile, input) {
    const displayName = normalizeText(input.displayName);
    if (!displayName) {
      throw new Error("El nombre es obligatorio.");
    }

    return {
      ...existingProfile,
      displayName,
      companyName: optionalText(input.companyName),
      role: optionalText(input.role),
      updatedAt: nowIso()
    };
  }

  function createEvent(input, ownerProfileId) {
    const name = normalizeText(input.name);
    if (!ownerProfileId) {
      throw new Error("Primero crea un perfil.");
    }
    if (!name) {
      throw new Error("El nombre del evento es obligatorio.");
    }

    const timestamp = nowIso();
    return {
      id: generateId("event"),
      ownerProfileId,
      name,
      startDate: optionalText(input.startDate),
      endDate: optionalText(input.endDate),
      location: optionalText(input.location),
      createdAt: timestamp,
      updatedAt: timestamp
    };
  }

  function isAllowed(value, options) {
    return options.some((option) => option.value === value);
  }

  function createContact(input, activeProfileId, ownedEventIds) {
    const eventId = normalizeText(input.eventId);
    const name = optionalText(input.name);
    const companyName = optionalText(input.companyName);
    const note = normalizeText(input.note);
    const contactType = normalizeText(input.contactType);
    const rating = normalizeText(input.rating);
    const nextSteps = Array.isArray(input.nextSteps)
      ? Array.from(new Set(input.nextSteps.map(normalizeText).filter(Boolean)))
      : [];

    if (!activeProfileId) {
      throw new Error("Primero crea un perfil.");
    }
    if (!eventId || !ownedEventIds.includes(eventId)) {
      throw new Error("Selecciona un evento propio.");
    }
    if (!name && !companyName) {
      throw new Error("Carga nombre o empresa para reconocer el contacto.");
    }
    if (!note) {
      throw new Error("Agrega una nota breve de la conversacion.");
    }
    if (!isAllowed(contactType, CONTACT_TYPES)) {
      throw new Error("Selecciona un tipo de contacto.");
    }
    if (!isAllowed(rating, RATINGS)) {
      throw new Error("Selecciona una calificacion.");
    }
    if (!nextSteps.length) {
      throw new Error("Selecciona al menos un siguiente paso.");
    }
    if (!nextSteps.every((step) => isAllowed(step, NEXT_STEPS))) {
      throw new Error("Hay un siguiente paso invalido.");
    }

    const media = validateContactMedia(input);

    const timestamp = nowIso();
    return {
      id: generateId("contact"),
      eventId,
      ownerProfileId: activeProfileId,
      createdByProfileId: activeProfileId,
      name,
      companyName,
      role: optionalText(input.role),
      email: optionalText(input.email),
      phone: optionalText(input.phone),
      linkedinUrl: optionalText(input.linkedinUrl),
      note,
      contactType,
      rating,
      nextSteps,
      otherNextStep: nextSteps.includes("other")
        ? optionalText(input.otherNextStep)
        : undefined,
      photos: media.photos,
      businessCardPhoto: media.businessCardPhoto,
      createdAt: timestamp,
      updatedAt: timestamp
    };
  }

  function updateContact(existingContact, input, activeProfileId, ownedEventIds) {
    const updated = createContact(
      {
        ...input,
        eventId: existingContact.eventId
      },
      activeProfileId,
      ownedEventIds
    );

    return {
      ...updated,
      id: existingContact.id,
      eventId: existingContact.eventId,
      ownerProfileId: existingContact.ownerProfileId,
      createdByProfileId: existingContact.createdByProfileId,
      createdAt: existingContact.createdAt
    };
  }

  function getActiveProfile(state) {
    return state.profiles.find((profile) => profile.id === state.activeProfileId) || null;
  }

  function normalizeEvent(event) {
    const legacyDate = optionalText(event && event.startsOn);
    const startDate = optionalText(event && event.startDate) || legacyDate;
    const endDate = optionalText(event && event.endDate) || legacyDate;

    return {
      ...event,
      startDate,
      endDate
    };
  }

  function ownedEvents(state) {
    return state.events
      .map(normalizeEvent)
      .filter((event) => event.ownerProfileId === state.activeProfileId);
  }

  function getActiveEventId(state) {
    const events = ownedEvents(state);
    if (state.activeEventId && events.some((event) => event.id === state.activeEventId)) {
      return state.activeEventId;
    }
    return events[0] ? events[0].id : "";
  }

  function getActiveEvent(state) {
    const eventId = getActiveEventId(state);
    return ownedEvents(state).find((event) => event.id === eventId) || null;
  }

  function ownedContacts(state) {
    return state.contacts.filter((contact) => contact.ownerProfileId === state.activeProfileId);
  }

  function filterContacts(state, filters) {
    return ownedContacts(state)
      .filter((contact) => !filters.eventId || contact.eventId === filters.eventId)
      .filter((contact) => !filters.contactType || contact.contactType === filters.contactType)
      .filter((contact) => !filters.rating || contact.rating === filters.rating)
      .filter((contact) => !filters.nextStep || contact.nextSteps.includes(filters.nextStep))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  function findOwnedContact(state, contactId) {
    return ownedContacts(state).find((contact) => contact.id === contactId) || null;
  }

  function labelFor(options, value) {
    const option = options.find((item) => item.value === value);
    return option ? option.label : value || "";
  }

  function loadState(storage) {
    if (!storage) {
      return emptyState();
    }

    try {
      const raw = storage.getItem(STORAGE_KEY);
      if (!raw) {
        return emptyState();
      }

      const parsed = JSON.parse(raw);
      if (!parsed || parsed.schemaVersion !== SCHEMA_VERSION) {
        return emptyState();
      }

      return {
        ...emptyState(),
        ...parsed,
        profiles: Array.isArray(parsed.profiles) ? parsed.profiles : [],
        events: Array.isArray(parsed.events) ? parsed.events.map(normalizeEvent) : [],
        contacts: Array.isArray(parsed.contacts)
          ? parsed.contacts.map((contact) => ({
              ...contact,
              photos: normalizePhotos(contact && contact.photos),
              businessCardPhoto: normalizeBusinessCardPhoto(contact && contact.businessCardPhoto)
            }))
          : []
      };
    } catch (_error) {
      return emptyState();
    }
  }

  function saveState(storage, state) {
    if (!storage) {
      return;
    }
    storage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...state,
        schemaVersion: SCHEMA_VERSION
      })
    );
  }

  const api = {
    STORAGE_KEY,
    SCHEMA_VERSION,
    CONTACT_TYPES,
    RATINGS,
    NEXT_STEPS,
    emptyState,
    createProfile,
    updateProfile,
    createEvent,
    createContact,
    updateContact,
    validateContactMedia,
    getActiveProfile,
    getActiveEventId,
    getActiveEvent,
    ownedEvents,
    ownedContacts,
    filterContacts,
    findOwnedContact,
    labelFor,
    loadState,
    saveState
  };

  globalScope.NetworKingDomain = api;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})(typeof window !== "undefined" ? window : globalThis);
