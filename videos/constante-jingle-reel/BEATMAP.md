# BEATMAP — CONSTANTE · Reel jingle

**Tema:** `assets/audio/constante-jingle.mp3` ("Mighty Woman Glow", Suno) · 10,08 s · ~99 BPM · 48 kHz estéreo
**Reel:** 1080 × 1920 · 30 fps · **11,0 s** (10,08 s de música + 0,92 s de cierre para leer el CTA)

## Estructura de la canción
- **0,00–4,90 s · Intro suave:** pulso cada ~0,60 s (≈ −30 dB). Es tensión: los cortes van en el pulso.
- **4,91 s · DROP:** la energía sube +25 dB de golpe. Aquí cambia el tono del video (del problema a la verdad).
- **4,91–10,08 s · Cuerpo:** golpes fuertes en 5,83 · **7,04** · 7,36 · 8,23 · 8,82 · **9,39**.

## Cortes y golpes (fotogramas a 30 fps)

| Fotograma | Tiempo | Golpe medido | Tipo | Qué pasa |
|---|---|---|---|---|
| 0 | 0,000 | 0,11 (inicio) | CORTE | S01 — "¿Te suena?" |
| 35 | 1,167 | 1,16 (pulso) | CORTE | S02 — DÍA **1** · *magia.* (1 punto lleno) |
| 71 | 2,367 | 2,36 (pulso) | CORTE | S03 — DÍA **4** · *aflojas.* (4 puntos, el último pálido) |
| 107 | 3,567 | 3,56 (pulso) | CORTE | S04 — DÍA **7** · *desapareciste.* se apaga letra a letra hasta el drop |
| 147 | 4,900 | **4,91 DROP** | CORTE | S05 — "No te falta *disciplina.*" entra de golpe |
| 175 | 5,833 | 5,83 | GOLPE | Tachado ciruela sobre *disciplina.*, el texto baja al 38 % |
| 211 | 7,033 | **7,04** | CORTE | S06 — "Te falta un" |
| 221 | 7,367 | 7,36 | GOLPE | *sistema.* (ciruela, 280 px) aterriza |
| 247 | 8,233 | 8,23 | GOLPE | Línea ciruela + "21 días · 3 fases · 10 min al día" |
| 265 | 8,833 | 8,82 | CORTE | S07 — CONSTANTE · *Método de 21 días* |
| 282 | 9,400 | **9,39** | GOLPE | Bloque ciruela "Descárgalo hoy · Link en bio" |
| 330 | 11,000 | — | FIN | Hold final quieto (la música termina en 10,08) |

**Verificado** en `renders/guide.mp4`: todos los cortes caen a ≤ 1 fotograma de su golpe.

## Excepciones a MOTION.md (pedidas para esta pieza)
- **Cortes secos** en todos los cambios de escena (MOTION.md pide crossfade 0,5 s): el corte en el golpe es el efecto.
- **Entradas más cortas** (0,3–0,45 s en vez de 0,7–0,9 s) para que cada elemento aterrice en su golpe.
- **Audio horneado** (el jingle es la marca sonora), en vez de publicar sin audio.
- Todo lo demás (paleta, tipografías, curvas `power3.out`, sin rebotes, footer) sigue MOTION.md.

## Cómo armarlo en After Effects
1. `git pull` en tu carpeta `ebook`.
2. En After Effects: **Archivo → Secuencias de comandos → Ejecutar archivo de script…** → `videos/constante-jingle-reel/ae/build_comp.jsx`.
   Crea la comp 1080×1920 / 30 fps / 11 s con BG crema, el jingle, la capa GUIDE (el animatic, que no se renderiza) y un marcador en cada corte (rojo) y golpe (verde).
3. **Opción rápida, sin agente:** ejecuta también `videos/constante-jingle-reel/ae/build_scenes.jsx`. Construye las 7 pre-comps con todos los acentos, la textura de papel, el push-in del drop, motion blur y la sombra del CTA; hace un backup del .aep y exporta un PNG por marcador a `renders/ae_frames/`.
   Necesita las fuentes instaladas: Cormorant Garamond (Light, Light Italic), **Cormorant Infant Light** (para los números con cifras alineadas) y Space Mono.
4. **Opción con agente:** en Claude Code (abierto desde `ebook`), pega:

> Lee `MOTION.md` y `videos/constante-jingle-reel/BEATMAP.md` enteros. En After Effects ya existe la comp "CONSTANTE — Reel jingle" con marcadores: rojo = CORTE, verde = GOLPE. Construye las 7 escenas como pre-comps `S01_HOOK` … `S07_CTA`, cada una empezando exactamente en su marcador de CORTE, con corte seco. Cada acento de la tabla tiene que arrancar en su marcador de GOLPE. Usa capas de texto y formas nativas, la paleta y tipografías de MOTION.md (cifras alineadas), entradas de 0,3–0,45 s con frenada larga (influencia entrante del 80 %) y motion blur. Toma la capa GUIDE como referencia de layout y tiempos. Haz un backup antes de editar y, al terminar, renderiza un fotograma en cada marcador para revisión.
