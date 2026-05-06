## Why

Los contactos capturados durante un evento hoy solo conservan texto, lo que deja afuera evidencia visual muy útil para recordar a la persona y recuperar datos de follow-up. Agregar fotos y una tarjeta de contacto separada mejora la calidad del registro y prepara el terreno para futuras funciones como OCR o enriquecimiento posterior.

## What Changes

- Permitir adjuntar hasta dos fotos generales por contacto durante la creacion y edicion.
- Permitir adjuntar una tarjeta de contacto separada de las fotos generales.
- Mostrar previews y adjuntos guardados en la vista detallada del contacto.
- Persistir los adjuntos localmente en el navegador junto con referencias desde cada contacto.
- Validar limites de cantidad y mantener la asociacion de adjuntos al actualizar un contacto.

## Capabilities

### New Capabilities
- `contact-media`: Adjuntos visuales asociados a un contacto, incluyendo fotos generales y una tarjeta de contacto separada.

### Modified Capabilities
- `contact-capture`: El formulario de contacto cambia para aceptar y conservar adjuntos visuales al crear y editar.
- `contact-detail`: La ficha detallada cambia para mostrar las fotos guardadas y la tarjeta de contacto.
- `local-persistence`: La persistencia local cambia para conservar binarios o referencias de adjuntos entre recargas.

## Impact

- Afecta `src/app.js` en los flujos de crear, editar y ver contacto.
- Afecta `src/domain.js` en el modelo y validaciones de contactos.
- Afecta la estrategia de persistencia local, probablemente incorporando `IndexedDB` para archivos y manteniendo `localStorage` para el estado estructurado.
- Requiere actualizar pruebas automatizadas y posiblemente agregar cobertura de persistencia y migracion de estado.
