"""Solo clarinet: one unbroken melodic line written to the drawing.
A eager rising figure · B a four-note ostinato that goes round with the ring, slower and softer each lap ·
C literal silence at the stop · D a D-major line that climbs one step per spiral turn · E the highest note as the
line leaves the paper, held to the end.
$LIB/.venv/bin/python music/score.py  (LIB in env) → music/score.wav + music/cues.json"""
import sys, os, json, numpy as np, soundfile as sf
LIB = os.environ['LIB']; sys.path.insert(0, LIB)
from core.audio import sampler as S
from core.audio.sfx import SR, add
HERE = os.path.dirname(os.path.abspath(__file__))
E = json.load(open(os.path.join(HERE, '..', 'events.json')))
DUR = E['dur'] + 0.5
S.seed(21)
buf = np.zeros((int(DUR * SR), 2), np.float32)
PAN = 0.1   # one clarinet, a little right of the paper

def legato(notes, vel=.5, attack=.06, tail=.9, gain=1.0, overlap=.1, first_attack=None, upto=None):
    """notes = [(t, pitch[, vel])]; each note lasts to the next onset + overlap (slurred)"""
    for i, n in enumerate(notes):
        t, p = n[0], n[1]; v = n[2] if len(n) > 2 else vel
        t1 = notes[i + 1][0] + overlap if i + 1 < len(notes) else (upto if upto else t + tail)
        a = first_attack if (i == 0 and first_attack) else attack
        add(buf, S.note('clarinet', p, max(.15, t1 - t), vel=v, attack=a, release=.35), t, gain, PAN)

cues = {}
# A arranque: quick, light, rising (the line is fast) — already moving at t=0
legato([(0.0, 'A3', .5), (0.35, 'D4', .55), (0.7, 'F4', .58), (1.05, 'A4', .62), (1.7, 'G4', .55),
        (2.15, 'F4', .52), (2.55, 'E4', .5)], attack=.03, gain=1.0)
# B el bucle: D F E C# once per quarter lap; each lap longer notes, softer
laps = [(3.0, 5.5, .52), (5.5, 8.6, .44), (8.6, 12.0, .34)]
B = []
for (a, b, v) in laps:
    q = (b - a) / 4
    for k, p in enumerate(['D4', 'F4', 'E4', 'C#4']): B.append((a + k * q, p, v - .02 * k))
B[-1] = (B[-1][0], 'C#4', .3)
legato(B, attack=.05, upto=12.25)
cues['silence'] = [12.25, 14.0]
# D el otro ciclo: first sound after the silence is a low D (with the pen's tap); one step up per spiral turn
D = [(14.0, 'D3', .48), (15.1, 'E3', .44), (16.2, 'F#3', .5), (17.1, 'G3', .46), (18.0, 'A3', .52), (19.0, 'B3', .48),
     (20.0, 'D4', .55), (21.1, 'E4', .5), (22.3, 'F#4', .56)]
legato(D, first_attack=.25, attack=.08, overlap=.12, upto=22.65)
# breath 22.65–23.0, then the climb resumes into the pull-back
E2 = [(23.0, 'G4', .52), (24.9, 'A4', .58), (25.8, 'B4', .6), (26.6, 'D5', .66)]
legato(E2, first_attack=.15, attack=.08, overlap=.12, upto=30.2)
cues['top'] = 26.6

mix = S.room(buf, size=.5, mix=.2)
# the stop: the music bus (reverb tail included) is zeroed
a, b = cues['silence']; i0, i1 = int(a * SR), int(b * SR); f = int(.25 * SR)
g = np.ones(len(mix), np.float32); g[i0:i1] = 0; g[i0 - f:i0] = np.linspace(1, 0, f)
# final fade
fo = int(1.2 * SR); g[int(29.2 * SR):int(29.2 * SR) + fo] *= np.linspace(1, 0, fo)[:len(g[int(29.2 * SR):int(29.2 * SR) + fo])]; g[int(30.4 * SR):] = 0
mix *= g[:, None]
mix = mix / (np.abs(mix).max() + 1e-9) * .8
sf.write(os.path.join(HERE, 'score.wav'), mix, SR)
json.dump(cues, open(os.path.join(HERE, 'cues.json'), 'w'), indent=1)
print('score.wav', round(len(mix) / SR, 2), 's', cues)
print('\n'.join(S.credits(['clarinet'])))
