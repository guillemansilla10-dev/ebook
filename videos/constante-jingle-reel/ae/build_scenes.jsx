// CONSTANTE — Reel jingle · construye las 7 escenas (S01_HOOK … S07_CTA) en After Effects.
// Requisitos: haber corrido antes ae/build_comp.jsx (crea la comp, el audio, la GUIDE y los marcadores)
// y tener instaladas las fuentes de MOTION.md + Cormorant Infant (cifras alineadas).
// Uso: Archivo > Secuencias de comandos > Ejecutar archivo de script… > este archivo.
// Guía de marca: MOTION.md · Tiempos: videos/constante-jingle-reel/BEATMAP.md
(function () {
  var FPS = 30, W = 1080, H = 1920, TOTAL = 330;
  var COMP_NAME = "CONSTANTE — Reel jingle";
  var ROOT = File($.fileName).parent.parent; // videos/constante-jingle-reel/

  // ---------- paleta (MOTION.md §2) ----------
  var C = {
    crema: "#f4eee3", papel: "#fcf8f1", rosa: "#ecdadc", ciruela: "#7c5360",
    tinta: "#2b2326", gris: "#6b5f62", linea: "#b4aea4", chrome: "#736a6b",
    hair: "#cfc6bb", palido: "#c9b3ba"
  };
  function rgb(h) { return [parseInt(h.substr(1, 2), 16) / 255, parseInt(h.substr(3, 2), 16) / 255, parseInt(h.substr(5, 2), 16) / 255]; }

  // ---------- fuentes (PostScript, con alternativas) ----------
  var missing = [];
  function pickFont(cands) {
    try {
      if (app.fonts && app.fonts.getFontsByPostScriptName) {
        for (var i = 0; i < cands.length; i++) {
          var r = app.fonts.getFontsByPostScriptName(cands[i]);
          if (r && r.length) return cands[i];
        }
        missing.push(cands[0]);
      }
    } catch (e) {}
    return cands[0];
  }
  var F = {
    light: pickFont(["CormorantGaramond-Light", "CormorantGaramond-Regular"]),
    lightIt: pickFont(["CormorantGaramond-LightItalic", "CormorantGaramond-Italic"]),
    num: pickFont(["CormorantInfant-Light", "CormorantInfant-Regular", "CormorantGaramond-Light"]),
    mono: pickFont(["SpaceMono-Regular"])
  };

  // ---------- helpers ----------
  function sec(f) { return f / FPS; }
  function dims(p) {
    var t = p.propertyValueType;
    if (t === PropertyValueType.TwoD_SPATIAL || t === PropertyValueType.ThreeD_SPATIAL) return 1;
    if (t === PropertyValueType.TwoD) return 2;
    if (t === PropertyValueType.ThreeD) return 3;
    return 1;
  }
  function eases(n, infl) { var a = []; for (var i = 0; i < n; i++) a.push(new KeyframeEase(0, infl)); return a; }
  // kind: "in" = entrada (frenada larga, influencia entrante 80 %) · "out" = salida · "io" = trazo simétrico
  function anim(p, t0, dur, v0, v1, kind) {
    p.setValueAtTime(t0, v0);
    p.setValueAtTime(t0 + dur, v1);
    var k1 = p.nearestKeyIndex(t0), k2 = p.nearestKeyIndex(t0 + dur), n = dims(p);
    var o1 = 15, i2 = 80;
    if (kind === "out") { o1 = 70; i2 = 15; }
    if (kind === "io") { o1 = 60; i2 = 60; }
    p.setTemporalEaseAtKey(k1, eases(n, 33.33), eases(n, o1));
    p.setTemporalEaseAtKey(k2, eases(n, i2), eases(n, 33.33));
  }
  function tr(l, name) { return l.property("ADBE Transform Group").property(name); }
  function pos(l) { return tr(l, "ADBE Position"); }
  function opa(l) { return tr(l, "ADBE Opacity"); }
  function scl(l) { return tr(l, "ADBE Scale"); }

  function addText(comp, str, o) {
    var l = comp.layers.addText(str);
    l.name = o.name || str;
    var sp = l.property("ADBE Text Properties").property("ADBE Text Document");
    var td = sp.value;
    try { td.resetCharStyle(); td.resetParagraphStyle(); } catch (e) {}
    td.font = o.font; td.fontSize = o.size;
    td.applyFill = true; td.fillColor = rgb(o.color || C.tinta); td.applyStroke = false;
    td.tracking = o.tracking || 0;
    td.justification = o.just === "L" ? ParagraphJustification.LEFT_JUSTIFY :
      (o.just === "R" ? ParagraphJustification.RIGHT_JUSTIFY : ParagraphJustification.CENTER_JUSTIFY);
    sp.setValue(td);
    pos(l).setValue([o.x === undefined ? W / 2 : o.x, o.y]);
    l.motionBlur = true;
    if (o.center) centerAnchor(l);
    return l;
  }
  // ancla al centro visual del texto (para escalar desde el centro)
  function centerAnchor(l) {
    var r = l.sourceRectAtTime(0, false);
    var a = [r.left + r.width / 2, r.top + r.height / 2];
    var p = pos(l).value;
    tr(l, "ADBE Anchor Point").setValue(a);
    pos(l).setValue([p[0] + a[0], p[1] + a[1]]);
  }
  function shapeLayer(comp, name) {
    var l = comp.layers.addShape(); l.name = name;
    pos(l).setValue([0, 0]); l.motionBlur = true; return l;
  }
  function group(l, name) {
    var g = l.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group"); g.name = name; return g;
  }
  function rect(g, w, h, round, cx, cy, fill) {
    var c = g.property("ADBE Vectors Group");
    var r = c.addProperty("ADBE Vector Shape - Rect");
    r.property("ADBE Vector Rect Size").setValue([w, h]);
    r.property("ADBE Vector Rect Roundness").setValue(round);
    r.property("ADBE Vector Rect Position").setValue([cx, cy]);
    var f = c.addProperty("ADBE Vector Graphic - Fill"); f.property("ADBE Vector Fill Color").setValue(rgb(fill));
    return r;
  }
  function ellipse(g, d, cx, cy, fill, stroke) {
    var c = g.property("ADBE Vectors Group");
    var e = c.addProperty("ADBE Vector Shape - Ellipse");
    e.property("ADBE Vector Ellipse Size").setValue([d, d]);
    e.property("ADBE Vector Ellipse Position").setValue([cx, cy]);
    if (stroke) {
      var s = c.addProperty("ADBE Vector Graphic - Stroke");
      s.property("ADBE Vector Stroke Color").setValue(rgb(stroke));
      s.property("ADBE Vector Stroke Width").setValue(2);
    }
    if (fill) { var f = c.addProperty("ADBE Vector Graphic - Fill"); f.property("ADBE Vector Fill Color").setValue(rgb(fill)); }
  }
  function line(g, x0, y0, x1, y1, color, width) {
    var c = g.property("ADBE Vectors Group");
    var p = c.addProperty("ADBE Vector Shape - Group");
    var s = new Shape(); s.vertices = [[x0, y0], [x1, y1]]; s.closed = false;
    p.property("ADBE Vector Shape").setValue(s);
    var st = c.addProperty("ADBE Vector Graphic - Stroke");
    st.property("ADBE Vector Stroke Color").setValue(rgb(color));
    st.property("ADBE Vector Stroke Width").setValue(width);
    st.property("ADBE Vector Stroke Line Cap").setValue(2); // redondeado
    return c;
  }
  function blur(l) {
    var fx = l.property("ADBE Effect Parade").addProperty("ADBE Gaussian Blur 2");
    return fx.property("ADBE Gaussian Blur 2-0001");
  }
  // entrada estándar: opacidad 0→100 + Y +dy → 0
  function enter(l, t, dur, dy) {
    var p = pos(l).value;
    anim(opa(l), t, dur, 0, 100, "in");
    if (dy) anim(pos(l), t, dur, [p[0], p[1] + dy], p, "in");
  }
  function enterScale(l, t, dur, s0) {
    anim(opa(l), t, dur, 0, 100, "in");
    anim(scl(l), t, dur, [s0, s0, 100], [100, 100, 100], "in");
  }
  function label(comp, str, y, name) {
    return addText(comp, str, { font: F.mono, size: 30, color: C.ciruela, tracking: 320, y: y, name: name || ("lab_" + str) });
  }
  function footer(comp, section) {
    var l = shapeLayer(comp, "footer_linea");
    line(group(l, "hairline"), 80, 1500, 1000, 1500, C.hair, 2);
    addText(comp, "CONSTANTE", { font: F.mono, size: 22, color: C.chrome, tracking: 300, just: "L", x: 80, y: 1555, name: "footer_marca" });
    addText(comp, section.toUpperCase(), { font: F.mono, size: 22, color: C.chrome, tracking: 300, just: "R", x: 1000, y: 1555, name: "footer_seccion" });
  }
  function dotsLayer(comp, filled, paleIndex, startT) {
    var l = shapeLayer(comp, "puntos");
    for (var k = 0; k < 7; k++) {
      var g = group(l, "punto_" + (k + 1));
      var fill = k < filled ? (k === paleIndex ? C.palido : C.ciruela) : null;
      ellipse(g, 30, 360 + k * 60, 1345, fill, C.ciruela);
    }
    if (startT !== undefined) anim(opa(l), startT, 0.3, 0, 100, "in");
    return l;
  }
  function newScene(name, f0, f1) {
    var c = app.project.items.addComp(name, W, H, 1, sec(f1 - f0), FPS);
    c.motionBlur = true; c.shutterAngle = 180; c.bgColor = rgb(C.crema);
    return c;
  }

  // ---------- comp principal ----------
  var main = null;
  for (var i = 1; i <= app.project.numItems; i++) {
    var it = app.project.item(i);
    if (it instanceof CompItem && it.name === COMP_NAME) { main = it; break; }
  }
  if (!main) { alert("No encontré la comp \"" + COMP_NAME + "\". Corre primero ae/build_comp.jsx."); return; }

  // ---------- backup ----------
  var backupMsg = "Proyecto sin guardar: no se hizo backup (guárdalo y vuelve a correr si lo quieres).";
  if (app.project.file) {
    app.project.save();
    var src = app.project.file;
    var stamp = new Date(); var tag = stamp.getFullYear() + "" + (stamp.getMonth() + 1) + stamp.getDate() + "_" + stamp.getHours() + stamp.getMinutes();
    var dst = File(src.parent.fsName + "/" + src.name.replace(/\.aep$/i, "") + "_backup_" + tag + ".aep");
    backupMsg = src.copy(dst) ? ("Backup: " + dst.fsName) : "No se pudo copiar el backup.";
  }

  app.beginUndoGroup("CONSTANTE — escenas");
  main.motionBlur = true; main.shutterAngle = 180;
  if (main.duration < sec(TOTAL)) main.duration = sec(TOTAL);

  // limpia escenas de una corrida anterior
  for (var j = main.numLayers; j >= 1; j--) {
    var ly = main.layer(j);
    if (/^S0[1-7]_/.test(ly.name) || ly.name === "PAPEL") { ly.locked = false; ly.remove(); }
  }

  var folder = app.project.items.addFolder("CONSTANTE_ESCENAS");
  var CUTS = [0, 35, 71, 107, 147, 211, 265, 330];
  var scenes = [];

  // S01_HOOK — ¿Te suena?
  (function () {
    var c = newScene("S01_HOOK", CUTS[0], CUTS[1]);
    var q = addText(c, "¿Te suena?", { font: F.lightIt, size: 170, y: 820, name: "pregunta", center: true });
    enter(q, sec(3), 0.45, 40);
    var l = label(c, "EL PATRÓN DE SIEMPRE", 1010, "subtitulo"); enter(l, 0.5, 0.4, 0);
    footer(c, "El patrón");
    scenes.push(c);
  })();

  // S02–S04 — DÍA 1 / 4 / 7
  function dayScene(name, idx, num, word, wordColor, filled, pale, dotsAppear) {
    var c = newScene(name, CUTS[idx], CUTS[idx + 1]);
    label(c, "¿TE SUENA?", 330, "etiqueta");
    addText(c, "DÍA", { font: F.mono, size: 40, color: C.ciruela, tracking: 500, y: 570, name: "dia" });
    var n = addText(c, num, { font: F.num, size: 440, y: 930, name: "numero", center: true });
    var b = blur(n);
    enter(n, 0, 0.35, 50); anim(b, 0, 0.35, 10, 0, "in");
    var w = addText(c, word, { font: F.lightIt, size: 140, color: wordColor, y: 1180, name: "estado", center: true });
    enter(w, 0.15, 0.45, 24);
    var d = dotsLayer(c, filled, pale, dotsAppear);
    footer(c, "El patrón");
    scenes.push(c);
    return { comp: c, num: n, word: w };
  }
  dayScene("S02_DIA1", 1, "1", "magia.", C.tinta, 1, -1, 0.2);
  dayScene("S03_DIA4", 2, "4", "aflojas.", C.gris, 4, 3);
  var s4 = dayScene("S04_DIA7", 3, "7", "desapareciste.", C.ciruela, 0, -1);
  // S04: anticipación — la palabra se apaga letra a letra y el número baja, todo hacia el drop
  (function () {
    var anims = s4.word.property("ADBE Text Properties").property("ADBE Text Animators");
    var a = anims.addProperty("ADBE Text Animator"); a.name = "apagar_letras";
    a.property("ADBE Text Animator Properties").addProperty("ADBE Text Opacity").setValue(10);
    var sel = a.property("ADBE Text Selectors").addProperty("ADBE Text Selector");
    anim(sel.property("ADBE Text Percent End"), 0.45, 0.9, 0, 100, "io");
    anim(opa(s4.num), 0.6, 0.8, 100, 20, "out");
  })();

  // S05_DROP — No te falta disciplina. (tachado en el golpe 175)
  (function () {
    var c = newScene("S05_DROP", CUTS[4], CUTS[5]);
    label(c, "LA VERDAD", 360, "etiqueta");
    var a = addText(c, "No te falta", { font: F.light, size: 140, y: 720, name: "linea_1", center: true });
    var b = addText(c, "disciplina.", { font: F.lightIt, size: 190, y: 920, name: "disciplina", center: true });
    enterScale(a, 0, 0.3, 108); enterScale(b, sec(2), 0.3, 108);
    var r = b.sourceRectAtTime(1, false);
    var bp = pos(b).value, ba = tr(b, "ADBE Anchor Point").value;
    var x0 = bp[0] - ba[0] + r.left - 12, x1 = bp[0] - ba[0] + r.left + r.width + 12, y = bp[1] - ba[1] + r.top + r.height * 0.55;
    var s = shapeLayer(c, "tachado");
    line(group(s, "linea"), x0, y, x1, y, C.ciruela, 9);
    tr(s, "ADBE Anchor Point").setValue([x0, y]); pos(s).setValue([x0, y]);
    var tHit = sec(175 - CUTS[4]);
    anim(scl(s), tHit, 0.28, [0, 100, 100], [100, 100, 100], "in");
    anim(opa(a), tHit + 0.15, 0.4, 100, 38, "in");
    anim(opa(b), tHit + 0.15, 0.4, 100, 38, "in");
    footer(c, "La verdad");
    scenes.push(c);
  })();

  // S06_SISTEMA — Te falta un sistema. («sistema.» en 221, línea en 247)
  (function () {
    var c = newScene("S06_SISTEMA", CUTS[5], CUTS[6]);
    label(c, "LA VERDAD", 360, "etiqueta");
    var a = addText(c, "Te falta un", { font: F.light, size: 140, y: 680, name: "linea_1", center: true });
    enter(a, 0, 0.3, 30);
    var s = addText(c, "sistema.", { font: F.lightIt, size: 280, color: C.ciruela, y: 960, name: "sistema", center: true });
    var tS = sec(221 - CUTS[5]);
    var sp = pos(s).value;
    anim(opa(s), tS, 0.45, 0, 100, "in");
    anim(scl(s), tS, 0.45, [90, 90, 100], [100, 100, 100], "in");
    anim(pos(s), tS, 0.45, [sp[0], sp[1] + 40], sp, "in");
    var ln = shapeLayer(c, "linea_ciruela");
    var g = group(ln, "linea"); var gc = line(g, 300, 1150, 780, 1150, C.ciruela, 6);
    var trim = gc.addProperty("ADBE Vector Filter - Trim");
    var tA = sec(247 - CUTS[5]);
    anim(trim.property("ADBE Vector Trim End"), tA, 0.35, 0, 100, "in");
    var l = label(c, "21 DÍAS · 3 FASES · 10 MIN AL DÍA", 1260, "dato"); enter(l, tA + 0.1, 0.35, 16);
    footer(c, "La verdad");
    scenes.push(c);
  })();

  // S07_CTA — CONSTANTE + bloque en el golpe 282
  (function () {
    var c = newScene("S07_CTA", CUTS[6], CUTS[7]);
    var wm = addText(c, "CONSTANTE", { font: F.mono, size: 92, tracking: 280, y: 610, name: "wordmark", center: true });
    var wb = blur(wm);
    anim(opa(wm), 0, 0.4, 0, 100, "in"); anim(scl(wm), 0, 0.4, [110, 110, 100], [100, 100, 100], "in"); anim(wb, 0, 0.4, 8, 0, "in");
    var sub = addText(c, "Método de 21 días", { font: F.lightIt, size: 84, y: 730, name: "metodo", center: true }); enter(sub, 0.15, 0.4, 20);
    var tag = addText(c, "Para la mujer que termina lo que promete.", { font: F.light, size: 54, color: C.gris, y: 830, name: "tagline" }); enter(tag, 0.3, 0.4, 0);
    var tB = sec(282 - CUTS[6]);
    var box = shapeLayer(c, "bloque_cta");
    rect(group(box, "bloque"), 900, 300, 36, 540, 1170, C.ciruela);
    tr(box, "ADBE Anchor Point").setValue([540, 1170]); pos(box).setValue([540, 1170]);
    var ds = box.property("ADBE Effect Parade").addProperty("ADBE Drop Shadow");
    ds.property("ADBE Drop Shadow-0001").setValue(rgb(C.tinta)); // color
    ds.property("ADBE Drop Shadow-0002").setValue(0.12 * 255);   // opacidad 12 %
    ds.property("ADBE Drop Shadow-0003").setValue(180);          // dirección: hacia abajo
    ds.property("ADBE Drop Shadow-0004").setValue(14);           // distancia
    ds.property("ADBE Drop Shadow-0005").setValue(48);           // suavidad
    // textos emparentados al bloque ANTES de animarlo (si no, heredan el desfase de la posición inicial)
    var t1 = addText(c, "Descárgalo hoy", { font: F.lightIt, size: 100, color: C.crema, y: 1160, name: "cta_1" });
    var t2 = addText(c, "LINK EN BIO", { font: F.mono, size: 32, color: C.rosa, tracking: 320, y: 1245, name: "cta_2" });
    t1.parent = box; t2.parent = box;
    anim(opa(box), tB, 0.45, 0, 100, "in");
    anim(pos(box), tB, 0.45, [540, 1230], [540, 1170], "in");
    anim(scl(box), tB, 0.45, [96, 96, 100], [100, 100, 100], "in");
    anim(opa(t1), tB, 0.45, 0, 100, "in");
    anim(opa(t2), tB + 0.2, 0.3, 0, 100, "in");
    footer(c, "Método de 21 días");
    scenes.push(c);
  })();

  // ---------- montaje en la comp principal (cortes secos en cada marcador) ----------
  var bgLayer = null, guide = null;
  for (var m = 1; m <= main.numLayers; m++) {
    if (main.layer(m).name === "BG") bgLayer = main.layer(m);
    if (/^GUIDE/.test(main.layer(m).name)) guide = main.layer(m);
  }
  // textura de papel: Fractal Noise 4 % en Superponer, sobre el BG
  var paper = main.layers.addSolid(rgb(C.crema), "PAPEL", W, H, 1, sec(TOTAL));
  var fn = paper.property("ADBE Effect Parade").addProperty("ADBE Fractal Noise");
  try { fn.property("ADBE Fractal Noise-0008").setValue(3); } catch (e) {} // complejidad
  paper.blendingMode = BlendingMode.OVERLAY;
  opa(paper).setValue(4);
  if (bgLayer) { var wasLocked = bgLayer.locked; bgLayer.locked = false; paper.moveBefore(bgLayer); bgLayer.locked = wasLocked; }
  paper.locked = true;

  for (var s = 0; s < scenes.length; s++) {
    var sc = scenes[s]; sc.parentFolder = folder;
    var L = main.layers.add(sc);
    L.name = sc.name; L.startTime = sec(CUTS[s]); L.motionBlur = true;
    if (L.outPoint > sec(CUTS[s + 1])) L.outPoint = sec(CUTS[s + 1]);
    L.moveBefore(paper);
  }
  if (guide) guide.moveToBeginning();

  // S05: push-in de cámara 100 → 103 % durante toda la escena
  var drop = null;
  for (var d = 1; d <= main.numLayers; d++) if (main.layer(d).name === "S05_DROP") drop = main.layer(d);
  if (drop) {
    tr(drop, "ADBE Anchor Point").setValue([W / 2, H / 2]); pos(drop).setValue([W / 2, H / 2]);
    anim(scl(drop), sec(CUTS[4]), sec(CUTS[5] - CUTS[4]), [100, 100, 100], [103, 103, 100], "io");
  }
  app.endUndoGroup();

  // ---------- fotograma de revisión en cada marcador ----------
  var MARK_FRAMES = [0, 35, 71, 107, 147, 175, 211, 221, 247, 265, 282];
  var outDir = Folder(ROOT.fsName + "/renders/ae_frames"); if (!outDir.exists) outDir.create();
  var saved = 0;
  if (guide) guide.enabled = false;
  for (var k = 0; k < MARK_FRAMES.length; k++) {
    // 8 fotogramas después del marcador, para ver el elemento ya entrando
    var f = Math.min(MARK_FRAMES[k] + 8, TOTAL - 1);
    try { main.saveFrameToPng(sec(f), File(outDir.fsName + "/f" + ("00" + f).slice(-3) + ".png")); saved++; } catch (e2) {}
  }
  if (guide) guide.enabled = true;

  alert(
    "CONSTANTE — escenas listas\n\n" +
    "• 7 pre-comps (S01_HOOK … S07_CTA) con cortes secos en los marcadores rojos\n" +
    "• Acentos en los golpes 175, 221, 247 y 282\n" +
    "• Textura PAPEL (Fractal Noise 4 % Overlay) · push-in 100→103 % en S05 · motion blur 180°\n" +
    "• " + backupMsg + "\n" +
    "• Fotogramas de revisión: " + saved + " en renders/ae_frames" + (saved ? "" : " (esta versión de AE no permite exportarlos por script)") + "\n" +
    (missing.length ? "\n⚠ Fuentes no encontradas (AE las sustituye): " + missing.join(", ") : "")
  );
})();
