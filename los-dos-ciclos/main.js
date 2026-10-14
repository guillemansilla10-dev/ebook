import { buildPath, headAt, posAt } from './geom.js';
import { makeSegs } from './drawing.js';
import { prepare, drawLine, drawBlots } from './ink.js';
import { makePaper, drawPaper, vignette, makeTooth, drawTooth } from './paper.js';
import { DUR, LT, VO, TITLE } from './story.js';
import { subtitle, title, subBoxes, TITLE_POS } from './subs.js';
import { camAt, worldToScreen, BASE } from './cam.js';
import { CAM } from './shots.js';
import { penShadow } from './hands.js';
import { clamp, lerp, ss } from '/core/lib.js';

const q = new URLSearchParams(location.search);
const cv = document.getElementById('c');
cv.width = innerWidth; cv.height = innerHeight;
const ctx = cv.getContext('2d');
const W = cv.width, H = cv.height;
await document.fonts.load('500 40px Caveat'); await document.fonts.load('600 40px Caveat'); await document.fonts.load('80px Sacramento');

const P = prepare(buildPath(makeSegs(LT)));
const paper = makePaper(), tooth = makeTooth();
window.PATH = P;
const NOSUB = q.has('nosub') || q.has('clean');

function camFor(t) {
  let cam = camAt(P, CAM, t, W, H);
  if (q.get('cam')) { const [x, y, z] = q.get('cam').split(',').map(Number); cam = { cx: x, cy: y, k: BASE * z, r: 0, z }; }
  return cam;
}

// the pen is held by a right hand: its shadow falls toward the lower right
const PEN_DIR = (() => { const a = Math.atan2(0.85, 0.52); return [Math.cos(a), Math.sin(a)]; })();

function render(t) {
  const cam = camFor(t);
  const M = worldToScreen(cam, W, H);
  drawPaper(ctx, paper, cam, W, H);
  const head = q.has('all') ? P.N - 1 : headAt(P, t);
  drawLine(ctx, P, head, M, cam.k);
  drawBlots(ctx, P, q.has('all') ? 999 : t, M, cam.k);
  drawTooth(ctx, tooth, cam, W, H);
  vignette(ctx, W, H);
  if (!q.has('nopen') && !q.has('all')) {
    const tip = M(...posAt(P, head));
    // after the line runs off the paper, the pen is gone with it
    const onPage = tip[0] > -40 && tip[0] < W + 40 && tip[1] > -40 && tip[1] < H + 40;
    if (onPage) penShadow(ctx, tip, PEN_DIR, cam.k, { alpha: 1 });
  }
  if (!NOSUB) {
    for (const v of VO) subtitle(ctx, v.text, v.sub[0], v.sub[1], t, W, H);
    title(ctx, TITLE, t, W, H);
  }
}

// events for the mix: pen-speed track (200 Hz), corners, blot, voice, segments
function events() {
  const ev = [], track = [];
  const ringSeg = P.segs.findIndex(s => s.id === 'ring'), stopI = P.range[ringSeg][1];
  for (let t = 0; t <= DUR; t += 0.005) {
    const h = headAt(P, t), i = Math.floor(h), cam = camAt(P, CAM, t, W, H), M = worldToScreen(cam, W, H);
    const p = M(...posAt(P, h)), seg = P.segs[P.SEG[i]];
    const stopped = t > LT.stop && t < LT.go;
    const onPage = p[0] > -40 && p[0] < W + 40 && p[1] > -40 && p[1] < H + 40;
    const moving = t <= P.T[P.N - 1] && !stopped;
    track.push([+t.toFixed(3), moving ? Math.round(P.V[i]) : 0, +(clamp(p[0] / W)).toFixed(3), seg.style, +(P.DRY[i] || 0).toFixed(2), onPage ? 1 : 0]);
  }
  ev.push({ t: 0, type: 'track', data: track });
  const corners = [];
  for (let i = 8; i < P.N - 8; i++) {
    if (P.TURN[i] < 0.5) continue;
    let isMin = true; for (let j = -6; j <= 6; j++) if (P.V[i + j] < P.V[i]) { isMin = false; break; }
    if (isMin && (!corners.length || P.T[i] - corners.at(-1).t > 0.12)) corners.push({ t: +P.T[i].toFixed(3), seg: P.segs[P.SEG[i]].id });
  }
  ev.push({ t: 0, type: 'corners', data: corners });
  P.blots.forEach(b => ev.push({ t: b.t0, type: 'blot', dur: b.dur }));
  ev.push({ t: LT.go, type: 'tap' });
  VO.forEach(v => ev.push({ t: v.t0, type: 'vo', id: v.id }));
  P.segs.forEach(s => ev.push({ t: s.t[0], type: 'seg', id: s.id, t1: s.t[1] }));
  return ev;
}

// every on-screen text, for readcheck (the title; subtitles are checked from the .srt)
function texts(t) {
  const out = [];
  if (!NOSUB && t >= TITLE.t0) {
    ctx.save(); ctx.font = `${TITLE_POS.size}px Sacramento`; const w = ctx.measureText(TITLE.text).width; ctx.restore();
    out.push({ id: 'title', text: TITLE.text, x0: TITLE_POS.x, y0: TITLE_POS.y - TITLE_POS.size, x1: TITLE_POS.x + w, y1: TITLE_POS.y + 80 });
  }
  return out;
}

window.DUR = DUR;
window.EV = events();
window.TEXTS = texts;
window.render = render;
window.READY = true;
