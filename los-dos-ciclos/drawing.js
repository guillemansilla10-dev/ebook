// The one line of "Los dos ciclos". Paper units, y down.
//   start  — the pen is already running: an eager flourish from the lower left up to the top of the ring
//   ring   — three laps of the same circle, clockwise, each a little wider and more tired; stops where lap 3 ends
//   grow   — the plum line leaves the ring at the same tangent and turns the other way: loops that grow 1.5× per
//            turn and climb up and to the right until the line runs off the top of the paper
export const RING = { cx: -120, cy: 420, r: 230, dr: 6, laps: 3 };
export const GROW = { r0: 28, g: 1.5, turns: 6, drift: 2.0, dir: [0.42, -0.907] };

const f1 = v => v.toFixed(2);
const poly = pts => 'M' + pts.map(p => `${f1(p[0])},${f1(p[1])}`).join(' L');

// ring: clockwise from the top, radius grows dr per lap
function ringPts() {
  const { cx, cy, r, dr, laps } = RING, out = [], n = 900 * laps;
  for (let i = 0; i <= n; i++) {
    const th = (i / n) * laps * 2 * Math.PI, rr = r + dr * th / (2 * Math.PI);
    out.push([cx + rr * Math.sin(th), cy - rr * Math.cos(th)]);
  }
  return out;
}
export const RING_END = (() => { const p = ringPts(); return p[p.length - 1]; })();

// grow: counter-clockwise loops whose radius and drift grow geometrically
function growPts() {
  const { r0, g, turns, drift, dir } = GROW, [x0, y0] = RING_END, out = [], perTurn = 600;
  let D = 0;   // accumulated drift
  for (let i = 0; i <= turns * perTurn; i++) {
    const th = (i / perTurn) * 2 * Math.PI, k = th / (2 * Math.PI), r = r0 * Math.pow(g, k);
    if (i) { const kp = (i - 1) / perTurn; D += drift * r0 * Math.pow(g, (kp + k) / 2) * (k - kp); }
    out.push([x0 + dir[0] * D + r * Math.sin(th), y0 + dir[1] * D + r * (Math.cos(th) - 1)]);
  }
  return out;
}

// arc-length fraction at the end of each turn of `grow` (for timing marks)
export function growTurnF() {
  const p = growPts(), per = 600; let L = 0; const at = [];
  for (let i = 1; i < p.length; i++) { L += Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]); if (i % per === 0) at.push(L); }
  return at.map(a => a / L);
}

export function makeSegs(T) {
  const fT = growTurnF();
  return [
    {
      id: 'start', style: 'start', t: [T.start, T.ring0], slowK: 1.2,
      parts: [{ d: 'M -640,1010 C -580,880 -470,900 -470,780 C -470,660 -600,640 -560,540 C -520,440 -390,470 -400,560 C -410,640 -520,560 -470,420 C -430,300 -380,120 -300,90 C -230,70 -200,190 -120,190' }],
    },
    {
      id: 'ring', style: 'ring', t: [T.ring0, T.go], slowK: 0.6,
      parts: [{ d: poly(ringPts()) }],
      marks: [{ f: 1 / 3, t: T.lap2 }, { f: 2 / 3, t: T.lap3 }],
      holds: [{ f: 0.99995, t: T.stop, dur: T.go - T.stop }],
    },
    {
      id: 'grow', style: 'grow', t: [T.go, T.end], slowK: 0.5,
      parts: [{ d: poly(growPts()) }],
      marks: T.turns.map((t, i) => ({ f: fT[i], t })),
    },
  ];
}
