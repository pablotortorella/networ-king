(function initMediaStore(globalScope) {
  "use strict";

  const DB_NAME = "networ-king-media";
  const DB_VERSION = 1;
  const STORE_NAME = "contact-media";

  function nowIso() {
    return new Date().toISOString();
  }

  function generateId(prefix) {
    const random =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2) + Date.now().toString(36);
    return prefix + "_" + random;
  }

  function ensureIndexedDb(indexedDb) {
    if (!indexedDb || typeof indexedDb.open !== "function") {
      throw new Error("Este navegador no soporta almacenamiento local de imagenes.");
    }
    return indexedDb;
  }

  function openDatabase(indexedDb) {
    return new Promise((resolve, reject) => {
      const databaseApi = ensureIndexedDb(indexedDb);
      const request = databaseApi.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(new Error("No fue posible abrir la base de imagenes."));
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
          store.createIndex("contactId", "contactId", { unique: false });
        }
      };
      request.onsuccess = () => resolve(request.result);
    });
  }

  function withStore(indexedDb, mode, callback) {
    return openDatabase(indexedDb).then(
      (db) =>
        new Promise((resolve, reject) => {
          const transaction = db.transaction(STORE_NAME, mode);
          const store = transaction.objectStore(STORE_NAME);
          let settled = false;

          transaction.oncomplete = () => {
            if (!settled) {
              settled = true;
              resolve();
            }
            db.close();
          };
          transaction.onerror = () => {
            if (!settled) {
              settled = true;
              reject(transaction.error || new Error("No fue posible usar el almacenamiento de imagenes."));
            }
            db.close();
          };
          transaction.onabort = transaction.onerror;

          callback(store, resolve, reject);
        })
    );
  }

  function saveFile(indexedDb, file, metadata) {
    const id = generateId("media");
    const record = {
      id,
      contactId: metadata.contactId,
      kind: metadata.kind,
      name: file && file.name ? file.name : "imagen",
      type: file && file.type ? file.type : "application/octet-stream",
      size: file && typeof file.size === "number" ? file.size : 0,
      blob: file,
      createdAt: nowIso(),
      updatedAt: nowIso()
    };

    return withStore(indexedDb, "readwrite", (store, resolve, reject) => {
      const request = store.put(record);
      request.onsuccess = () =>
        resolve({
          id: record.id,
          kind: record.kind,
          name: record.name
        });
      request.onerror = () => reject(request.error || new Error("No fue posible guardar la imagen."));
    });
  }

  function getMedia(indexedDb, id) {
    return withStore(indexedDb, "readonly", (store, resolve, reject) => {
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error || new Error("No fue posible leer la imagen."));
    });
  }

  function deleteMedia(indexedDb, id) {
    if (!id) {
      return Promise.resolve();
    }

    return withStore(indexedDb, "readwrite", (store, resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error || new Error("No fue posible eliminar la imagen."));
    });
  }

  const api = {
    saveFile,
    getMedia,
    deleteMedia
  };

  globalScope.NetworKingMediaStore = api;
})(typeof window !== "undefined" ? window : globalThis);
