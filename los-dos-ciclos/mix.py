"""Mix: pen on paper (synthesised from the pen speed — the film's most important sound) + tap + blot + room tone +
voice-over + solo clarinet. $LIB/.venv/bin/python mix.py (LIB in env) → mix.wav (48 k stereo; loudness by mux.sh)"""
import sys, os, json, numpy as np, soundfile as sf, soxr
LIB = os.environ['LIB']; sys.path.insert(0, LIB)
from core.audio.sfx import SR, add, bp, lp, hp, compress, limit
HERE = os.path.dirname(os.path.abspath(__file__))
E = json.load(open(os.path.join(HERE, 'events.json'))); ev = E['ev']
DUR = E['dur'] + 0.5
N = int(DUR * SR)
rng = np.random.default_rng(21)
get = lambda typ: [e for e in ev if e['type'] == typ]
track = get('track')[0]['data']          # [t, speed, screen_x 0..1, style, dry, onPage]

def smooth(x, ms):
    n = max(1, int(SR * ms / 1000)); return np.convolve(x, np.ones(n) / n, 'same')

# ---------- pen on paper ----------
tt = np.array([r[0] for r in track]); T = np.arange(N) / SR
V = np.interp(T, tt, [r[1] for r in track]); PX = np.interp(T, tt, [r[2] for r in track])
DRY = np.interp(T, tt, [r[4] for r in track]); ON = smooth(np.interp(T, tt, [r[5] for r in track]), 300)
amp = smooth(np.clip(V / 520, 0, 1.5) ** 0.5, 30) * ON
grain = np.zeros(N)
dens = np.clip(V / 520, 0, 2) * 90 + (V > 5) * 25
idx = np.nonzero(rng.random(N) < dens / SR)[0]; grain[idx] = rng.standard_normal(len(idx)) * (0.5 + rng.random(len(idx)))
grain = bp(grain, 2500, 9000, 2)
white = rng.standard_normal(N)
hiss_hi, hiss_lo = bp(white, 2200, 7500, 2), bp(white, 700, 2400, 2)
bright = np.clip(V / 700, 0, 1)
scr = amp * ((0.55 + 0.45 * bright) * hiss_hi + (1 - bright) * 0.8 * hiss_lo) + amp * 1.6 * grain
# tired laps: the scratch breaks up where the ink goes dry
gate = 1 - DRY * 1.6 * (smooth((rng.random(N) < 14 / SR).astype(float), 40) > 0.004)
scr *= np.clip(gate, 0.2, 1)
scr = lp(scr, 9000, 2) * 0.13
pan = (PX - .5) * 1.1
pen = np.stack([scr * np.sqrt(np.clip(.5 - pan / 2, 0, 1)), scr * np.sqrt(np.clip(.5 + pan / 2, 0, 1))], 1).astype(np.float32)
sfx = pen.copy()

# the turn: a light wooden tap as the plum line sets off
for e in get('tap'):
    d = int(.25 * SR); t = np.arange(d) / SR
    tick = np.sin(2 * np.pi * 2300 * t) * np.exp(-t / .004) * .5 + bp(rng.standard_normal(d), 1500, 6000) * np.exp(-t / .006) * .6
    thud = np.sin(2 * np.pi * 140 * t) * np.exp(-t / .03) * .5
    add(sfx, ((tick + thud) * .3).astype(np.float32), e['t'] - .005, 1.0, -.1)
# the blot: a barely audible wet swell
for e in get('blot'):
    d = int(1.8 * SR); t = np.arange(d) / SR
    wet = lp(rng.standard_normal(d), 900, 2) * np.sin(np.pi * np.clip(t / 1.8, 0, 1)) ** 2
    add(sfx, (wet * .02).astype(np.float32), e['t'], 1.0, 0)

# room tone; dropped during the silence
room = lp(np.cumsum(rng.standard_normal(N)) * .002, 400, 2); room = room - smooth(room, 500)
room = (room / (np.abs(room).max() + 1e-9) * .004).astype(np.float32)
cues = json.load(open(os.path.join(HERE, 'music', 'cues.json')))
s0, s1 = cues['silence']
g_room = np.ones(N, np.float32); g_room[int(s0 * SR):int((s1 - .4) * SR)] = .1
sfx += np.stack([room, room], 1) * g_room[:, None]

# ---------- voice ----------
vo = np.zeros((N, 2), np.float32); duck = np.zeros(N, np.float32)
for e in get('vo'):
    y, sr = sf.read(os.path.join(HERE, 'voices', e['id'] + '.wav'))
    if y.ndim > 1: y = y.mean(1)
    y = soxr.resample(y, sr, SR)
    y = hp(y, 90, 2); y = lp(y, 9000, 2)
    y = compress(y / (np.abs(y).max() + 1e-9), thr=.3, ratio=3, att=.004, rel=.1)
    y = y / (np.abs(y).max() + 1e-9) * .5
    add(vo, y.astype(np.float32), e['t'], 1.0, 0)
    a, b = int(e['t'] * SR), int((e['t'] + len(y) / SR) * SR); duck[max(0, a - int(.25 * SR)):min(N, b + int(.3 * SR))] = 1
duck = smooth(duck, 250)

# ---------- music ----------
mus, _ = sf.read(os.path.join(HERE, 'music', 'score.wav')); mus = mus.astype(np.float32)
m = np.zeros((N, 2), np.float32); n = min(N, len(mus)); m[:n] = mus[:n]
m *= (1 - 0.44 * duck)[:, None]                  # ≈ −5 dB under the voice
sfx *= (1 - 0.37 * duck)[:, None]                # pen ≈ −4 dB under the voice

def db(x): return 20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-9)
mix = m * .17 + vo * 1.0 + sfx * 1.0
mix = limit(mix, .95)
sf.write(os.path.join(HERE, 'mix.wav'), mix.astype(np.float32), SR)
for i in range(0, int(DUR), 2):
    sl = slice(i * SR, (i + 2) * SR)
    print(f'{i:2d}s  music {db(m[sl] * .17):6.1f}  vo {db(vo[sl]):6.1f}  pen {db(pen[sl]):6.1f}')
print('mix.wav', mix.shape, 'peak', round(float(np.abs(mix).max()), 3))
