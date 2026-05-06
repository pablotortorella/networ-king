(function initApp() {
  "use strict";

  const D = window.NetworKingDomain;
  const M = window.NetworKingMediaStore;
  const app = document.querySelector("#app");
  const BRAND_NAME = "Networ-King by Kleer";
  const BRAND_LOGO_SRC = "assets/kleer-black-logo.webp";

  let state = D.loadState(window.localStorage);
  let filters = {
    eventId: state.activeEventId || "",
    contactType: "",
    rating: "",
    nextStep: ""
  };
  let selectedContactId = null;
  let editingContactId = null;
  let editingProfile = false;
  let message = "";
  let eventActionsOpen = false;
  let pendingFocusSelector = "";
  let renderToken = 0;
  let objectUrls = [];

  const typeOptions = D.CONTACT_TYPES.map(optionHtml).join("");
  const ratingOptions = D.RATINGS.map(optionHtml).join("");
  const nextStepOptions = D.NEXT_STEPS.map(optionHtml).join("");

  function optionHtml(option) {
    return `<option value="${escapeHtml(option.value)}">${escapeHtml(option.label)}</option>`;
  }

  function emptyMediaBundle() {
    return {
      photos: [],
      businessCardPhoto: null
    };
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function persist(nextState) {
    state = nextState;
    D.saveState(window.localStorage, state);
  }

  function setMessage(nextMessage) {
    message = nextMessage;
  }

  function formData(form) {
    return Object.fromEntries(new FormData(form).entries());
  }

  function formValues(form, name) {
    return new FormData(form).getAll(name);
  }

  function fileList(form, name) {
    const field = form.elements[name];
    if (!field || !field.files) {
      return [];
    }
    return Array.from(field.files);
  }

  function focusContactCapture() {
    pendingFocusSelector = "#contact-form input[name=\"name\"]";
  }

  function focusContactEditForm() {
    pendingFocusSelector = "#contact-edit-title";
  }

  function focusContactDetail() {
    pendingFocusSelector = "#contact-detail-title";
  }

  function focusProfileEditForm() {
    pendingFocusSelector = "#profile-edit-title";
  }

  function focusTopContext() {
    pendingFocusSelector = "#page-title";
  }

  function applyPendingFocus() {
    if (!pendingFocusSelector) {
      return;
    }

    const target = document.querySelector(pendingFocusSelector);
    pendingFocusSelector = "";
    if (!target) {
      return;
    }

    target.focus();
    if (target.scrollIntoView) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  function cleanupObjectUrls() {
    objectUrls.forEach((url) => URL.revokeObjectURL(url));
    objectUrls = [];
  }

  function makeObjectUrl(blob) {
    const url = URL.createObjectURL(blob);
    objectUrls.push(url);
    return url;
  }

  function ensureActiveEvent(events) {
    const nextActiveEventId = D.getActiveEventId(state);
    const activeChanged = nextActiveEventId && nextActiveEventId !== state.activeEventId;
    if (nextActiveEventId && nextActiveEventId !== state.activeEventId) {
      persist({ ...state, activeEventId: nextActiveEventId });
    }
    if (
      nextActiveEventId &&
      (activeChanged || (filters.eventId && !events.some((event) => event.id === filters.eventId)))
    ) {
      filters.eventId = nextActiveEventId;
    }
    return nextActiveEventId;
  }

  async function resolveMediaRef(ref) {
    if (!ref) {
      return null;
    }

    const record = await M.getMedia(window.indexedDB, ref.id);
    if (!record || !record.blob) {
      return {
        id: ref.id,
        kind: ref.kind,
        name: ref.name,
        url: "",
        missing: true
      };
    }

    return {
      id: ref.id,
      kind: ref.kind,
      name: record.name || ref.name,
      url: makeObjectUrl(record.blob),
      missing: false
    };
  }

  async function loadContactMedia(contact) {
    if (!contact) {
      return emptyMediaBundle();
    }

    const photos = await Promise.all((contact.photos || []).map(resolveMediaRef));
    const businessCardPhoto = contact.businessCardPhoto
      ? await resolveMediaRef(contact.businessCardPhoto)
      : null;

    return {
      photos: photos.filter(Boolean),
      businessCardPhoto
    };
  }

  async function render() {
    const token = ++renderToken;
    cleanupObjectUrls();

    const profile = D.getActiveProfile(state);
    if (!profile) {
      if (token !== renderToken) {
        return;
      }
      app.innerHTML = `
        ${renderProfileSetup()}
        ${renderBrandFooter()}
      `;
      bindProfileSetup();
      return;
    }

    const events = D.ownedEvents(state);
    const activeEventId = ensureActiveEvent(events);
    const activeEvent = events.find((event) => event.id === activeEventId) || null;
    const editingContact = editingContactId ? D.findOwnedContact(state, editingContactId) : null;
    if (editingContactId && !editingContact) {
      editingContactId = null;
    }

    const detailContact =
      !editingProfile && !editingContact && selectedContactId
        ? D.findOwnedContact(state, selectedContactId)
        : null;
    const formMedia = editingContact ? await loadContactMedia(editingContact) : emptyMediaBundle();
    const detailMedia = detailContact ? await loadContactMedia(detailContact) : emptyMediaBundle();

    if (token !== renderToken) {
      return;
    }

    app.innerHTML = `
      <header class="topbar">
        <div>
          <p class="eyebrow">${escapeHtml(BRAND_NAME)}</p>
          <h1 id="page-title" tabindex="-1">Contactos de evento</h1>
        </div>
        <div class="profile-pill">
          <span>${escapeHtml(profile.displayName)}</span>
          ${profile.companyName ? `<small>${escapeHtml(profile.companyName)}</small>` : ""}
        </div>
      </header>

      ${message ? `<div class="notice" role="status">${escapeHtml(message)}</div>` : ""}

      <section class="workspace">
        ${
          events.length
            ? renderActiveEventContext(activeEvent, events, profile)
            : renderFirstEventSetup()
        }
        ${
          editingContact
            ? renderContactForm(activeEventId, editingContact, formMedia)
            : events.length
              ? renderContactForm(activeEventId, null, emptyMediaBundle())
              : renderNoEventHint()
        }
        ${
          editingProfile
            ? renderProfileEditForm(profile)
            : detailContact
              ? renderDetail(detailContact, detailMedia)
              : renderList(events)
        }
      </section>

      ${renderBrandFooter()}
    `;

    bindApp(events, activeEventId, profile, editingContact);
    applyPendingFocus();
  }

  function renderProfileSetup() {
    return `
      <section class="setup-view">
        <div class="brand-block">
          <p class="eyebrow">Bienvenido</p>
          <h1>${escapeHtml(BRAND_NAME)}</h1>
          <p>Captura conversaciones, clasifica oportunidades y deja el follow-up listo desde el celular.</p>
        </div>
        <form id="profile-form" class="panel form-stack">
          <label>
            <span>Nombre *</span>
            <input name="displayName" autocomplete="name" required placeholder="Ej: Pablo">
          </label>
          <label>
            <span>Empresa</span>
            <input name="companyName" autocomplete="organization" placeholder="Ej: Kleer">
          </label>
          <label>
            <span>Rol</span>
            <input name="role" autocomplete="organization-title" placeholder="Ej: Socio">
          </label>
          <button class="primary-button" type="submit">Crear perfil</button>
        </form>
      </section>
    `;
  }

  function renderBrandFooter() {
    return `
      <footer class="app-footer">
        <p>&copy; 2026 ${escapeHtml(BRAND_NAME)}</p>
        <div class="app-footer-logo-wrap">
          <img class="app-footer-logo" src="${escapeHtml(BRAND_LOGO_SRC)}" alt="Kleer">
        </div>
      </footer>
    `;
  }

  function renderFirstEventSetup() {
    return `
      <section class="panel event-panel first-event-panel">
        <div class="section-heading">
          <div>
            <p class="eyebrow">Primer evento</p>
            <h2>Crea el contexto antes de capturar contactos</h2>
          </div>
        </div>
        ${renderEventForm("first-event-form", "primary-button")}
      </section>
    `;
  }

  function renderActiveEventContext(activeEvent, events, profile) {
    return `
      <section class="panel event-context-panel">
        <div class="event-context-header">
          <div class="event-context-copy">
            <p class="eyebrow">Evento activo</p>
            <h2>${escapeHtml(activeEvent ? activeEvent.name : "Sin evento")}</h2>
            ${renderEventMeta(activeEvent)}
          </div>
          <button
            class="ghost-icon-button"
            id="toggle-event-actions"
            type="button"
            aria-expanded="${eventActionsOpen ? "true" : "false"}"
            aria-controls="event-actions-panel"
            aria-label="Acciones de evento"
            title="Acciones de evento"
          >
            <span aria-hidden="true">&#9776;</span>
          </button>
        </div>
        ${eventActionsOpen ? renderEventActionsPanel(events, activeEvent, profile) : ""}
      </section>
    `;
  }

  function renderEventMeta(event) {
    if (!event) {
      return "";
    }

    const segments = [formatEventRange(event), event.location].filter(Boolean);
    if (!segments.length) {
      return `<p class="event-context-meta">Listo para capturar contactos.</p>`;
    }

    return `<p class="event-context-meta">${escapeHtml(segments.join(" - "))}</p>`;
  }

  function renderEventActionsPanel(events, activeEvent, profile) {
    return `
      <div class="event-actions-panel" id="event-actions-panel">
        <div class="event-actions-section">
          <p class="eyebrow">Cambiar evento</p>
          <div class="event-switch-list">
            ${events
              .map(
                (event) => `
                  <button
                    class="event-switch-button ${activeEvent && activeEvent.id === event.id ? "active" : ""}"
                    type="button"
                    data-select-event="${escapeHtml(event.id)}"
                  >
                    <span>${escapeHtml(event.name)}</span>
                    ${renderEventSwitchMeta(event)}
                  </button>
                `
              )
              .join("")}
          </div>
        </div>
        <div class="event-actions-section">
          <p class="eyebrow">Mis datos</p>
          <div class="profile-summary-card">
            <strong>${escapeHtml(profile.displayName)}</strong>
            ${profile.companyName ? `<small>${escapeHtml(profile.companyName)}</small>` : ""}
            ${profile.role ? `<small>${escapeHtml(profile.role)}</small>` : ""}
            <button class="ghost-button inline-button" id="edit-profile-button" type="button">Editar mis datos</button>
          </div>
        </div>
        <div class="event-actions-section">
          <p class="eyebrow">Nuevo evento</p>
          ${renderEventForm("event-actions-form", "secondary-button")}
        </div>
      </div>
    `;
  }

  function renderEventSwitchMeta(event) {
    const meta = [formatEventRange(event), event.location].filter(Boolean).join(" - ");
    return meta ? `<small>${escapeHtml(meta)}</small>` : "";
  }

  function renderEventForm(formId, buttonClass) {
    return `
      <form id="${formId}" class="compact-form event-form" data-event-form="true">
        <label>
          <span>Nombre *</span>
          <input name="name" required placeholder="Ej: Expo B2B">
        </label>
        <label>
          <span>Fecha inicio</span>
          <input name="startDate" type="date">
        </label>
        <label>
          <span>Fecha fin</span>
          <input name="endDate" type="date">
        </label>
        <label>
          <span>Lugar</span>
          <input name="location" placeholder="Ej: La Rural">
        </label>
        <button class="${buttonClass}" type="submit">Crear evento</button>
      </form>
    `;
  }

  function renderNoEventHint() {
    return `
      <section class="empty-state">
        <h2>Primero crea un evento</h2>
        <p>Los contactos se guardan dentro de un evento propio para que despues puedas filtrarlos.</p>
      </section>
    `;
  }

  function renderContactForm(activeEventId, contact, media) {
    const isEdit = Boolean(contact);
    const nextSteps = contact ? contact.nextSteps : [];

    return `
      <section class="panel contact-panel">
        <div class="section-heading">
          <div>
            <p class="eyebrow">${isEdit ? "Edicion" : "Captura rapida"}</p>
            <h2 id="${isEdit ? "contact-edit-title" : "contact-create-title"}" tabindex="-1">${isEdit ? "Editar contacto" : "Nuevo contacto"}</h2>
          </div>
          ${isEdit ? `<button class="ghost-button" id="cancel-contact-edit" type="button">Cancelar</button>` : ""}
        </div>
        <form id="contact-form" class="form-stack" data-mode="${isEdit ? "edit" : "create"}">
          <input type="hidden" name="eventId" value="${escapeHtml(activeEventId)}">
          <div class="two-column">
            <label>
              <span>Nombre</span>
              <input name="name" autocomplete="name" placeholder="Ej: Laura" value="${escapeHtml(contact ? contact.name : "")}">
            </label>
            <label>
              <span>Empresa</span>
              <input name="companyName" autocomplete="organization" placeholder="Ej: Acme" value="${escapeHtml(contact ? contact.companyName : "")}">
            </label>
          </div>
          <label>
            <span>Rol</span>
            <input name="role" autocomplete="organization-title" placeholder="Ej: Directora comercial" value="${escapeHtml(contact ? contact.role : "")}">
          </label>
          <div class="two-column">
            <label>
              <span>Email</span>
              <input name="email" type="email" autocomplete="email" placeholder="laura@acme.com" value="${escapeHtml(contact ? contact.email : "")}">
            </label>
            <label>
              <span>Telefono</span>
              <input name="phone" type="tel" autocomplete="tel" placeholder="+54 11..." value="${escapeHtml(contact ? contact.phone : "")}">
            </label>
          </div>
          <label>
            <span>LinkedIn</span>
            <input name="linkedinUrl" inputmode="url" placeholder="linkedin.com/in/..." value="${escapeHtml(contact ? contact.linkedinUrl : "")}">
          </label>
          <label>
            <span>Nota breve *</span>
            <textarea name="note" required rows="3" placeholder="Que hablamos, dolor, contexto, promesa de follow-up">${escapeHtml(contact ? contact.note : "")}</textarea>
          </label>
          <div class="two-column">
            <label>
              <span>Tipo *</span>
              <select name="contactType" required>${selectOptions(D.CONTACT_TYPES, contact ? contact.contactType : "")}</select>
            </label>
            <label>
              <span>Calificacion *</span>
              <select name="rating" required>${selectOptions(D.RATINGS, contact ? contact.rating : "")}</select>
            </label>
          </div>
          <fieldset class="choice-grid">
            <legend>Siguientes pasos *</legend>
            ${D.NEXT_STEPS.map(
              (step) => `
                <label class="check-option">
                  <input type="checkbox" name="nextSteps" value="${escapeHtml(step.value)}" ${nextSteps.includes(step.value) ? "checked" : ""}>
                  <span>${escapeHtml(step.label)}</span>
                </label>
              `
            ).join("")}
          </fieldset>
          <label>
            <span>Otro siguiente paso</span>
            <input name="otherNextStep" placeholder="Detalle si elegiste Otro" value="${escapeHtml(contact ? contact.otherNextStep : "")}">
          </label>
          <section class="media-section">
            <div class="media-section-copy">
              <h3>Fotos</h3>
              <p>Adjunta hasta dos fotos generales del contacto.</p>
            </div>
            ${renderExistingMediaGroup(media.photos, "photo")}
            <label class="file-field">
              <span>Agregar fotos</span>
              <input name="photos" type="file" accept="image/*" multiple>
            </label>
            <p class="helper-text" id="photos-limit-message">Puedes guardar hasta dos imagenes en Fotos.</p>
            <div class="media-grid pending-media-grid" id="pending-photos-preview"></div>
          </section>
          <section class="media-section">
            <div class="media-section-copy">
              <h3>Tarjeta de contacto</h3>
              <p>Guarda una foto de la tarjeta separada de las fotos generales.</p>
            </div>
            ${renderExistingMediaGroup(media.businessCardPhoto ? [media.businessCardPhoto] : [], "business-card")}
            <label class="file-field">
              <span>Agregar tarjeta</span>
              <input name="businessCardPhoto" type="file" accept="image/*">
            </label>
            <p class="helper-text" id="business-card-limit-message">Solo se permite una imagen de tarjeta.</p>
            <div class="media-grid pending-media-grid" id="pending-business-card-preview"></div>
          </section>
          <button class="primary-button" type="submit">${isEdit ? "Guardar cambios" : "Guardar contacto"}</button>
        </form>
      </section>
    `;
  }

  function renderExistingMediaGroup(items, kind) {
    if (!items || !items.length) {
      return "";
    }

    return `
      <div class="media-grid existing-media-grid">
        ${items.map((item) => renderSavedMediaCard(item, kind, true)).join("")}
      </div>
    `;
  }

  function renderSavedMediaCard(item, kind, removable) {
    return `
      <article class="media-card existing-media-card" data-kind="${escapeHtml(kind)}" data-media-id="${escapeHtml(item.id)}">
        ${
          item.url
            ? `<img class="media-thumb" src="${escapeHtml(item.url)}" alt="${escapeHtml(item.name)}">`
            : `<div class="media-thumb media-thumb-fallback">Imagen no disponible</div>`
        }
        <div class="media-card-copy">
          <strong>${escapeHtml(item.name)}</strong>
          ${item.missing ? `<small>No se pudo recuperar esta imagen.</small>` : ""}
        </div>
        ${removable ? `<button class="ghost-button media-remove-button" type="button" data-remove-media="true">Quitar</button>` : ""}
      </article>
    `;
  }

  function renderProfileEditForm(profile) {
    return `
      <section class="panel detail-panel">
        <div class="section-heading">
          <div>
            <p class="eyebrow">Perfil</p>
            <h2 id="profile-edit-title" tabindex="-1">Editar mis datos</h2>
          </div>
          <button class="ghost-button" id="cancel-profile-edit" type="button">Cancelar</button>
        </div>
        <form id="profile-edit-form" class="form-stack">
          <label>
            <span>Nombre *</span>
            <input name="displayName" autocomplete="name" required value="${escapeHtml(profile.displayName)}">
          </label>
          <label>
            <span>Empresa</span>
            <input name="companyName" autocomplete="organization" value="${escapeHtml(profile.companyName)}">
          </label>
          <label>
            <span>Rol</span>
            <input name="role" autocomplete="organization-title" value="${escapeHtml(profile.role)}">
          </label>
          <button class="primary-button" type="submit">Guardar mis datos</button>
        </form>
      </section>
    `;
  }

  function renderList(events) {
    const contacts = D.filterContacts(state, filters);
    const eventOptions = events.map(optionFromEvent).join("");
    const cards = contacts.map(renderContactCard).join("");

    return `
      <section class="panel list-panel">
        <div class="section-heading">
          <div>
            <p class="eyebrow">Listado</p>
            <h2>${contacts.length} contacto${contacts.length === 1 ? "" : "s"}</h2>
          </div>
          <button class="ghost-button" id="clear-filters" type="button">Limpiar</button>
        </div>
        <form id="filters-form" class="filters">
          <label>
            <span>Evento</span>
            <select name="eventId">
              <option value="">Todos</option>
              ${eventOptions}
            </select>
          </label>
          <label>
            <span>Tipo</span>
            <select name="contactType">
              <option value="">Todos</option>
              ${typeOptions}
            </select>
          </label>
          <label>
            <span>Calificacion</span>
            <select name="rating">
              <option value="">Todas</option>
              ${ratingOptions}
            </select>
          </label>
          <label>
            <span>Siguiente paso</span>
            <select name="nextStep">
              <option value="">Todos</option>
              ${nextStepOptions}
            </select>
          </label>
        </form>
        <div class="contact-list">
          ${cards || `<div class="empty-state compact"><h2>No hay contactos para estos filtros</h2><p>Guarda uno nuevo o cambia los filtros activos.</p></div>`}
        </div>
      </section>
    `;
  }

  function optionFromEvent(event) {
    return `<option value="${escapeHtml(event.id)}" ${filters.eventId === event.id ? "selected" : ""}>${escapeHtml(event.name)}</option>`;
  }

  function selectOptions(options, selectedValue) {
    return options
      .map(
        (option) =>
          `<option value="${escapeHtml(option.value)}" ${option.value === selectedValue ? "selected" : ""}>${escapeHtml(option.label)}</option>`
      )
      .join("");
  }

  function renderContactCard(contact) {
    const event = state.events.find((item) => item.id === contact.eventId);
    const title = contact.name || contact.companyName;
    const subtitle = [contact.companyName && contact.name ? contact.companyName : "", contact.role]
      .filter(Boolean)
      .join(" - ");

    return `
      <article class="contact-card">
        <button class="card-button" type="button" data-open-contact="${escapeHtml(contact.id)}">
          <span class="card-title">${escapeHtml(title)}</span>
          ${subtitle ? `<span class="card-subtitle">${escapeHtml(subtitle)}</span>` : ""}
          <span class="card-meta">${escapeHtml(event ? event.name : "Evento")} - ${escapeHtml(D.labelFor(D.CONTACT_TYPES, contact.contactType))}</span>
          <span class="card-note">${escapeHtml(contact.note)}</span>
          <span class="chip-row">
            <span class="chip ${contact.rating}">${escapeHtml(D.labelFor(D.RATINGS, contact.rating))}</span>
            ${contact.nextSteps.map((step) => `<span class="chip">${escapeHtml(D.labelFor(D.NEXT_STEPS, step))}</span>`).join("")}
          </span>
        </button>
      </article>
    `;
  }

  function renderDetail(contact, media) {
    const event = state.events.find((item) => item.id === contact.eventId);
    const channelRows = [
      ["Email", contact.email],
      ["Telefono", contact.phone],
      ["LinkedIn", contact.linkedinUrl]
    ].filter((row) => row[1]);

    return `
      <section class="panel detail-panel">
        <div class="section-heading">
          <button class="ghost-button back-button" id="back-to-list" type="button">Volver al listado</button>
          <button class="ghost-button" id="edit-contact-button" type="button">Editar</button>
        </div>
        <div class="detail-header">
          <p class="eyebrow">${escapeHtml(event ? event.name : "Evento")}</p>
          <h2 id="contact-detail-title" tabindex="-1">${escapeHtml(contact.name || contact.companyName)}</h2>
          ${contact.companyName && contact.name ? `<p>${escapeHtml(contact.companyName)}</p>` : ""}
          ${contact.role ? `<p>${escapeHtml(contact.role)}</p>` : ""}
          ${event ? `<p>${escapeHtml(formatEventRange(event))}</p>` : ""}
        </div>
        <dl class="detail-grid">
          <div>
            <dt>Tipo</dt>
            <dd>${escapeHtml(D.labelFor(D.CONTACT_TYPES, contact.contactType))}</dd>
          </div>
          <div>
            <dt>Calificacion</dt>
            <dd>${escapeHtml(D.labelFor(D.RATINGS, contact.rating))}</dd>
          </div>
          <div>
            <dt>Creado</dt>
            <dd>${escapeHtml(formatDate(contact.createdAt))}</dd>
          </div>
          <div>
            <dt>Actualizado</dt>
            <dd>${escapeHtml(formatDate(contact.updatedAt))}</dd>
          </div>
        </dl>
        ${
          channelRows.length
            ? `<div class="detail-section"><h3>Canales</h3>${channelRows
                .map((row) => `<p><strong>${escapeHtml(row[0])}:</strong> ${escapeHtml(row[1])}</p>`)
                .join("")}</div>`
            : ""
        }
        <div class="detail-section">
          <h3>Nota</h3>
          <p>${escapeHtml(contact.note)}</p>
        </div>
        <div class="detail-section">
          <h3>Siguientes pasos</h3>
          <div class="chip-row">
            ${contact.nextSteps.map((step) => `<span class="chip">${escapeHtml(D.labelFor(D.NEXT_STEPS, step))}</span>`).join("")}
          </div>
          ${contact.otherNextStep ? `<p>${escapeHtml(contact.otherNextStep)}</p>` : ""}
        </div>
        ${
          media.photos.length
            ? `<div class="detail-section"><h3>Fotos</h3><div class="media-grid">${media.photos
                .map((item) => renderSavedMediaCard(item, "photo", false))
                .join("")}</div></div>`
            : ""
        }
        ${
          media.businessCardPhoto
            ? `<div class="detail-section"><h3>Tarjeta de contacto</h3><div class="media-grid">${renderSavedMediaCard(
                media.businessCardPhoto,
                "business-card",
                false
              )}</div></div>`
            : ""
        }
      </section>
    `;
  }

  function formatDate(value) {
    return new Intl.DateTimeFormat("es", {
      dateStyle: "short",
      timeStyle: "short"
    }).format(new Date(value));
  }

  function formatDateValue(value) {
    if (!value) {
      return "";
    }

    return new Intl.DateTimeFormat("es", { dateStyle: "medium" }).format(new Date(value));
  }

  function formatEventRange(event) {
    if (!event) {
      return "";
    }

    if (event.startDate && event.endDate) {
      if (event.startDate === event.endDate) {
        return formatDateValue(event.startDate);
      }
      return `${formatDateValue(event.startDate)} al ${formatDateValue(event.endDate)}`;
    }
    if (event.startDate) {
      return `Desde ${formatDateValue(event.startDate)}`;
    }
    if (event.endDate) {
      return `Hasta ${formatDateValue(event.endDate)}`;
    }
    return "";
  }

  function bindProfileSetup() {
    document.querySelector("#profile-form").addEventListener("submit", (event) => {
      event.preventDefault();
      try {
        const profile = D.createProfile(formData(event.currentTarget));
        persist({
          ...state,
          activeProfileId: profile.id,
          profiles: [...state.profiles, profile]
        });
        setMessage("Perfil creado. Ahora crea tu primer evento.");
        render();
      } catch (error) {
        setMessage(error.message);
        render();
      }
    });
  }

  function buildPlaceholderRefs(files, kind) {
    return files.map((file, index) => ({
      id: "pending_" + kind + "_" + index,
      name: file.name || "Imagen",
      kind
    }));
  }

  function collectRetainedMediaRefs(form, contact) {
    if (!contact) {
      return emptyMediaBundle();
    }

    const retainedPhotoIds = new Set(
      Array.from(form.querySelectorAll('.existing-media-card[data-kind="photo"]')).map(
        (item) => item.dataset.mediaId
      )
    );
    const retainedBusinessCardIds = new Set(
      Array.from(form.querySelectorAll('.existing-media-card[data-kind="business-card"]')).map(
        (item) => item.dataset.mediaId
      )
    );

    return {
      photos: (contact.photos || []).filter((ref) => retainedPhotoIds.has(ref.id)),
      businessCardPhoto:
        contact.businessCardPhoto && retainedBusinessCardIds.has(contact.businessCardPhoto.id)
          ? contact.businessCardPhoto
          : undefined
    };
  }

  function renderPendingFiles(target, files) {
    target.innerHTML = files
      .map(
        (file) => `
          <article class="media-card pending-media-card">
            <div class="media-thumb media-thumb-fallback">Vista previa local</div>
            <div class="media-card-copy">
              <strong>${escapeHtml(file.name || "Imagen")}</strong>
              <small>${escapeHtml(file.type || "image/*")}</small>
            </div>
          </article>
        `
      )
      .join("");

    files.forEach((file, index) => {
      if (!file.type || !file.type.startsWith("image/")) {
        return;
      }

      const card = target.children[index];
      const placeholder = card ? card.querySelector(".media-thumb-fallback") : null;
      if (!placeholder) {
        return;
      }

      const url = makeObjectUrl(file);
      placeholder.outerHTML = `<img class="media-thumb" src="${escapeHtml(url)}" alt="${escapeHtml(file.name || "Imagen")}">`;
    });
  }

  function updateMediaLimits(form) {
    const retained = {
      photos: form.querySelectorAll('.existing-media-card[data-kind="photo"]').length,
      businessCardPhoto: form.querySelectorAll('.existing-media-card[data-kind="business-card"]').length
    };
    const photoFiles = fileList(form, "photos");
    const businessCardFiles = fileList(form, "businessCardPhoto");
    const photosMessage = form.querySelector("#photos-limit-message");
    const businessCardMessage = form.querySelector("#business-card-limit-message");

    if (photosMessage) {
      const totalPhotos = retained.photos + photoFiles.length;
      photosMessage.textContent =
        totalPhotos > 2
          ? "Fotos admite hasta dos imagenes. Reduce la seleccion antes de guardar."
          : `Guardadas o seleccionadas: ${totalPhotos}/2.`;
      photosMessage.classList.toggle("helper-text-error", totalPhotos > 2);
    }

    if (businessCardMessage) {
      const totalCards = retained.businessCardPhoto + businessCardFiles.length;
      businessCardMessage.textContent =
        totalCards > 1
          ? "Tarjeta de contacto admite solo una imagen."
          : `Guardadas o seleccionadas: ${totalCards}/1.`;
      businessCardMessage.classList.toggle("helper-text-error", totalCards > 1);
    }
  }

  function bindContactMediaForm(form) {
    const photoInput = form.elements.photos;
    const businessCardInput = form.elements.businessCardPhoto;
    const photoPreview = form.querySelector("#pending-photos-preview");
    const businessCardPreview = form.querySelector("#pending-business-card-preview");

    form.querySelectorAll("[data-remove-media]").forEach((button) => {
      button.addEventListener("click", () => {
        const card = button.closest(".existing-media-card");
        if (card) {
          card.remove();
        }
        updateMediaLimits(form);
      });
    });

    if (photoInput && photoPreview) {
      photoInput.addEventListener("change", () => {
        renderPendingFiles(photoPreview, fileList(form, "photos"));
        updateMediaLimits(form);
      });
    }

    if (businessCardInput && businessCardPreview) {
      businessCardInput.addEventListener("change", () => {
        renderPendingFiles(businessCardPreview, fileList(form, "businessCardPhoto"));
        updateMediaLimits(form);
      });
    }

    updateMediaLimits(form);
  }

  async function saveSubmittedMedia(contactId, photoFiles, businessCardFile) {
    const saved = {
      photos: [],
      businessCardPhoto: undefined
    };

    try {
      for (const file of photoFiles) {
        saved.photos.push(await M.saveFile(window.indexedDB, file, { contactId, kind: "photo" }));
      }
      if (businessCardFile) {
        saved.businessCardPhoto = await M.saveFile(window.indexedDB, businessCardFile, {
          contactId,
          kind: "business-card"
        });
      }
      return saved;
    } catch (error) {
      await Promise.all(
        saved.photos.map((ref) => M.deleteMedia(window.indexedDB, ref.id)).concat(
          saved.businessCardPhoto ? [M.deleteMedia(window.indexedDB, saved.businessCardPhoto.id)] : []
        )
      );
      throw error;
    }
  }

  async function removeMediaRefs(refs) {
    await Promise.all(refs.filter(Boolean).map((id) => M.deleteMedia(window.indexedDB, id)));
  }

  function bindApp(events, activeEventId, profile, editingContact) {
    const toggleEventActions = document.querySelector("#toggle-event-actions");
    if (toggleEventActions) {
      toggleEventActions.addEventListener("click", () => {
        eventActionsOpen = !eventActionsOpen;
        setMessage("");
        render();
      });
    }

    const editProfileButton = document.querySelector("#edit-profile-button");
    if (editProfileButton) {
      editProfileButton.addEventListener("click", () => {
        editingProfile = true;
        eventActionsOpen = false;
        selectedContactId = null;
        editingContactId = null;
        focusProfileEditForm();
        setMessage("");
        render();
      });
    }

    document.querySelectorAll("[data-select-event]").forEach((button) => {
      button.addEventListener("click", () => {
        const nextEventId = button.dataset.selectEvent;
        persist({ ...state, activeEventId: nextEventId });
        filters.eventId = nextEventId;
        selectedContactId = null;
        editingContactId = null;
        editingProfile = false;
        eventActionsOpen = false;
        focusContactCapture();
        setMessage("Evento activo actualizado.");
        render();
      });
    });

    document.querySelectorAll("form[data-event-form]").forEach((form) => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        try {
          const nextEvent = D.createEvent(formData(event.currentTarget), state.activeProfileId);
          persist({
            ...state,
            activeEventId: nextEvent.id,
            events: [...state.events, nextEvent]
          });
          filters.eventId = nextEvent.id;
          selectedContactId = null;
          editingContactId = null;
          editingProfile = false;
          eventActionsOpen = false;
          focusContactCapture();
          setMessage("Evento creado. Ya puedes cargar contactos.");
          render();
        } catch (error) {
          setMessage(error.message);
          render();
        }
      });
    });

    const contactForm = document.querySelector("#contact-form");
    if (contactForm) {
      bindContactMediaForm(contactForm);

      contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        try {
          const baseValues = {
            ...formData(event.currentTarget),
            eventId: activeEventId,
            nextSteps: formValues(event.currentTarget, "nextSteps")
          };
          const retainedMedia = collectRetainedMediaRefs(event.currentTarget, editingContact);
          const photoFiles = fileList(event.currentTarget, "photos");
          const businessCardFiles = fileList(event.currentTarget, "businessCardPhoto");
          const businessCardFile = businessCardFiles[0];

          if (editingContactId) {
            const existingContact = D.findOwnedContact(state, editingContactId);
            const nextDraftPhotos = retainedMedia.photos.concat(buildPlaceholderRefs(photoFiles, "photo"));
            const nextDraftBusinessCard = businessCardFile
              ? buildPlaceholderRefs([businessCardFile], "business-card")[0]
              : retainedMedia.businessCardPhoto;
            const validated = D.updateContact(
              existingContact,
              {
                ...baseValues,
                photos: nextDraftPhotos,
                businessCardPhoto: nextDraftBusinessCard
              },
              state.activeProfileId,
              events.map((item) => item.id)
            );

            const removedPhotoIds = (existingContact.photos || [])
              .filter((ref) => !retainedMedia.photos.some((item) => item.id === ref.id))
              .map((ref) => ref.id);
            const replacedBusinessCardId =
              existingContact.businessCardPhoto &&
              (!retainedMedia.businessCardPhoto || businessCardFile)
                ? existingContact.businessCardPhoto.id
                : "";

            const savedMedia = await saveSubmittedMedia(validated.id, photoFiles, businessCardFile);
            const finalContact = {
              ...validated,
              photos: retainedMedia.photos.concat(savedMedia.photos),
              businessCardPhoto: businessCardFile
                ? savedMedia.businessCardPhoto
                : retainedMedia.businessCardPhoto
            };

            persist({
              ...state,
              contacts: state.contacts.map((contact) =>
                contact.id === finalContact.id ? finalContact : contact
              )
            });
            selectedContactId = finalContact.id;
            editingContactId = null;
            focusContactDetail();

            try {
              await removeMediaRefs(
                removedPhotoIds.concat(replacedBusinessCardId ? [replacedBusinessCardId] : [])
              );
              setMessage("Contacto actualizado.");
            } catch (_error) {
              setMessage("Contacto actualizado. Algunas imagenes viejas no se pudieron limpiar.");
            }

            render();
            return;
          }

          const draftContact = D.createContact(
            {
              ...baseValues,
              photos: buildPlaceholderRefs(photoFiles, "photo"),
              businessCardPhoto: businessCardFile
                ? buildPlaceholderRefs([businessCardFile], "business-card")[0]
                : undefined
            },
            state.activeProfileId,
            events.map((item) => item.id)
          );
          const savedMedia = await saveSubmittedMedia(draftContact.id, photoFiles, businessCardFile);
          const finalContact = {
            ...draftContact,
            photos: savedMedia.photos,
            businessCardPhoto: savedMedia.businessCardPhoto
          };

          persist({
            ...state,
            activeEventId: finalContact.eventId,
            contacts: [...state.contacts, finalContact]
          });
          filters.eventId = finalContact.eventId;
          selectedContactId = null;
          editingContactId = null;
          editingProfile = false;
          event.currentTarget.reset();
          focusContactCapture();
          setMessage("Contacto guardado.");
          render();
        } catch (error) {
          setMessage(error.message);
          render();
        }
      });
    }

    const cancelContactEdit = document.querySelector("#cancel-contact-edit");
    if (cancelContactEdit) {
      cancelContactEdit.addEventListener("click", () => {
        editingContactId = null;
        setMessage("");
        render();
      });
    }

    const profileEditForm = document.querySelector("#profile-edit-form");
    if (profileEditForm) {
      profileEditForm.addEventListener("submit", (event) => {
        event.preventDefault();
        try {
          const updatedProfile = D.updateProfile(profile, formData(event.currentTarget));
          persist({
            ...state,
            profiles: state.profiles.map((item) =>
              item.id === updatedProfile.id ? updatedProfile : item
            )
          });
          editingProfile = false;
          focusTopContext();
          setMessage("Tus datos fueron actualizados.");
          render();
        } catch (error) {
          setMessage(error.message);
          render();
        }
      });
    }

    const cancelProfileEdit = document.querySelector("#cancel-profile-edit");
    if (cancelProfileEdit) {
      cancelProfileEdit.addEventListener("click", () => {
        editingProfile = false;
        setMessage("");
        render();
      });
    }

    const filtersForm = document.querySelector("#filters-form");
    if (filtersForm) {
      Object.entries(filters).forEach(([key, value]) => {
        const field = filtersForm.elements[key];
        if (field) {
          field.value = value;
        }
      });

      filtersForm.addEventListener("change", (event) => {
        const values = formData(event.currentTarget);
        filters = {
          eventId: values.eventId || "",
          contactType: values.contactType || "",
          rating: values.rating || "",
          nextStep: values.nextStep || ""
        };
        selectedContactId = null;
        editingContactId = null;
        editingProfile = false;
        setMessage("");
        render();
      });
    }

    const clearFilters = document.querySelector("#clear-filters");
    if (clearFilters) {
      clearFilters.addEventListener("click", () => {
        filters = {
          eventId: "",
          contactType: "",
          rating: "",
          nextStep: ""
        };
        selectedContactId = null;
        editingContactId = null;
        editingProfile = false;
        setMessage("");
        render();
      });
    }

    document.querySelectorAll("[data-open-contact]").forEach((button) => {
      button.addEventListener("click", () => {
        selectedContactId = button.dataset.openContact;
        editingContactId = null;
        editingProfile = false;
        setMessage("");
        render();
      });
    });

    const editContactButton = document.querySelector("#edit-contact-button");
    if (editContactButton) {
      editContactButton.addEventListener("click", () => {
        editingContactId = selectedContactId;
        editingProfile = false;
        focusContactEditForm();
        setMessage("");
        render();
      });
    }

    const backToList = document.querySelector("#back-to-list");
    if (backToList) {
      backToList.addEventListener("click", () => {
        selectedContactId = null;
        editingContactId = null;
        setMessage("");
        render();
      });
    }
  }

  render();
})();
