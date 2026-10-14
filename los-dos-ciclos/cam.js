// Camera: composition keys (centre/zoom/roll/follow) blended with a nib follow (lag + anticipation), nib kept in frame
import { clamp, lerp } from '/core/lib.js';
import { headAt, posAt } from './geom.js';

export const BASE = 0.95;   // px per paper unit at z=1 (whole page on a 1080×1920 frame)

const sm = t => t * t * (3 - 2 * t);
function keyAt(keys, t) {
  if (t <= keys[0].t) return { ...keys[0] };
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    if (t <= b.t) {
      const u = sm((t - a.t) / (b.t - a.t));
      return { x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u), z: Math.exp(lerp(Math.log(a.z), Math.log(b.z), u)), r: lerp(a.r || 0, b.r || 0, u), f: lerp(a.f, b.f, u) };
    }
  }
  return { ...keys[keys.length - 1] };
}

export function camAt(P, keys, t, W = 1920, H = 1080) {
  const K = keyAt(keys, t);
  // 跟拍点：t-0.55 … t+0.4 的加权平均（先有延迟，再带一点预判）
  let fx = 0, fy = 0, ws = 0;
  for (let j = -11; j <= 8; j++) {
    const tt = t + j * 0.05, w = Math.exp(-((j + 1.5) * (j + 1.5)) / 40);
    const p = posAt(P, headAt(P, tt)); fx += p[0] * w; fy += p[1] * w; ws += w;
  }
  fx /= ws; fy /= ws;
  let cx = lerp(K.x, fx, K.f), cy = lerp(K.y, fy, K.f);
  const k = BASE * K.z, r = K.r * Math.PI / 180;
  // 笔尖保持在画面内（软约束）
  const pen = posAt(P, headAt(P, t));
  const c = Math.cos(-r), s = Math.sin(-r);
  let px = (pen[0] - cx) * k, py = (pen[1] - cy) * k; let sx = c * px - s * py, sy = s * px + c * py;
  // the nib stays inside the frame and above the subtitle band (asymmetric vertical limits)
  const mx = W * 0.36, myTop = H * 0.33, myBot = H * 0.21;
  const soft = (v, m) => { const a = Math.abs(v); if (a <= m) return 0; return Math.sign(v) * (a - m); };
  const ex = soft(sx, mx), ey = sy < 0 ? soft(sy, myTop) : soft(sy, myBot);
  // a composed shot (follow weight ~0) is not dragged along by the nib (e.g. once the line runs off the paper)
  const hold = Math.min(1, K.f / 0.2);
  if ((ex || ey) && hold > 0) { // 屏幕偏移换回世界
    const ic = Math.cos(r), is = Math.sin(r); cx += hold * (ic * ex - is * ey) / k; cy += hold * (is * ex + ic * ey) / k;
  }
  return { cx, cy, k, r, z: K.z };
}

export function worldToScreen(cam, W = 1920, H = 1080) {
  const c = Math.cos(-cam.r), s = Math.sin(-cam.r), k = cam.k;
  return (x, y) => { const px = (x - cam.cx) * k, py = (y - cam.cy) * k; return [W / 2 + c * px - s * py, H / 2 + s * px + c * py]; };
}
