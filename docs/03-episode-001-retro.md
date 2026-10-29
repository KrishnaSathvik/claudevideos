# 03 · Episode 001 retro: *The Tap Line* (rejected)

Folder: `../episodes/001-card-tap/` · 60.5 s · 1920×1080 · 30 fps · Lemo-Opuscar Transit Map style.

## What we built

A contactless card payment drawn as a printed metro map: a card taps a café reader → its light becomes the first station
→ a red "request" line tunnels under an "air gap" (< 4 cm) → terminal, the café's bank (acquirer), card network
(callout: Visa's published capacity 65,000+ messages/s), your bank (issuer) → four check lines (code real? card open?
money or credit? fraud risk?) fall into a Decision → a green "answer" line races home → silence → APPROVED → counter
"MONEY MOVED $0.00" → a purple settlement line days later → $4.75 → full map, "One tap. Two journeys."

Engineering was solid: deterministic render, readcheck 48/48, −13.9 LUFS master, no black frames, every claim in
`FACTS.json` (status `search-quoted`, **not yet human-verified**), one-command `build.sh`, pinned versions.

## Owner verdict

"Bad design; doesn't look like what's on YouTube/TikTok/X/Insta." Agreed. Why:

1. **16:9** — on a phone it is a thin strip; labels unreadable.
2. **No hook** — opens calmly; nothing in frame 1 asks a question; fails the muted 3-second test.
3. **Too slow** — long gentle camera moves, 60 s; feeds want a visual change every 2–3 s and 30–45 s.
4. **Wrong captions** — small boxed sentences at the bottom (inside the platform UI dead zone) instead of big
   word-by-word captions centre-low.
5. **Wrong aesthetic for the feed** — pale paper, tiny print, low contrast; reads as a museum piece.
6. **Generic voice** — flat Kokoro TTS.
7. **Process error** — we chose topic and a library style first ("animated diagram"), instead of starting from
   reference videos the owner loves and directing a film.

## Keep

- The story's twist: *approval is a promise; no money moves until settlement*.
- The sourced FACTS and the fact-checking discipline.
- Technique: deterministic frame rendering, timeline-driven SFX, loudness pipeline, safe readcheck.
- Facts checked and not used: no source for "1.3 s end-to-end"; decline codes 51 / 59 / 05 saved for a
  "why your card gets declined" Short.

## Environment lessons (cloud sandbox)

ffmpeg 6.1 too old (used a static 7.0.2 from the `imageio-ffmpeg` wheel); raw.githubusercontent, huggingface.co,
sec.gov, visa.com blocked (Whisper check and Piper voices impossible); software WebGL only (~1 frame/s/worker).
