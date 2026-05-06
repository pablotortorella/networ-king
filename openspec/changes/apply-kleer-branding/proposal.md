## Why

La app ya es usable como herramienta interna, pero todavia no refleja de forma consistente la marca con la que se quiere presentar y compartir. Alinear nombre visible, color base, favicon y presencia de Kleer mejora la coherencia visual y deja la experiencia lista para ser publicada y usada por otras personas desde una URL compartida.

## What Changes

- Cambiar el branding visible de la app para mostrar `Networ-King by Kleer`.
- Reemplazar el fondo principal actual por la base `#204864`.
- Agregar presencia persistente de marca en la bienvenida y en el cierre de toda la experiencia mediante copyright y logo de Kleer.
- Incorporar el favicon de Kleer como asset local del proyecto.
- Ajustar el layout para que el footer de marca aparezca al final tanto en onboarding como en la experiencia principal.

## Capabilities

### New Capabilities
- `app-branding`: Presentacion visual global de la aplicacion, incluyendo identidad visible, footer y assets de marca compartidos.

### Modified Capabilities
- `local-profile`: La experiencia inicial antes de usar eventos y contactos cambia visualmente para mostrar el nuevo branding en la bienvenida.

## Impact

- Afecta `index.html` por el titulo del documento y el favicon.
- Afecta `src/app.js` por encabezados visibles, onboarding y nuevo footer global.
- Afecta `src/styles.css` por variables de color, layout y tratamiento del logo/footer.
- Requiere agregar assets locales de marca para no depender de referencias remotas en produccion.
