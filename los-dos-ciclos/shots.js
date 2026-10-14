// Camera keys: t s, (x,y) composition centre in paper units, z zoom (1 = whole page), r roll (deg), f follow weight
export const CAM = [
  { t: 0.0, x: -520, y: 760, z: 2.5, r: 0, f: .85 },     // mid-line at speed: follow the eager flourish
  { t: 2.6, x: -330, y: 300, z: 2.2, r: 0, f: .75 },
  { t: 3.6, x: -120, y: 420, z: 1.75, r: -1, f: .35 },   // the ring
  { t: 6.0, x: -120, y: 420, z: 1.8, r: -6, f: .3 },     // roll with the loop: round and round
  { t: 8.6, x: -120, y: 420, z: 1.95, r: -3, f: .15 },
  { t: 11.6, x: -120, y: 300, z: 2.7, r: 0, f: .3 },     // the ring closes on its start
  { t: 12.0, x: -120, y: 220, z: 3.1, r: 0, f: .2 },
  { t: 14.0, x: -120, y: 205, z: 3.6, r: 0, f: .1 },     // the stop: hold, very slow push-in
  { t: 15.6, x: -80, y: 150, z: 3.3, r: 0, f: .6 },      // macro on the first plum loop
  { t: 18.3, x: -20, y: -60, z: 2.3, r: 0, f: .65 },     // crane up with the growing loops
  { t: 22.8, x: 80, y: -420, z: 1.55, r: 0, f: .55 },
  { t: 23.3, x: 80, y: -430, z: 1.5, r: 0, f: .5 },
  { t: 27.0, x: 20, y: 40, z: 0.82, r: 0, f: 0 },        // one continuous pull-back: both cycles, one drawing
  { t: 30.0, x: 20, y: 36, z: 0.81, r: 0, f: 0 },
];
