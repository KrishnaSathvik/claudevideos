# TREATMENT: The Tap Line

**Episode 001 · What Happens After You Tap Your Card?** · Style: Transit Map (Lemo-Opuscar) · 1920×1080, 30 fps (set by the style), English, about 60 s.

## 0. Brief (decided without a question round)

- Topic: the authorization trip one contactless payment makes, and the turn that no money moves until settlement.
- Audience: non-technical viewers. Jargon is printed small; plain words come first.
- Voice: Kokoro (`am_michael`, a calm male documentary read), a **temporary** narrator. Music, sound effects and subtitles are made in code.
- No brands: "card network", "your bank", "the shop's bank". The only name on screen is the source credit on the capacity callout (FACTS F9).
- Every fact is in `FACTS.md` / `FACTS.json`. The payment is a fictional $4.75 coffee.
- **Deviation from the style, on purpose:** Transit Map prints every label in two languages. Here the second (grey) line is a plain-English gloss of the jargon above it ("ACQUIRER" / "the shop's bank"). Same type hierarchy, one language.

## 1. Three candidate structures

1. **One line built stop by stop.** A single red line from card to bank, ending on its terminus. Clean, but it shows only half the story (nothing comes back) and fails the style's "full enough to be a map" floor.
2. **Two rival networks.** Card vs. cash drawn side by side and compared. Off-topic; the question is what happens to *your* tap.
3. **There and back, then the hidden third line (chosen).** The red request line goes out; four short check lines branch inside the bank and fall together into one decision; a green answer line races home on a parallel track; "Approved". Then the turn: the counter still reads **$0.00 moved**. A thin dashed line, settlement, runs below the map days later and the counter finally rolls to $4.75. The film ends on the finished map: two journeys, one tap.

Why 3: it has a turn (approval ≠ payment) that most viewers don't know, it uses the style's native moves for real reasons (parallel corridor = request/response; falling interchange = decision; tunnel = "below the surface"), and it fills the map with 8 lines.

## 2. Logline and arc

*You tap, it beeps, it's approved. In those seconds your purchase crossed four places and four questions, and still no money moved.*

- Setup: the tap and the beep (0–5 s); the chip wakes across the air gap.
- Development: the outbound ride, network routing, the bank's four questions.
- Turn: "Approved", then a held silence and the counter: **$0.00 moved.**
- Ending: settlement, the slow second journey, then the full map: "One tap. Two journeys."

## 3. Benchmark

- **Learn from:** good public-information explainers that follow one object through a system (the "life of a letter" postal films): one hero object, a clear direction of travel, the scale revealed at the end. Also printed route maps' calm: no motion without meaning.
- **Don't take:** any layout, icon set, typeface, bullet design or music; no real network map layout; no brand marks.

## 4. The map (data)

Grid step G. The sheet is a metaphor map with five printed regions (bands of tinted paper with a printed region name): **YOUR POCKET · THE SHOP · THE SHOP'S BANK · CARD NETWORK · YOUR BANK**, left to right. One water body: the **AIR GAP** (a narrow blue strait between pocket and shop, "under 4 cm"). The request tunnels under it, dashed.

Lines (7; a planned navy "declines" line was cut in production because its labels could not be held long enough to read):

| Line | Colour | Mode | Route | Meaning |
|---|---|---|---|---|
| R Request | red (accent) | metro | Chip → One-time code → (air-gap tunnel) → Terminal → Amount → Acquirer → Gateway → Network switch → Card-number lookup → Issuer | the authorization request |
| A Answer | green | metro, parallel to R (±0.10 G) | Issuer → … → Terminal → APPROVED terminus | the response |
| C1 Code check | yellow | light | Issuer → "Is the code real?" → Decision | cryptogram |
| C2 Card status | lilac | light | Issuer → "Is the card open?" → Decision | lost/stolen/closed |
| C3 Funds | aqua | light | Issuer → "Money or credit?" → Decision | balance / limit |
| C4 Fraud | orange | light | Issuer → "Looks like fraud?" → Decision | risk score |
| S Settlement | purple | metro, dashed, underground (tunnel casing) along the bottom | Issuer → Clearing → Network settles → Shop's bank → Shop paid | the money, days later |

