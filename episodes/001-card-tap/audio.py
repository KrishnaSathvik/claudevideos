"""Score, sound effects and voice for "The Tap Line" -> mix.wav (48 kHz stereo, exactly DUR seconds, about -16 LUFS).
Run from the library root after `node core/render/events.mjs <project>`:   $LIB/.venv/bin/python <project>/audio.py
100 BPM (beat 0.6 s), E major, chords E - C#m - A - B one per bar. The motif is the terminal's two-note chime (E -> B):
the beep at the tap, the cut into the map, APPROVED, the money landing, the end. Each check line adds one voice."""
import sys, os, json, re, subprocess, tempfile
HERE = os.path.dirname(os.path.abspath(__file__)); LIB = os.environ.get('LIB') or os.path.expanduser('~/lemo-opuscar')
sys.path.insert(0, LIB)
import numpy as np, soundfile as sf, soxr
from core.audio import sampler as S
from core.audio.sfx import SR, add, limit, whoosh, click, clack, pop, thump, noise, bp, hp, lp, t_, norm, brown, compress, crash

S.seed(11)
EV = json.load(open(os.path.join(HERE, 'events.json'))); DUR = EV['dur']; ev = EV['ev']; N = int(round(DUR * SR))
SCRIPT = json.load(open(os.path.join(HERE, 'script.json')))
cue = {e['type']: e['t'] for e in ev if e['type'] not in ('stop', 'x', 'minor', 'depart', 'drop')}
drops = {e['id']: e['t'] for e in ev if e['type'] == 'drop'}
used = set(); mus = []
def n(t, inst, pitch, dur, vel, pan=0, gain=1.0, **kw):
    if t < 0 or t >= DUR: return
    used.add(inst); mus.append(dict(t=float(t), inst=inst, pitch=pitch, dur=dur, vel=vel, pan=pan, gain=gain, **kw))
