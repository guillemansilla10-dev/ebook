// Single source of truth for timing (seconds). Voice lines placed from voices/dur.json.
export const DUR = 30.0;
// line timing: start is negative = the pen is already running when the film opens
export const LT = {
  start: -0.7, ring0: 3.0, lap2: 5.5, lap3: 8.6, stop: 12.0, go: 14.0,
  turns: [16.2, 18.0, 20.0, 22.3, 24.9], end: 28.6,
};
export const VO = [
  { id: 'L1', text: 'Empiezas con todo.', t0: 0.5, sub: [0.5, 2.6] },
  { id: 'L2', text: 'Te esfuerzas, te agotas, te culpas…', t0: 3.5, sub: [3.5, 6.4] },
  { id: 'L2b', text: '…y vuelves al mismo punto.', t0: 8.7, sub: [8.7, 11.2] },
  { id: 'L3', text: 'Hay otro ciclo.', t0: 14.25, sub: [14.25, 16.0] },
  { id: 'L4', text: 'Una acción mínima. Una evidencia.\nConfianza.', t0: 16.3, sub: [16.3, 19.8] },
  { id: 'L4b', text: 'Hasta que se convierte en quién eres.', t0: 20.1, sub: [20.1, 22.8] },
  { id: 'L5', text: 'En 21 días te mudas\nde un ciclo al otro.', t0: 23.2, sub: [23.2, 26.3] },
  { id: 'L5b', text: 'No con fuerza de voluntad.\nCon un sistema.', t0: 26.5, sub: [26.5, 29.55] },
];
export const TITLE = { t0: 25.6, t1: 30.0, text: 'Los dos ciclos', sub: '21 días' };
// music bus fully silent between these times (the stop)
export const SILENCE = [12.2, 14.0];
