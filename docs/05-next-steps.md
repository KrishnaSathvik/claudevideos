# 05 · Next steps (continue on the Mac)

Do **not** generate another film yet. The order is fixed:

## 0. Setup and preflight

Follow "Mac setup" in `../AGENTS.md`. Run OpenMontage's `provider_menu_summary()` and `npx hyperframes doctor`.
Tell the owner, in plain words: what works today, what needs an API key (and its cost), what needs a GPU, what is untested.

## 1. References (owner)

The owner sends 2–3 YouTube Shorts / TikToks / X videos that made them think "I want to make videos like this".
Save links and notes in `references/<nn-slug>/README.md`.

## 2. Reference analysis (agent)

Per reference, follow OpenMontage `skills/meta/video-reference-analyst.md`: download, transcript, scene detect, keyframes;
then write `references/<nn-slug>/ANALYSIS.md` with Content / Style / Structure / Motion, the 5-aspect breakdown per shot,
the hook (first 3 s, second by second), cut rhythm, captions, sound, and **how it was likely made** (code / 3D / AI video /
real footage), using the `motion_type` classification, never a guess.

## 3. Direction (agent → owner approval)

`taste_profile`: design read, the three dials, palette, anti-patterns. 2–3 original concepts (topic is open: Invisible
Systems is one candidate) with a recommended one, the production route (atelier HyperFrames/Remotion, Blender, or AI
video), and a cost estimate for anything paid. Present both runtimes (OpenMontage hard rule).

## 4. Style frames

4–6 frames of the actual film, rendered with the real tools. Reject here if generic.

## 5. Motion test

One 8–12 s scene: 9:16, real motion, camera, SFX, music, captions. Inspect frames, audio, safe zones before showing.

## 6. Full production

Only after the test is approved. Then publish-quality checks: facts verified, −14 LUFS, safe zones, captions synced.

## Constraints

No paid API calls without approval · no stills in place of motion · no full film before visual approval · report
limitations honestly.
