## Context

La aplicacion ya funciona como sitio estatico y esta cerca de ser publicada por GitHub Pages, pero todavia conserva un branding temporal propio del prototipo. Hoy el nombre visible usa `NetworKing`, el fondo base responde a una paleta verdosa y no existe un footer global ni una estrategia local para servir assets de marca como logo y favicon.

El pedido introduce branding de Kleer en dos momentos importantes: la bienvenida inicial y el cierre persistente de toda la experiencia. Tambien cambia el tono visual principal hacia `#204864`, lo que obliga a revisar contraste, footer, logo y favicon como parte de un sistema de presentacion coherente.

## Goals / Non-Goals

**Goals:**
- Mostrar `Networ-King by Kleer` en los puntos principales de entrada y contexto.
- Incorporar un footer global con copyright y logo de Kleer en toda la app.
- Hacer que la bienvenida antes del uso de eventos refleje el branding final.
- Cambiar la base de color de fondo a `#204864` sin perder legibilidad.
- Servir logo y favicon de Kleer como assets locales del proyecto.

**Non-Goals:**
- Rehacer la arquitectura funcional o los flujos principales de captura.
- Rediseñar por completo todos los componentes internos.
- Consumir assets remotos de Kleer en runtime.
- Introducir un sistema de theming configurable por usuario.

## Decisions

### 1. Guardar los assets de Kleer dentro del repo

El logo y el favicon se agregaran al proyecto como archivos locales servidos por la app estatica.

Rationale:
- Evita dependencia de URLs externas para branding critico.
- Hace que GitHub Pages sirva todo desde el mismo origen.
- Reduce el riesgo de cambios inesperados en `kleer.la`.

Alternativas consideradas:
- Hotlinkear assets remotos: mas rapido, pero fragil para una app publicada.

### 2. Agregar un footer de marca reutilizable

La app tendra un footer global renderizado tanto en onboarding como en la experiencia principal, con texto `© 2026 Networ-King by Kleer` y el logo de Kleer debajo.

Rationale:
- Resuelve de forma consistente el pedido de presencia “abajo de todo”.
- Evita duplicar bloques visuales sueltos en cada vista.

Alternativas consideradas:
- Repetir el bloque manualmente en cada pantalla: mas simple al principio, pero menos mantenible.

### 3. Usar una paleta azul centralizada en variables CSS

El color `#204864` se aplicara como base de fondo desde variables CSS, revisando superficies, texto y componentes secundarios para mantener contraste adecuado.

Rationale:
- Permite ajustar toda la experiencia desde un set pequeño de tokens visuales.
- Reduce regresiones visuales por colores hardcodeados.

Alternativas consideradas:
- Cambiar solo el `body` y dejar el resto igual: rapido, pero probablemente inconsistente.

### 4. Tratar el logo negro de Kleer sobre superficie clara

Como el logo provisto es negro y el fondo deseado es oscuro, el logo se presentara dentro de una superficie clara o neutra para asegurar contraste.

Rationale:
- Preserva legibilidad sin depender de una variante blanca del logo.
- Evita que el branding quede “perdido” sobre el azul profundo.

Alternativas consideradas:
- Buscar o fabricar una version blanca del logo: potencialmente mejor, pero no garantizada por el pedido actual.

## Risks / Trade-offs

- [Contraste insuficiente entre fondo y contenido] -> Ajustar tokens de texto, superficies y footer como sistema, no como retoques aislados.
- [Inconsistencia entre onboarding y app principal] -> Usar un footer compartido y puntos de branding definidos.
- [Logo negro sobre fondo oscuro] -> Colocar el logo dentro de una tarjeta o banda clara.
- [Asset oficial ambiguo para favicon] -> Confirmar el favicon real de Kleer y copiarlo al repo antes de implementarlo.

## Migration Plan

1. Incorporar los assets locales de logo y favicon.
2. Actualizar `index.html` para usar el favicon local y el titulo nuevo.
3. Ajustar `src/app.js` para mostrar el nuevo nombre visible y el footer global.
4. Actualizar `src/styles.css` con la nueva paleta y el tratamiento visual del footer/logo.
5. Verificar la experiencia publicada en GitHub Pages y en mobile.

## Open Questions

- Si el favicon deseado debe ser exactamente el que usa hoy `kleer.la` o una variante exportada del mismo set de marca.
- Si el copyright debe decir solo `© 2026 Networ-King by Kleer` o incluir tambien algun enlace a Kleer.