Named stations ≥ 22; interchanges: Terminal (R, A), Acquirer (R, A), Network switch (R, A), Issuer (R, A, C1–C4, S), Decision (C1–C4, D, A), Shop's bank (S). Dated states: tap (0 s) → approved (within seconds) → settled (1–3 business days), on the counter.

## 5. Shot list

| # | Time | Framing / angle | Camera move | Why |
|---|---|---|---|---|
| 1 | 0–3.95 | screen-space close-up: a café card reader; the card taps a glowing round tap zone, four lights, the beep, APPROVED on the screen | slow push in, then a fast push into the light | the hook: the thing everyone has seen |
| 2 | 3.95–5.3 | match cut: the white of the tap zone collapses into the red "Chip" station dot, macro | tilt 24°, 260 px/G, pulling back | the light becomes a station (the style's opening) |
| 3 | 5.0–10.5 | medium: cartouche + first stops | glide across the sheet to the cartouche, then back to the pen tip | title printed on the map, held ≥ 4 s |
| 4 | 10.5–14.5 | low, close: the line dives under the AIR GAP, dashed | drop low (tilt 60°, aperture 26) | the threshold: card to terminal |
| 5 | 14.5–25.5 | medium-close, tilted | ride the red pen tip, aim 1.5 G ahead; interchanges fall at the acquirer and the network | building, one hop at a time |
| 6 | 25.5–35.5 | medium-wide, locked-ish | four tips leave the Issuer at once; the camera pulls back slightly so all four fit; the Decision capsule falls | four questions at once |
| 7 | 35.5–40.5 | wide, tilt 25° | fast follow of the green tip home; low oblique sweep at the Terminal | the race back |
| 8 | 40.5–44.0 | locked top view on APPROVED terminus; then a paper veil | lock, near-silence | the verdict, held |
| 9 | 44.0–52.0 | medium-wide | glide down the sheet to the bottom band; the dashed purple settlement line draws slowly; the counter rolls $0.00 → $4.75 | the hidden second journey |
| 10 | 52.0–60.0 | full network, then the sheet edge and table | rise until the table shows; end title printed in the margin | the whole, and the echo |

Camera moves used: push, match cut, glide, drop low, ride, pull-back, sweep, lock, rise (≥ 4).

## 6. Beat sheet (target; final timings follow the voice)

| t (s) | Picture | Voice |
|---|---|---|
| 0.4 | close-up symbol, tap ripple | "You tap your card." |
| 1.9 | BEEP | (sfx) |
| 2.4 | — | "Approved." |
| 3.0 | match cut to the chip station | — |
| 4.2 | cartouche title | "In those few seconds, your purchase took a trip." |
| 7.6 | pen tip starts | "The terminal's radio field wakes the chip, from less than four centimetres away." |
| 11.8 | tunnel under the air gap | "It signs this one purchase with a one-time code, so a copy is useless." |
| 16.4 | acquirer interchange falls | "The request rides to the shop's bank…" |
| 19.2 | network switch falls; capacity callout | "…then across the card network, which reads your card number to find your bank." |
| 25.0 | four tips leave the Issuer | "Your bank asks four questions at once. Is the code real? Is the card open? Is there money, or credit? Does this look like fraud?" |
| 34.0 | Decision falls; declines line flickers on | "Four yeses." |
| 35.5 | green tip races back | "The answer races home." |
| 40.0 | silence (0.8 s) → APPROVED terminus ring | "Approved." |
| 43.0 | counter: $0.00 moved, held | "And yet, not one cent has moved." |
| 46.0 | settlement line draws | "Approval is only a promise. The money follows later, in settlement, usually one to three business days." |
| 53.5 | full map, rise | "One tap. Two journeys." |
| ~60 | end title held | — |

## 7. Cue map

- Tempo **100 BPM** (0.6 s / beat), 4/4, bar 2.4 s, written in film time. The grid starts at 0.4 s on the first tap.
- **Motif:** a two-note station chime (vibraphone, E5 → B4). It is the "beep" at 1.9 s, returns at APPROVED (40.x s), and closes the film.
- Sections:
  - A (0–5): sub pulse, the tap, then the chime.
  - B (5–14.5): marimba ostinato in eighths, glockenspiel pluck per stop.
  - C (14.5–25.5): each line adds a voice. R adds marimba; the acquirer adds pizzicato (pluck model); the network adds a woodblock pattern.
  - D (25.5–35.5): four check lines, four glock arpeggio voices (one per line, panned), building; the Decision fall is a descending whistle, a low thump and the full chord.
  - E (35.5–40): driving eighths, then everything cut at ~39.2 s (near-silence 0.8 s).
  - F (40–52): the chime, then a soft pad; one low pulse per bar, ratchet ticks on the counter, a filtered "underground" rumble under the settlement line.
  - G (52–60): pad + chime + the marimba ostinato, thinning out to the last chime.
- Every stop lands on an eighth; interchange falls land on beat 1.

## 8. Sound design table

| Section | Ambience | Foley | Music |
|---|---|---|---|
| A Hook | quiet café room tone (filtered noise) | card tap (soft plastic click), reader beep = chime | sub pulse |
| B Chip / air gap | room tone | felt-tip glide under the pen tip, NFC "shimmer" (high filtered noise) at the air gap, submerged mix in the tunnel | marimba ostinato |
| C Outbound | room tone low | felt-tip glide, plucks per stop, whistle + thump per falling interchange | + layers |
| D Checks | — | four glides panned L/R, plucks, the big fall | arpeggios |
| E Return | — | fast glide, rail clacks | driving, then silence |
| F Turn / settlement | near-silence, then a low rumble | ratchet ticks on the counter, slow glide | chime, pad |
| G Ending | room tone returns (L-cut from the hook) | — | thin out, chime |

J/L cuts: the café room tone from shot 1 leaks under the map open (L-cut) and returns at the end; the network's woodblock pattern starts 0.5 s before the switch appears (J-cut).

## 9. Type and subtitles

- Map type: Inter (OFL), self-hosted. Station label: the jargon in ink (0.20 G semibold), and the plain gloss in warm grey below.
- Cartouche (bottom-left of the sheet): **THE TAP LINE** / "A map of one card payment · simplified · not to scale".
- Counter plate (top-left): two rows: **HOPS** (0 → 8 → 16) and **MONEY MOVED** ($0.00 → $4.75).
- Subtitles: burned in, centred low, Inter 34 px on a soft paper-coloured band, ≤ 2 lines; exported as `.srt`.
- End title printed on the sheet margin: **One tap. Two journeys.**

## 10. Production notes (what changed from this plan)

- Final timings follow the voice (`script.json`): the race home ends at 39.6 s, near-silence 39.45–40.4 s, APPROVED at 40.4 s, money lands at 49.4 s, end title 53.2 s, total 60.5 s.
- Interchanges are capsules only when the second line arrives, so the acquirer and the network become interchanges on the way *back* (the answer line), with small pops; the issuer (28.6 s) and the decision (34.5 s) fall.
- The declines line was cut (see Lines). The terminal's opening uses a plain glowing ring, not the real contactless symbol (a trademark).
- Station names are shown per shot (held shots only) so every printed word passes `readcheck.mjs` (48/48).

## 11. Not the demo again (DIRECTOR.md §11)

Compared with the Transit Map demo (*6 Kilometres*): structure (there-and-back plus a hidden third journey, vs a network growing by years): different. Opening (a card reader close-up whose light becomes the first stop, vs a tunnel headlight): same device (a match cut to a red dot), different image. Signature shot (four check lines fanning out and falling into one decision): different. Camera path: different. Score shape (tap/chime motif, silence before the verdict, a minor turn, resolution on settlement): different. Ending (rise to the whole map with the end title in the margin, vs the first section under a veil and an end card): different. 5 of 6 differ.
