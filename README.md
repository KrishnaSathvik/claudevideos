# Invisible Systems (working title)

Explainer films that make invisible systems physically visible, directed and built entirely in code on top of the
[Lemo-Opuscar](https://github.com/lemomo-ai/lemo-opuscar) film-style library. No video generation, no stock footage.

## Episodes

| # | Film | Style | Status |
|---|---|---|---|
| 001 | [What Happens After You Tap Your Card?](episodes/001-card-tap/) (*The Tap Line*, 60 s) | Transit Map | prototype: facts need human verification, temporary TTS voice |

## Layout

```
LEMO_PIN.md                 exact library commit and tool versions every episode is built against
episodes/<nnn-slug>/
  FACTS.md, FACTS.json      every claim: value, source, quoted wording, verification status
  TREATMENT.md              structure, shot list, beat sheet, cue map, sound design
  script.json               narration lines and where they sit; subtitles come from it
  voice/lines.json          the TTS script (numbers spelled out)
  net.js, timeline.js       the film: map data and direction (Transit Map engine: film.js, gl.js, unmodified)
  audio.py                  score, effects, voice mix
  build.sh                  one command: voice, events, mix, picture, master, checks, subtitles, poster
  <name>.mp4, .srt, poster.jpg
```

## Rules

- Every fact on screen or in the narration is in `FACTS.json` with a source; nothing is published while any entry is `verified: false`.
- No brand logos or marks. Real names only as source credits.
- The Lemo library is pinned (`LEMO_PIN.md`); upgrade deliberately.
