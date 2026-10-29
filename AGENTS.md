# AGENTS.md: instructions for any coding agent working in this repo

Read this first, then `docs/README.md`. This repo is the planning and production home for a short-form / YouTube
video channel made with AI coding agents (Claude Code). Work is continuing **on the owner's Mac** (macOS, Claude Code
CLI). The earlier work was done in a restricted cloud sandbox; see `docs/04-openmontage-assessment.md` for why the Mac
is the production machine.

## Where we are (2026-10-29)

1. We explored **Lemo-Opuscar** (code-rendered film styles) and made Episode 001, *The Tap Line*, in its Transit Map
   style. **The owner rejected it**: it looked like a calm 16:9 diagram, not like what performs on TikTok, Shorts,
   Reels or X. It stays in `episodes/001-card-tap/` as an archived prototype and a lesson (`docs/03-episode-001-retro.md`).
2. We researched what works in short-form now (`docs/02-short-form-research.md`).
3. We assessed **OpenMontage** as the primary production framework (`docs/04-openmontage-assessment.md`).
4. **Next step: reference-driven direction.** The owner will provide 2–3 YouTube Shorts / TikToks / X videos they love.
   Nothing gets produced before those are analysed (`docs/05-next-steps.md`).

The topic is **not locked**. "Invisible Systems" (how everyday systems work) is one candidate, not a decision.

## Hard rules

- **Reference first, tool second.** Never start from "make a video about X in style Y". Analyse the owner's reference
  videos, write a design read, then pick tools that can reach that look.
- **No full production before visual approval.** Order: references → direction → 4–6 style frames → one 8–12 s motion
  test (real motion, sound, captions, 9:16) → owner approval → full film.
- **No paid API spend without explicit approval** (video/image generation, premium TTS, music). Give a cost estimate first.
- **No silent substitutions.** Never replace motion footage with animated stills, swap providers, or swap renderers
  without telling the owner and getting approval.
- **Inspect before presenting.** Look at the actual rendered frames, check audio levels and safe zones. Report defects
  and limitations honestly; never present a render you haven't checked.
- **Facts are sourced.** Any factual claim on screen or in narration goes in the episode's `FACTS.json` with a source
  URL and quoted wording; `verified: false` until a human opened the source. No publishing with unverified facts.
- **No brand logos or marks** unless the owner has the right to use them.
- **Hero work is bespoke** (OpenMontage "atelier" mode). Avoid animated-PowerPoint looks: stock text cards, repeated
  layouts, decorative particles, generic AI-purple gradients, fake cinematic moves.
- **Licences:** OpenMontage is AGPL-3.0. Use it as a tool from its own clone; do not copy its code into this repo.
  Lemo-Opuscar code is MIT, its demo films CC BY 4.0.
- Commits: only when the owner asks. Don't commit renders over ~50 MB; keep sources and a one-command build.

## Short-form defaults (until a reference says otherwise)

9:16 1080×1920 · 20–45 s · hook in the first 1–1.5 s (text on frame 1, voice starts immediately) · visual change every
2–3 s · key content inside a centred ~900×1300 box (avoid top ~250 px, bottom ~600 px, right ~140 px) · word-by-word
captions, bold, 80–110 px, centre-low, one highlight colour, no box · SFX on every transition · −14 LUFS master ·
voice ~170–190 wpm, energetic; a human or premium voice beats flat TTS. Details and sources: `docs/02-short-form-research.md`.

## Layout

```
AGENTS.md / CLAUDE.md     this file
README.md                 repo overview
LEMO_PIN.md               pinned Lemo-Opuscar commit + tool versions used for Episode 001
docs/                     everything we decided and learned (start at docs/README.md)
episodes/<nnn-slug>/      one folder per film: FACTS, TREATMENT, script, source, build.sh, final render
references/               (to create) owner's reference videos and their analyses
```

## Mac setup (one time)

```sh
brew install node ffmpeg python@3.12 yt-dlp
# OpenMontage, as a sibling folder (AGPL; keep it out of this repo)
git clone https://github.com/calesthio/OpenMontage.git ~/OpenMontage && cd ~/OpenMontage && make setup
.venv/bin/python -c "from tools.tool_registry import registry; import json; registry.discover(); print(json.dumps(registry.provider_menu_summary(), indent=2))"
npx hyperframes doctor
# Optional: Blender for 3D (Eevee runs on Apple silicon): brew install --cask blender
```

Report the preflight result to the owner as passed / degraded / blocked before any creative work.
Lemo-Opuscar (only to rebuild Episode 001): see `LEMO_PIN.md`.
