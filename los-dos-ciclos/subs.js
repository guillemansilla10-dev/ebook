// Subtitles: Caveat, written on left to right over a paper-coloured halo, then faded. Title: Sacramento, written on.
import { clamp, ss } from '/core/lib.js';
const INK = 'rgba(29,26,23,';
function halo(ctx, text, x, y, w) { ctx.strokeStyle = 'rgba(244,239,228,0.92)'; ctx.lineWidth = w; ctx.lineJoin = 'round'; ctx.filter = 'blur(3px)'; ctx.strokeText(text, x, y); ctx.filter = 'none'; }

export const SUB = { size: 68, lead: 1.1, yFrac: 0.865 };

export function subBoxes(text, W, H, ctx) {
  const lines = text.split('\n'), { size, lead, yFrac } = SUB;
  ctx.save(); ctx.font = `500 ${size}px Caveat`;
  const ws = lines.map(l => ctx.measureText(l).width); ctx.restore();
  const y0 = H * yFrac - (lines.length - 1) * size * lead;
  return lines.map((l, i) => ({ text: l, w: ws[i], x: W / 2, y: y0 + i * size * lead }));
}

export function subtitle(ctx, text, t0, t1, t, W, H) {
  if (t < t0 - 0.01 || t > t1 + 0.45) return;
  const { size } = SUB, rows = subBoxes(text, W, H, ctx);
  const total = text.replace('\n', '').length, wDur = Math.min(1.1, 0.2 + total * 0.017);
  let before = 0;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.font = `500 ${size}px Caveat`; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
  ctx.globalAlpha = 1 - clamp((t - t1) / 0.45);
  for (const r of rows) {
    const share = r.text.length / total, a = t0 + wDur * before, write = clamp((t - a) / (wDur * share));
    before += share;
    if (write <= 0) continue;
    const x0 = r.x - r.w / 2;
    ctx.save(); ctx.beginPath(); ctx.rect(x0 - 24, r.y - size * 1.3, (r.w + 48) * ss(write), size * 2); ctx.clip();
    halo(ctx, r.text, r.x, r.y, 14); ctx.fillStyle = INK + '0.84)'; ctx.fillText(r.text, r.x, r.y);
    ctx.restore();
  }
  ctx.restore();
}

// title: written into the empty paper at upper left during the pull-back
export const TITLE_POS = { x: 70, y: 240, size: 100 };
export function title(ctx, T, t, W, H) {
  if (t < T.t0) return;
  const { x, y, size } = TITLE_POS;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.font = `${size}px Sacramento`; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  const w = ctx.measureText(T.text).width, write = clamp((t - T.t0) / 1.6);
  ctx.save(); ctx.beginPath(); ctx.rect(x - 30, y - size, (w + 60) * write, size * 1.6); ctx.clip();
  halo(ctx, T.text, x, y, 16); ctx.fillStyle = INK + '0.9)'; ctx.fillText(T.text, x, y); ctx.restore();
  ctx.globalAlpha = clamp((t - T.t0 - 1.3) / 0.6);
  ctx.font = '600 40px Caveat'; ctx.letterSpacing = '6px'; halo(ctx, T.sub, x + 14, y + 66, 10); ctx.fillStyle = INK + '0.62)'; ctx.fillText(T.sub, x + 14, y + 66);
  ctx.restore();
}
