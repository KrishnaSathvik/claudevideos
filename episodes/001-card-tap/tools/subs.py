"""Subtitle cues from script.json + voice/out/dur.json, with the same rule as timeline.js (SUBS):
start at the line, hold >= max(1.8 s, speech + 0.6 s), never past the next line. Writes out/cues.json for core/render/srt.py."""
import json, os, sys
HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
S = json.load(open(os.path.join(HERE, 'script.json'))); D = json.load(open(os.path.join(HERE, 'voice', 'out', 'dur.json')))
L = S['lines']; out = []
for i, l in enumerate(L):
    nxt = L[i + 1]['t'] - .08 if i + 1 < len(L) else S['dur'] - .2
    out.append({'t0': l['t'], 't1': round(min(nxt, max(l['t'] + 1.8, l['t'] + D[l['id']] + .6)), 3), 'text': l['sub']})
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
json.dump(out, open(os.path.join(HERE, 'out', 'cues.json'), 'w'), indent=1, ensure_ascii=False)
print(len(out), 'cues')
