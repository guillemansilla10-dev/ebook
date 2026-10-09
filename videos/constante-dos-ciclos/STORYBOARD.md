---
format: 1080x1920
duration: 30s
message: "No te falta disciplina: estás en el ciclo equivocado. CONSTANTE te muda al de la constancia en 21 días."
arc: Hook → Giro → Ciclo del abandono → Ciclo de la constancia → CTA
audience: mujeres que empiezan proyectos con energía y los abandonan antes de terminarlos
mode: autonomous
music: none
---

## Video direction

- **Palette (frame.md + brand override):** ground crema `#f4eee3`; tinta `#2b2326` para display; ciruela `#7c5360` para etiquetas, flechas y el único énfasis; rosa empolvado `#ecdadc` = el mundo "constancia"; papel `#fcf8f1` + hairline taupe `#b4aea4` = el mundo "abandono". El bloque ciruela relleno (callout del ebook) aparece solo en el CTA.
- **Type:** Cormorant Garamond Light para todo lo que se lee como titular (itálica para la palabra que duele o la que salva); DM Sans para nodos de diagrama; Space Mono mayúsculas espaciadas para etiquetas de capítulo ("EL PATRÓN").
- **Motion grammar:** easing largo y suave (`power3.out`), nada rebota. Video silencioso: cada revelado va al ritmo de lectura (≈0.9–1.4 s por pieza), nunca todo de golpe. Lo que se rompe (el ciclo del abandono) se mueve en círculo y vuelve al inicio; lo que construye (constancia) sube.
- **Holds:** Frame 2 es el respiro (una sola idea, quieta). Frame 5 termina quieto sobre el cierre.
- **Chrome:** footer `CONSTANTE` + etiqueta de sección en Space Mono sobre hairline, como las páginas del ebook.
- **Negative list:** sin bokeh, sin gradientes "IA", sin sombras duras, sin iconos genéricos, sin texto debajo del 83 % del alto. Sin slideshow (todo al inicio y congelado) ni salvapantallas (todo flotando).

## Frame 1 — Gancho: el patrón de siempre

- scene: "Día 1 · magia" → "Día 4 · aflojas" → "Día 7 · desapareciste", el número del día cambia en el sitio
- duration: 6s
- poster: 5s
- transition_in: cut
- type: hook
- beat: recognition
- blueprint: kinetic-type-beats (Adapt)
- focal: el número del día (gigante, Cormorant)
- roles: número del día = foreground subject · palabra del estado = foreground (debajo) · etiqueta "¿TE SUENA?" = supporting · barra de 7 puntos de progreso = supporting
- status: animated
- src: compositions/frames/01-hook.html

Adapt: se mantiene el token-swap en el sitio (firma del blueprint); los tokens son el día y el estado.
Scene 1 (0.0–1.8s): etiqueta "¿TE SUENA?" (Space Mono, ciruela) arriba; entra "Día 1" gigante centrado a ~0.32 del alto y debajo "magia." en itálica; fila de 7 puntos con el primero lleno.
Scene 2 (1.8–3.6s): swap en el sitio: el número pasa a "4", el estado a "aflojas." (más gris); puntos 1–4 llenos, el 4 ya más pálido.
Scene 3 (3.6–6.0s): swap a "7", estado "desapareciste." que se desvanece letra a letra a medio camino y queda translúcido; los puntos se vacían. Hold.

## Frame 2 — El giro

- scene: "No te falta disciplina." tachado → "Te falta un sistema."
- duration: 5s
- poster: 4.5s
- transition_in: crossfade
- type: pain_point
- beat: reframe
- blueprint: kinetic-type-beats (Adapt)
- focal: la palabra "sistema."
- roles: línea 1 = foreground · línea de tachado ciruela = supporting · línea 2 = foreground subject
- status: animated
- src: compositions/frames/02-giro.html

Scene 1 (0.0–1.6s): "No te falta" / "disciplina." entra por palabras, centrado alto.
Scene 2 (1.6–2.4s): una línea ciruela tacha "disciplina." (se dibuja de izquierda a derecha); el texto baja a 40 % de opacidad.
Scene 3 (2.4–5.0s): debajo entra "Te falta un" y "sistema." en itálica grande ciruela. Hold quieto.

## Frame 3 — El ciclo del abandono

- scene: cinco nodos en círculo que se encienden uno tras otro y vuelven al inicio
- duration: 7s
- poster: 6.5s
- transition_in: crossfade
- type: pain_point
- beat: diagnosis
- blueprint: compose
- focal: el anillo de 5 nodos
- roles: anillo hairline = background del diagrama · 5 nodos (tarjetas papel) = foreground · título "El ciclo del abandono" = supporting · "↻ y de nuevo al inicio" = supporting
- status: animated
- src: compositions/frames/03-abandono.html

Scene 1 (0.0–1.0s): etiqueta "EL PATRÓN" + título "El ciclo del abandono" arriba; el anillo hairline se dibuja.
Scene 2 (1.0–5.0s): los nodos aparecen en orden horario cada ~0.8 s: Entusiasmo inicial → Esfuerzo intenso → Agotamiento → Culpa → Parálisis; un punto ciruela recorre el anillo de nodo a nodo.
Scene 3 (5.0–7.0s): el punto completa la vuelta y regresa a "Entusiasmo inicial"; en el centro aparece "↻ y de nuevo al inicio". Hold.

## Frame 4 — El ciclo de la constancia

- scene: cinco peldaños que suben sobre tarjeta rosa: Intención clara → Identidad
- duration: 7s
- poster: 6.5s
- transition_in: crossfade
- type: feature_showcase
- beat: solution
- blueprint: grid-card-assemble (Adapt)
- focal: la escalera de 5 peldaños
- roles: tarjeta rosa = background del diagrama · peldaños = foreground · título = supporting · "↗ y sigue creciendo" = supporting
- status: animated
- src: compositions/frames/04-constancia.html

Adapt: se mantiene la cascada escalonada; la lista se arma de abajo hacia arriba como escalera.
Scene 1 (0.0–1.0s): etiqueta "LA SALIDA" + título "El ciclo de la constancia"; la tarjeta rosa se abre.
Scene 2 (1.0–5.0s): peldaños de abajo hacia arriba, cada uno más alto y desplazado a la derecha: Intención clara → Acción mínima viable → Evidencia → Confianza → Identidad (este último en ciruela).
Scene 3 (5.0–7.0s): una flecha ciruela recorre la escalera hacia arriba y sale por la esquina: "↗ y sigue creciendo". Hold.

## Frame 5 — CTA

- scene: CONSTANTE · Método de 21 días + callout ciruela + "link en bio"
- duration: 5s
- poster: 4.5s
- transition_in: crossfade
- type: cta
- beat: action
- blueprint: titlecard-reveal (Adapt)
- focal: wordmark CONSTANTE
- roles: wordmark = foreground subject · bloque ciruela = foreground · "21 días · 3 fases" = supporting · "Link en bio" = supporting
- status: animated
- src: compositions/frames/05-cta.html

Scene 1 (0.0–1.4s): "En 21 días te mudas" / "de un ciclo al otro." sube con fade.
Scene 2 (1.4–3.0s): wordmark "CONSTANTE" en Space Mono espaciado grande + "Método de 21 días" en Cormorant itálica.
Scene 3 (3.0–5.0s): bloque ciruela con "Descárgalo · link en bio"; hold final quieto.
