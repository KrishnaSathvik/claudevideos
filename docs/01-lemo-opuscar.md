# 01 · Lemo-Opuscar (explored 2026-10-29)

Repo: https://github.com/lemomo-ai/lemo-opuscar · pinned commit `f17136060781a0068a7951245a3aa7835a7230de`
(see `../LEMO_PIN.md`). Code MIT; demo films CC BY 4.0. Tuned for Claude Opus 5.5.

## What it is

A library of 66 film styles. Each style has a `STYLE.md` (fixed rules: look, materials, colour logic, type, motion,
camera grammar, sound palette, native moves, pitfalls), a `DEMO.md` and one demo film made entirely in code: canvas /
WebGL pages rendered frame by frame in headless Chrome, original scores from free sample libraries, TTS narration.
No video generation, no stock footage.

## Architecture

```
AGENTS.md      routing: start, finding the style, workflow
DIRECTOR.md    directing: brief, benchmark, story, treatment, look, sound, rhythm, camera, performance, checks, delivery
TECHNIQUE.md   building: page contract, timeline, voice, music, mix, subtitles, review loop, 3D
MY-STYLES.md   making your own style (saved in ~/lemo-my-styles/<name>/)
styles/<slug>/ STYLE.md, DEMO.md, style.json, demo/
core/          render/ (still, video, events, readcheck, mux, sheet, srt), tts/ (Kokoro, edge-tts, Whisper check),
               audio/ (sampler, pluck, sfx), three/post.js, post/crt.js, lib.js
plugin/        Claude Code skill + setup.sh
```

Page contract: `index.html` exposes `window.DUR`, deterministic `window.render(t)`, `window.READY`, optional `window.EV`
(sound cues) and `window.TEXTS(t)` (for the reading-time check). `video.mjs` renders frames with parallel headless
Chrome workers into ffmpeg; `mux.sh` masters to −14 LUFS. One timeline drives picture, score, SFX and subtitles.

## Styles (11 categories)

Edit & Documentary (8), Evidence Films (8), Hand-drawn & Painting (8), East Asian Traditions (4), Print & Printmaking (6),
Graphic & Type (7), Information & Keynote (8, incl. Transit Map, Isometric Picture Book, Circuit Board), Cartoon & Anime (4),
Games (4), Cinema & Eras (2), Materials & 3D (7). Full list: `styles/README.md` in the library. Gallery:
https://lemomo-ai.github.io/lemo-opuscar/

## Install

- Skill: `claude plugin marketplace add lemomo-ai/lemo-opuscar` then `claude plugin install lemo-opuscar@lemolab`
  (library goes to `~/lemo-opuscar`), or clone the repo and run `claude` inside it.
- Needs Node 20+, **ffmpeg 7+** (6.x breaks loudness measurement in `mux.sh`), Python 3.11+ or uv.
- Tiers: `setup.sh deps` (core ~350 MB), `deps voice` (Kokoro + edge-tts + faster-whisper), `deps music`;
  `tools/fetch.sh instruments <lib>` for sample packs.

## Workflow (6 steps)

Brief (one round of questions) → `TREATMENT.md` (3 candidate structures, shot list, beat sheet, cue map, sound table)
before opening the demo → look (style frames with real code) → optional storyboard stop → produce (voice → check →
score → animation → mix → render) → self-check (contact sheets, readcheck, loudness, "not the demo again") and deliver.
A film takes an agent ~30–60 min.

## Verdict after Episode 001

Excellent engineering (deterministic rendering, audio pipeline, checks). But its styles are art-directed **landscape
films**, calm and crafted; they do not by themselves produce what performs in vertical short-form feeds. Useful as a
technique library (rendering, sampler, SFX, mixing), not as the creative starting point.
