# 02 · What works in short-form now (research, 2026-10-29)

Sources were read from web-search excerpts (page fetches were blocked in the sandbox); most are vendor or creator blogs,
so numbers are directional. OpenMontage's own `skills/creative/short-form.md` gives similar figures.

## Format

- **9:16, 1080×1920** shared canvas on TikTok, Reels, Shorts; X autoplays muted and supports 1080×1920.
  (wildandfreetools.com vertical safe zones 2026; heyorca.com X specs 2026)
- **Safe zones** (third-party): TikTok ~880×1220 (insets 220 top / 480 bottom / 60 left / 140 right); Reels ~895×980
  (270 / 670 / 65 / 120); universal box ~900×1400 centred. (reap.video; adaptlypost.com; remotion.dev social-safe-zones)
  OpenMontage lists bottom dead zones of ~300–320 px. Always check in TikTok drafts / Shorts preview.
- **Length:** 20–45 s for explainers (Zack D. Films commissions 20–45 s clips; zackdfilms.recruitee.com). One vendor:
  completion ~42 % at 31–60 s vs ~29–31 % above 60 s (insights.ttsvibes.com).
- **Upload:** H.264 High, 8–15 Mbps, −14 LUFS, true peak −1 dBTP.

## Hook

- Swipe decisions in ~1–2 s; target 70–85 % retention at 3 s (opus.pro Shorts hook formulas / retention).
- Frame 1 must move and carry text; voice starts immediately; show the result first, then explain
  (dev.to "hook engineering 2026"). Many viewers start muted (one claim: 68 % TikTok, 54 % Reels).

## Visual language

- **Captions:** word-by-word, 1–3 words, bold caps, one highlighted word, is the 2026 default (blitzcutai.com). The
  emoji / flashing "Hormozi" look is tiring; keep the mechanics, drop the gimmicks (joyspace.ai 2026 analysis).
- **Pacing:** a visual change every 2–3 s (fluxnote.io; aibrify.com); below ~1.2 s reads as noise; zoom/pan anything
  held > 4 s; vary SFX pattern interrupts (gofaceless.ai). One source (fliki.ai) argues 5–7 s: evidence conflicts.
- **Look:** high contrast, big type (headlines 64–120 px, body 28–42 px on 1080 wide), 8–10 elements per scene,
  2+ focal points, never flat empty frames (OpenMontage `video-composition.md`).
- **Sound:** whoosh/tick on transitions, hits on reveals, low music bed ducked under voice.

## Reference channels

- **Zack D. Films**: ~29.3M subs, ~81B views, 100 % Shorts, fast 3D educational (vidiq.com; outlierkit.com); 3D
  mostly outsourced to contract animators.
- **ByteByteGo**: animated system diagrams with dots travelling along edges; After Effects (dev.to).
- **Jared Owen**: 3D mechanism explainers.
- "Tap to pay" explainers found had near-zero views: little incumbent competition.

## The Claude/Opus motion-graphics wave

- Took off after Opus 5.5 (22 Sep 2026): Opus writes code that renders frames (Remotion, HyperFrames/GSAP, Three.js).
  (aiidelist.com; dsebastien.net)
- Reported big posts: a one-line showreel prompt ~2M views, a motion portfolio ~1.9M, a "Claude Pop" music-video remake
  ~3.9M (ayautomate.com; ai-bot.cn; officechai.com). Genre: launch films, kinetic type, UI loops, not explainers.
- Fatigue: "AI sameness" in hooks, voices, templates, end cards (reelnreel.com; autoae.online; recapio.com).

## Voice and policy

- YouTube "inauthentic content" policy (15 Jul 2025) targets mass-produced templated videos; AI/synthetic voice alone
  is not disqualifying (techcrunch.com; creatorhandbook.net). A July 2026 report of stricter enforcement is unverified.
- TTS evidence is mixed: vendors claim ~5 % difference once hooks are controlled; a 21.5K-video panel (second-hand)
  found AI voice linked to ~5 % fewer likes and comments and ~7 % fewer shares (kineclip.com; blitzcutai.com).
- Voice pace for shorts: ~170–200 wpm, energetic.

## Recipe (inference)

9:16, 30–45 s · huge kinetic hook frame + bold question in 0–1.5 s · one beat per 2–3 s with whip-pans / zoom punches ·
dark high-contrast or bold flat / 3D look with one accent · word-by-word captions 80–110 px centre-low in the safe zone ·
SFX on every cut · energetic voice · payoff by ~25 s · loop the ending into the start · a bespoke recurring motif and real
numbers to avoid the generic look.
