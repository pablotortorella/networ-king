## Context

La aplicacion hoy persiste todo el estado en `localStorage` con entidades livianas de perfil, evento y contacto. Ese enfoque funciona bien para texto y listas cortas, pero no es adecuado para almacenar una a tres imagenes por contacto porque los limites de `localStorage` y el costo de serializar base64 degradarian rapido la experiencia, especialmente en dispositivos moviles.

La funcionalidad propuesta afecta el formulario de creacion y edicion de contactos, la ficha detallada, el modelo de dominio y la capa de persistencia. Tambien introduce una nueva distincion semantica: hasta dos fotos generales del contacto y una tarjeta de contacto separada.

## Goals / Non-Goals

**Goals:**
- Permitir adjuntar hasta dos fotos generales y una tarjeta de contacto por contacto.
- Hacer que los adjuntos funcionen tanto al crear como al editar un contacto.
- Persistir los adjuntos localmente entre recargas del navegador.
- Mantener el objeto `contact` pequeño y apto para seguir viviendo en `localStorage`.
- Preparar una base compatible con funciones futuras como OCR o exportacion enriquecida.

**Non-Goals:**
- Sincronizacion en nube o subida a un backend.
- OCR, extraccion automatica de datos o deduplicacion de imagenes.
- Edicion avanzada de imagenes, recorte o compresion sofisticada.
- Compartir adjuntos entre contactos o eventos.

## Decisions

### 1. Persistir binarios en `IndexedDB` y referencias en `localStorage`

Los adjuntos se guardaran como registros separados en `IndexedDB`, mientras que cada contacto conservara solo metadatos y referencias estables a esos adjuntos dentro del estado estructurado.

Rationale:
- Evita desbordar `localStorage` con base64.
- Permite conservar imagenes entre recargas sin backend.
- Mantiene el modelo actual de estado simple para perfiles, eventos y contactos.

Alternativas consideradas:
- Guardar base64 en `localStorage`: mas simple de codificar, pero con riesgo alto de limites de espacio y peor rendimiento.
- Reemplazar toda la persistencia por `IndexedDB`: mas uniforme a largo plazo, pero demasiado grande para este cambio.

### 2. Modelar los adjuntos en dos grupos semanticos

Cada contacto tendra dos colecciones diferenciadas:
- `photos`: hasta dos imagenes generales.
- `businessCardPhoto`: cero o una imagen de tarjeta de contacto.

Rationale:
- Refleja el lenguaje del producto propuesto.
- Facilita una UI mas clara en formulario y detalle.
- Deja preparada una extension futura para OCR solo sobre la tarjeta.

Alternativas consideradas:
- Un unico arreglo `attachments` con tipos mixtos: mas generico, pero menos claro para la experiencia actual.

### 3. Mantener validaciones de cantidad en dominio y UI

La UI guiara al usuario con limites visibles, pero el dominio seguira validando que no haya mas de dos fotos generales ni mas de una tarjeta.

Rationale:
- Evita estados invalidos aunque la UI falle.
- Mantiene reglas de negocio testeables fuera del DOM.

Alternativas consideradas:
- Validar solo en UI: mas simple, pero fragile.

### 4. Crear flujo de reemplazo y eliminacion por adjunto

En edicion, cada adjunto existente podra mantenerse, eliminarse o reemplazarse individualmente. Guardar cambios debera sincronizar las referencias del contacto y limpiar adjuntos huerfanos en `IndexedDB`.

Rationale:
- El usuario necesita corregir fotos malas sin rehacer todo el contacto.
- Evita acumulacion silenciosa de blobs no referenciados.

Alternativas consideradas:
- Reemplazo total del bloque de fotos en cada edicion: mas simple, pero peor experiencia y mayor riesgo de perdida accidental.

### 5. Mostrar previews locales inmediatas antes de guardar

La UI mostrara miniaturas de archivos seleccionados antes de persistirlos, y luego mostrara las versiones guardadas en la ficha del contacto.

Rationale:
- Reduce errores al cargar fotos.
- Hace visible la diferencia entre fotos generales y tarjeta de contacto.

Alternativas consideradas:
- Sin preview previa: menos trabajo, pero UX mas pobre y propensa a equivocaciones.

## Risks / Trade-offs

- [Mayor complejidad de persistencia] -> Encapsular `IndexedDB` en un modulo pequeño con operaciones claras de guardar, cargar y borrar adjuntos.
- [Migracion de contactos existentes sin adjuntos] -> Mantener el campo como opcional y soportar carga de contactos legacy sin cambios.
- [Acumulacion de blobs huerfanos] -> Borrar adjuntos removidos durante la edicion y considerar una limpieza defensiva al cargar.
- [Disponibilidad variable de APIs de archivos en moviles] -> Basarse en `input type="file"` con `accept="image/*"` y soporte opcional de `capture`, sin depender de APIs mas avanzadas.
- [Pruebas mas dificiles] -> Separar la logica de dominio de la persistencia binaria para poder cubrir cada capa por separado.

## Migration Plan

1. Extender el modelo de contacto para aceptar referencias opcionales a adjuntos, sin romper contactos ya guardados.
2. Introducir una capa de persistencia de medios en `IndexedDB`.
3. Actualizar formularios de contacto para seleccionar, previsualizar y editar adjuntos.
4. Actualizar la ficha de detalle para mostrar fotos y tarjeta guardadas.
5. Ejecutar una migracion blanda: los contactos existentes siguen funcionando con cero adjuntos.
6. Si hiciera falta rollback, ignorar las referencias nuevas en el estado y dejar los registros de `IndexedDB` sin uso hasta una limpieza manual o automatica posterior.

## Open Questions

- Si queremos imponer un limite de tamano por imagen en este MVP o dejarlo para una iteracion siguiente.
- Si la tarjeta de contacto deberia tener una presentacion visual destacada distinta a las fotos comunes en mobile.
- Si conviene agregar desde el inicio un indicador de origen, por ejemplo foto tomada vs foto subida, o si eso es sobre-ingenieria por ahora.