M = S.midi
BEAT = .6; E8 = .3; BAR = 2.4
CH = {'E': ['E3', 'B3', 'E4', 'G#4'], 'C#m': ['C#3', 'G#3', 'C#4', 'E4'], 'A': ['A2', 'E3', 'A3', 'C#4'], 'B': ['B2', 'F#3', 'B3', 'D#4']}
ROOT = {'E': 'E2', 'C#m': 'C#2', 'A': 'A1', 'B': 'B1'}
PROG = ['E', 'C#m', 'A', 'B']
def chord_at(t, t0): return PROG[int((t - t0) // BAR) % 4]
def chime(t, v=.7, pan=0, g=.7, low=False):     # the terminal chime, E -> B
    a, b = ('E5', 'B4') if low else ('E6', 'B5')
    n(t, 'vibraphone_hard', a, 1.4, v, pan, g); n(t + .3, 'vibraphone_hard', b, 2.2, v * .92, pan, g)
    n(t, 'glockenspiel', a, .8, v * .5, pan, g * .45); n(t + .3, 'glockenspiel', b, 1.2, v * .45, pan, g * .45)
def pad(t, ch, d, v=.3, g=.38):
    tones = CH[ch]
    n(t, 'violins', M(tones[3]) + 12, d, v, -.35, g, attack=1.0, release=1.0); n(t, 'violas', tones[2], d, v * .9, .3, g * .9, attack=1.1, release=1.0)
    n(t, 'cellos', tones[0], d, v, .1, g, attack=1.0, release=1.0)
def ostinato(a, b, g0, gain=1.0, kick=False, snare=False, bass=True):   # marimba eighths on the film-time grid
    t = g0 + np.ceil((a - g0) / E8 - 1e-6) * E8; i = int(round((t - g0) / E8))
    while t < b - 1e-6:
        ch = chord_at(t, g0); tones = CH[ch]
        n(t, 'marimba', M(tones[[0, 2, 1, 3, 2, 1, 3, 2][i % 8]]) + 12, .3, (.44 + .1 * (i % 2 == 0)), -.25 + .5 * (i % 2), .5 * gain)
        if bass and i % 2 == 0: n(t, 'contrabass_pizz', ROOT[ch], .45, .68 if i % 4 == 0 else .5, 0, .8 * gain)
        if kick and i % 4 == 0: n(t, 'bass_drum', None, None, .42, 0, .5 * gain)
        if snare and i % 4 == 2: n(t, 'snare2', 'stick', None, .42, .12, .3 * gain)
        t += E8; i += 1
G0 = 9.8                     # the grid starts with the ride

# ---------------------------------------------------------------- A  0-3.95  the café, the tap, the beep
chime(cue['beep'], .62, 0, .55)
chime(cue['cut'] + .02, .55, -.2, .4, low=True)
# ---------------------------------------------------------------- B  3.95-9.8  the sheet, the title, the field
pad(4.0, 'E', 5.6, .26, .34)
for k, p in enumerate(['B4', 'E5', 'G#5', 'B5']): n(cue['title'] + k * .08, 'harp', p, 2.2, .45, -.3 + k * .2, .42)
n(cue['wake'], 'vibraphone_bowed', 'B5', 4.6, .38, -.2, .4, attack=1.2, release=1.2)
n(cue['wake'] + .6, 'vibraphone_bowed', 'E6', 4.0, .3, .3, .3, attack=1.4, release=1.2)
# ---------------------------------------------------------------- C  9.8-26.2  the outbound ride
ostinato(G0, 14.7, G0, .9)
ostinato(16.1, 26.0, G0, 1.0, kick=True)
pad(G0, 'E', 4.8, .22, .26); pad(G0 + 2 * BAR, 'A', 4.8, .22, .26); pad(G0 + 4 * BAR, 'E', 4.8, .24, .28)
n(14.75, 'vibraphone_bowed', 'G#4', 1.6, .4, 0, .4, attack=.2, release=.5)          # under the air gap
# the café's bank adds pizzicato violins; the network adds a woodblock pattern (J-cut, half a second early)
t = G0 + np.ceil((20.5 - G0) / E8) * E8
while t < 26.0:
    i = int(round((t - G0) / E8)); ch = chord_at(t, G0)
    if i % 2 == 1: n(t, 'violins_pizz', M(CH[ch][(i // 2) % 4]) + 12, .25, .42, .45, .3)
    t += E8
for k, tt in enumerate(np.arange(G0 + np.ceil((22.0 - G0) / BEAT) * BEAT, 26.0, BEAT)):
    n(float(tt), 'woodblock', None, None, .4 + .1 * (k % 2 == 0), -.3, .4)
for k, p in enumerate(['E5', 'G#5', 'B5', 'E6']): n(cue['callout'] + k * .07, 'harp', p, 2.0, .48, .25, .45)
# stops: a glockenspiel pluck per lit stop (E major, rising along the request)
SCALE = ['E5', 'F#5', 'G#5', 'A5', 'B5', 'C#6', 'D#6', 'E6']
stops = sorted([e for e in ev if e['type'] == 'stop' and 3.9 < e['t'] < 26 and e['id'] != 'CHIP'], key=lambda e: e['t'])
for k, e in enumerate(stops): n(e['t'], 'glockenspiel', SCALE[min(k, 7)], .9, .5, e['pan'], .5); n(e['t'], 'marimba', SCALE[min(k, 7)], .5, .45, e['pan'], .35)
# ---------------------------------------------------------------- D  26.2-34.5  the bank's four questions
pad(26.2, 'C#m', 2.4, .26, .3)
ISS = drops.get('ISS', 28.6)
n(ISS, 'bass_drum', None, None, .9, 0, .9); n(ISS, 'timpani', 'E3', 2.0, .85, 0, .8)
for p, pan in (('E3', -.2), ('B3', .2), ('G#4', 0)): n(ISS, 'horn', p, 1.4, .62, pan, .45, release=.6)
first_dep = {}
for e in ev:
    if e['type'] == 'depart' and e['line'] not in first_dep: first_dep[e['line']] = e
LAYERS = {'C1': ('glockenspiel', 24, -.6), 'C2': ('xylophone', 12, .6), 'C3': ('flute_stac', 12, -.3), 'C4': ('clarinet_stac', 0, .3)}
DEC = drops.get('DEC', 34.5)
for j, k in enumerate(['C1', 'C2', 'C3', 'C4']):
    if k not in first_dep: continue
    inst, oc, pan = LAYERS[k]; t0 = first_dep[k]['t']; pat = [[0, 2, 3], [1, 3, 2, 0], [2, 1, 3], [3, 1, 2, 0]][j]
    n(t0, 'glockenspiel', SCALE[2 + j], .6, .5, pan, .4)
    t = G0 + np.ceil((t0 + .15 - G0) / E8) * E8; i = 0
    while t < DEC - .3:
        if (i + j) % [2, 3, 2, 4][j] == 0:
            ch = chord_at(t, G0); n(t, inst, M(CH[ch][pat[i % len(pat)]]) + oc, .22 if 'stac' in inst else .5, .42, pan, .32)
        t += E8; i += 1
ostinato(28.6, DEC - .3, G0, .8, kick=True)
pad(ISS, 'A', 2.4 * 2.4, .24, .28)
n(DEC - .75, 'snare', 'roll', .75, .5, 0, .4)
n(DEC, 'bass_drum', None, None, 1.0, 0, 1.0); n(DEC, 'timpani', 'E3', 2.4, .95, 0, .9); n(DEC, 'crash', None, None, .5, .2, .4); n(DEC, 'gran_cassa', None, None, .6, 0, .5)
for p, pan in (('E3', -.25), ('B3', .25), ('G#4', 0), ('E4', -.1)): n(DEC, 'horn', p, 1.5, .7, pan, .48, release=.8)
n(DEC, 'violins', 'B5', 1.6, .5, -.3, .5, release=.8); n(DEC, 'cellos', 'E2', 1.6, .55, .3, .55, release=.8)
# ---------------------------------------------------------------- E  34.5-40.4  the race home, then silence
A0 = first_dep['A']['t'] if 'A' in first_dep else 36.3
ostinato(A0, 39.25, G0, 1.05, kick=True, snare=True)
n(A0, 'violins', 'E5', 3.0, .4, -.3, .42, attack=.2, release=.2); n(A0, 'violas', 'B4', 3.0, .38, .3, .4, attack=.2, release=.2)
for k, tt in enumerate(np.arange(G0 + np.ceil((A0 - G0) / E8) * E8, 39.25, E8)): n(float(tt), 'violins_spic', M(SCALE[k % 5]), .14, .45, -.2, .28)
n(38.65, 'snare', 'roll', .55, .45, 0, .35)
# ---------------------------------------------------------------- F  40.4-52.6  approved, the turn, settlement
AP = cue['approved']
chime(AP, .72, 0, .68); n(AP, 'tubular_bells', 'E5', 3.0, .5, 0, .45)
n(AP + .1, 'vibraphone_bowed', 'G#4', 3.2, .32, 0, .35, attack=.6, release=1.0)
# the turn: thin, minor, one low pulse per bar and a held cello
n(42.0, 'cellos', 'C#3', 3.0, .38, .1, .45, attack=.6, release=1.0); n(42.0, 'contrabass', 'C#2', 3.0, .34, 0, .4, attack=.6, release=1.0)
for tt in (42.0, 43.2): n(tt, 'contrabass_pizz', 'C#2', .5, .6, 0, .7)
# settlement: a slow walk down, a felt pulse, harp at the callout, resolution when the money lands
LAND = cue['land']
for k, (tt, p) in enumerate(zip(np.arange(45.3, LAND, BEAT), ['B2', 'A2', 'G#2', 'F#2', 'E2', 'D#2', 'C#2'] * 2)): n(float(tt), 'contrabass_pizz', p, .5, .55, 0, .7); n(float(tt), 'marimba', M(p) + 24, .3, .38, .3, .32)
pad(45.3, 'A', 4.1, .24, .3)
for k, p in enumerate(['C#5', 'E5', 'A5', 'C#6']): n(cue['days'] + k * .08, 'harp', p, 2.2, .46, .2, .42)
n(LAND, 'timpani', 'E3', 1.6, .6, 0, .5); chime(LAND + .05, .55, -.1, .5, low=True); pad(LAND, 'E', 3.0, .26, .32)
# ---------------------------------------------------------------- G  52.6-60.5  the whole map
ostinato(T0 := cue['rise'] + .2, DUR - 1.6, G0, .75, kick=False)
pad(cue['rise'], 'E', 2.4, .26, .32); pad(cue['rise'] + BAR, 'A', 2.4, .26, .32); pad(cue['rise'] + 2 * BAR, 'E', 3.3, .24, .3)
for k, p in enumerate(['E4', 'B4', 'E5', 'G#5', 'B5']): n(cue['endtitle'] + k * .08, 'harp', p, 3.0, .5, -.3 + k * .15, .45)
for p, pan in (('E3', -.25), ('B3', .25), ('G#4', 0)): n(cue['endtitle'] + .3, 'horn', p, 2.6, .4, pan, .32, attack=.2, release=1.2)
chime(57.6, .55, .1, .5)

music = S.render(mus, dur=DUR + 3, master=False)[:N]
def sweep_lp(x, a, b, lo=600):   # under the air gap the music is low-passed
    out = x.copy(); i0, i1 = int((a - .25) * SR), int((b + .25) * SR); blk = 1200
    for i in range(i0, i1, blk):
        tt = i / SR; d = min(1, max(0, (tt - (a - .25)) / .35)) * min(1, max(0, ((b + .25) - tt) / .35))
        fc = np.exp(np.log(12000) * (1 - d) + np.log(lo) * d); seg_ = x[max(0, i - 4000):i + blk]
        y = np.stack([lp(seg_[:, c], fc, 2) for c in range(2)], 1)[-(min(blk, len(x) - i)):]; out[i:i + len(y)] = y
    return out
music = sweep_lp(music, cue['dive'], cue['surface'])
g = np.ones(N, np.float32)
g[:int(cue['cut'] * SR)] = 0                                                  # no music in the café
a, b = int(39.2 * SR), int(39.45 * SR); g[a:b] = np.linspace(1, .03, b - a) ** 2; g[b:int(AP * SR)] = .03   # the silence before APPROVED
fade = np.ones(N, np.float32); f0 = N - int(1.2 * SR); fade[f0:] = np.linspace(1, 0, N - f0) ** 1.5
music *= (g * fade)[:, None]
music = S.room(music, size=.42, mix=.16)

# ---------------------------------------------------------------- sound effects
fx = np.zeros((N, 2), np.float32)
def pen(d):
    x = lp(hp(noise(d), 1100), 3800) * (1 + .25 * np.sin(2 * np.pi * 7 * t_(d)))
    e = np.minimum(1, t_(d) / .12) * np.minimum(1, np.maximum(0, d - t_(d)) / .15); return norm(x * e)
def falling(d):
    tt = t_(d); f = 1800 * np.exp(-tt * 3.2) + 180; ph = 2 * np.pi * np.cumsum(f) / SR
    return norm(np.sin(ph) * .25 * (tt / d) + lp(noise(d), 900) * (tt / d) ** 2)
def riser(d, f0=400, f1=6000):
    x = noise(d); out = np.zeros_like(x)
    for i in range(0, len(x), 480):
        hi = min(len(x), i + 480); f = f0 + (f1 - f0) * (i / len(x)) ** 2; out[i:hi] = bp(x[max(0, i - 2000):hi], f * .8, f * 1.25)[-(hi - i):]
    return norm(out * (t_(d) / d) ** 2)
def beep(d=.16, f=2700):
    tt = t_(d); return norm(np.sin(2 * np.pi * f * tt) * np.minimum(1, tt / .004) * np.minimum(1, (d - tt) / .02))
def shimmer(d):     # the reader's radio field: a high, trembling hiss
    x = bp(noise(d), 5500, 9500) * (1 + .6 * np.sin(2 * np.pi * 13.56 * t_(d)))   # 13.56 Hz tremolo: a nod to the 13.56 MHz carrier
    e = np.sin(np.pi * t_(d) / d) ** 2; return norm(x * e)
# café room tone: murmur and a far cup, under the opening and again under the end (L-cut)
room = lp(brown(DUR), 700); room = norm(hp(room, 90)) * .5 + norm(bp(noise(DUR), 300, 2400)) * .12
renv = np.zeros(N); renv[:int(4.6 * SR)] = 1; i0 = int(3.95 * SR); renv[i0:int(4.6 * SR)] = np.linspace(1, 0, int(4.6 * SR) - i0)
j0 = int(53.0 * SR); renv[j0:] = np.minimum(1, np.linspace(0, 3, N - j0)) * .6
add(fx, (room * renv).astype(np.float32), 0, .09)
for tt, p in ((.9, .3), (2.9, -.4), (55.5, .5), (58.4, -.3)): add(fx, click(3.2, .5), tt, .03, p)
# the tap, the four lights, the beep, the card leaving, the push into the light
add(fx, clack(1.6, 1), cue['tap'], .32, .1); add(fx, thump(1, 140), cue['tap'], .12, .1)
for k in range(4): add(fx, beep(.05, 1800 + 180 * k), cue['leds'] + .2 * k, .045, 0)
add(fx, beep(.2, 2700), cue['beep'], .2, 0)
add(fx, whoosh(.5), cue['cardout'], .14, .5)
add(fx, riser(.62, 300, 7000), cue['push'], .3, 0)
add(fx, whoosh(.6), cue['cut'] - .05, .12, 0)
add(fx, shimmer(5.4), cue['wake'], .1, -.2)
last = -1
for e in ev:
    t, ty, pan = e['t'], e['type'], e.get('pan', 0)
    if ty == 'depart' and e.get('t1', t) > t + .15: add(fx, pen(min(e['t1'] - t + .1, 6)), t, .05, pan)
    elif ty == 'stop' and e.get('vis') and t > 4.2:
        if t - last > .045: add(fx, click(1.1 + .4 * ((sum(map(ord, e['id'])) % 7) / 7), 1), t, .1, pan); last = t
    elif ty == 'x' and e.get('vis'): add(fx, pop(1), t, .08, pan); add(fx, thump(1, 95), t, .12, pan)
    elif ty == 'drop': add(fx, falling(.42), t - .42, .3, .1); add(fx, thump(1, 58), t, .6, 0); add(fx, pop(1), t, .25, 0); add(fx, crash(.6), t, .1, .1)
# under the air gap: a filtered radio hiss instead of water
add(fx, whoosh(.5), cue['dive'] - .1, .2, -.2)
ag = bp(noise(1.4), 1500, 4200) * np.sin(np.linspace(0, np.pi, int(1.4 * SR))); add(fx, norm(ag), cue['dive'] + .05, .06, 0)
add(fx, pop(1), cue['surface'], .16, .3)
add(fx, whoosh(1.0), cue['glide'] - .05, .16, 0); add(fx, click(.7, 1), cue['callout'], .12, .3)
add(fx, whoosh(1.0), cue['issuer'] - .05, .2, .2)
for k, tt in enumerate(np.arange(A0, 39.2, .15)): add(fx, clack(1.0 + .1 * (k % 3), .7), float(tt), .05, -.6 + .9 * (tt - A0) / (39.2 - A0))   # the race: rail clacks R->L
add(fx, pop(1), cue['terminus'], .18, 0); add(fx, thump(1, 80), cue['terminus'], .14, 0)
add(fx, click(.6, 1), AP - .02, .1, 0)
add(fx, click(.9, 1), cue['counter'], .12, -.7)
add(fx, whoosh(1.3), cue['glide2'] - .05, .26, 0)
rum = norm(lp(brown(LAND - cue['spin'] + .6), 140)) * np.sin(np.linspace(0, np.pi, int(round((LAND - cue['spin'] + .6) * SR)))); add(fx, rum, cue['spin'], .14, 0)
tt = cue['spin']                          # the counter's drums spin: ratchet ticks that speed up, then slow into the landing
while tt < LAND:
    rem = LAND - tt; add(fx, click(2.3, .55), tt, .035, -.7); tt += .035 if rem > 1.2 else .035 + .12 * (1.2 - rem)
add(fx, clack(.8, 1), LAND, .2, -.7); add(fx, thump(1, 70), LAND, .25, -.4)
add(fx, click(.7, 1), cue['days'], .1, .2)
add(fx, whoosh(1.6), cue['rise'] - .05, .28, 0)
add(fx, pen(.6), cue['endtitle'], .05, .3)
for k, tt in enumerate(np.arange(cue['trains'], DUR - .6, .3)):     # trains on the finished map: ta-tak pairs, far and soft
    v = .03 * min(1, (tt - cue['trains']) / .8) * min(1, (DUR - .6 - tt) / 1.5); add(fx, clack(1.0 + .1 * (k % 3), .6), float(tt), v, [-.6, .4, -.2, .7][k % 4])

# ---------------------------------------------------------------- voice: compressed, peaks limited, placed from script.json
vo = np.zeros(N, np.float32); vmask = np.zeros(N, np.float32)
for l in SCRIPT['lines']:
    x, sr = sf.read(os.path.join(HERE, 'voice', 'out', l['id'] + '.wav'), dtype='float32')
    if x.ndim > 1: x = x.mean(1)
    x = soxr.resample(x, sr, SR).astype(np.float32); x = hp(x, 80).astype(np.float32)
    i = int(l['t'] * SR); j = min(N, i + len(x)); vo[i:j] += x[:j - i]; vmask[i:j] = 1
vo = compress(vo, thr=.12, ratio=3.5, att=.003, rel=.12); vo = limit(vo, .5)
# duck the music ~5 dB under the voice with a smoothed envelope
k = int(.12 * SR); env = np.convolve(vmask, np.ones(k) / k, 'same'); duck = 1 - .44 * np.clip(env, 0, 1)
music *= duck[:, None]
# balance: voice RMS about 10 dB over the music RMS where the voice speaks
on = vmask > 0
rv = np.sqrt(np.mean(vo[on] ** 2)); rm = np.sqrt(np.mean(music[on] ** 2)) + 1e-9
vg = (rm * 10 ** (10 / 20)) / rv
voice = np.stack([vo * vg, vo * vg], 1)

# ---------------------------------------------------------------- mix and loudness
mix = music * .9 + fx + voice
mix = np.stack([hp(mix[:, c], 38, 4) for c in range(2)], 1)
mix = mix - .45 * np.stack([lp(mix[:, c], 75, 2) for c in range(2)], 1)
mix = np.stack([limit(mix[:, 0], .9), limit(mix[:, 1], .9)], 1)
def lufs_tp(x):
    with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as f: tmp = f.name
    sf.write(tmp, x.astype(np.float32), SR, subtype='FLOAT')
    out = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', tmp, '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True).stderr
    os.remove(tmp)
    return float(re.findall(r'I:\s+(-?[\d.]+) LUFS', out)[-1]), float(re.findall(r'Peak:\s+(-?[\d.]+) dBFS', out)[-1])
mix = np.stack([compress(mix[:, c], thr=.18, ratio=2.6, att=.008, rel=.18) for c in range(2)], 1)
ceil = 10 ** (-3.4 / 20)
for _ in range(9):
    I, P = lufs_tp(mix); mix *= 10 ** ((-16.0 - I) / 20)
    for c in range(2): mix[:, c] = limit(mix[:, c], ceil * .78)
    tp = np.abs(soxr.resample(mix, SR, SR * 4)).max()
    if tp > ceil: mix *= ceil / tp
I, P = lufs_tp(mix)
assert mix.shape[0] == N
sf.write(os.path.join(HERE, 'mix.wav'), mix.astype(np.float32), SR, subtype='PCM_24')
print('mix.wav', round(N / SR, 2), 's ·', I, 'LUFS ·', P, 'dBTP · voice gain', round(float(vg), 2))
print('instruments:', ', '.join(sorted(used)))
with open(os.path.join(HERE, 'out', 'instruments.txt'), 'w') as f:
    for l in S.credits(sorted(used)): f.write(l + '\n')
