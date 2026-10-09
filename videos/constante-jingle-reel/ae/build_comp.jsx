// CONSTANTE — Reel jingle · crea la comp base con audio, guía y marcadores en cada golpe.
// After Effects: Archivo > Secuencias de comandos > Ejecutar archivo de script... y elegir este archivo.
(function () {
  var root = File($.fileName).parent.parent; // videos/constante-jingle-reel/
  var FPS = 30, W = 1080, H = 1920, DUR = 330 / FPS; // 11 s
  // [frame, nombre, tipo]  tipo: CORTE = cambio de escena · GOLPE = acento dentro de la escena
  var MARKS = [
    [0,   "S01_HOOK — ¿Te suena?", "CORTE"],
    [35,  "S02_DIA1 — 1 · magia.", "CORTE"],
    [71,  "S03_DIA4 — 4 · aflojas.", "CORTE"],
    [107, "S04_DIA7 — 7 · desapareciste.", "CORTE"],
    [147, "S05_DROP — No te falta disciplina.", "CORTE"],
    [175, "golpe: tachado ciruela", "GOLPE"],
    [211, "S06_SISTEMA — Te falta un…", "CORTE"],
    [221, "golpe: «sistema.» entra", "GOLPE"],
    [247, "golpe: línea + 21 días · 3 fases", "GOLPE"],
    [265, "S07_CTA — CONSTANTE · Método de 21 días", "CORTE"],
    [282, "golpe: bloque «Descárgalo hoy · Link en bio»", "GOLPE"]
  ];
  app.beginUndoGroup("CONSTANTE jingle comp");
  var proj = app.project || app.newProject();
  var folder = proj.items.addFolder("CONSTANTE_JINGLE");
  var comp = proj.items.addComp("CONSTANTE — Reel jingle", W, H, 1, DUR, FPS);
  comp.parentFolder = folder;
  comp.motionBlur = true;
  comp.shutterAngle = 180;
  var bg = comp.layers.addSolid([244/255, 238/255, 227/255], "BG", W, H, 1, DUR);
  bg.locked = true;
  var audioFile = File(root.fsName + "/assets/audio/constante-jingle.mp3");
  if (audioFile.exists) {
    var a = proj.importFile(new ImportOptions(audioFile)); a.parentFolder = folder;
    var al = comp.layers.add(a); al.name = "AUDIO_jingle"; al.locked = true;
  } else { alert("No encontré assets/audio/constante-jingle.mp3"); }
  var guideFile = File(root.fsName + "/renders/guide.mp4");
  if (guideFile.exists) {
    var g = proj.importFile(new ImportOptions(guideFile)); g.parentFolder = folder;
    var gl = comp.layers.add(g); gl.name = "GUIDE (no se renderiza)"; gl.guideLayer = true;
    gl.audioEnabled = false; gl.opacity.setValue(35);
  }
  for (var i = 0; i < MARKS.length; i++) {
    var mv = new MarkerValue(MARKS[i][1]);
    mv.comment = MARKS[i][2] + " · " + MARKS[i][1];
    if (MARKS[i][2] === "CORTE") mv.label = 1; else mv.label = 9;
    comp.markerProperty.setValueAtTime(MARKS[i][0] / FPS, mv);
  }
  comp.openInViewer();
  app.endUndoGroup();
  alert("Comp creada: " + MARKS.length + " marcadores. Rojo = CORTE, verde = GOLPE.");
})();
