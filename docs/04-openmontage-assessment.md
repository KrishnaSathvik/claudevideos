# 04 · OpenMontage assessment (2026-10-29)

Repo: https://github.com/calesthio/OpenMontage (inspected at commit `195eab24478dc9363326aec437aefc3701635ddf`,
2026-10-28). Licence **AGPL-3.0**: videos you make are yours; copying its code into this repo would bring AGPL
obligations, so use it from its own clone.

## What it is

An agent-first video production system: the coding agent is the orchestrator; Python provides tools; YAML pipeline
manifests (`pipeline_defs/`) and markdown director skills (`skills/`) hold the process. Pipelines: animated explainer,
animation, character animation, avatar spokesperson, cinematic, clip factory, documentary montage, hybrid,
localization/dub, podcast repurpose, screen demo, talking head. ~100+ tools, 60+ providers (Kling, Veo, Runway,
Seedance, Grok, Higgsfield, ElevenLabs, OpenAI, Google, Suno, Pexels, Archive.org…), Blender and Three.js for 3D,
Backlot (a live local storyboard board with approval gates).

Stage flow: `research → proposal → script → scene_plan → assets → edit → compose`, with human approval at creative gates.

## The parts that matter for us

- **Reference-video entry point** (`skills/meta/video-reference-analyst.md`): download (yt-dlp), transcribe, scene
  detect, sample keyframes; report Content / Style / Structure / Motion plus a 5-aspect breakdown per shot (subject,
  subject motion, scene, spatial framing, camera); classify each scene as `motion_clip`, `animated_still` or
  `static_image` so the production path matches how the reference was really made; then 2–3 differentiated concepts.
- **Templated vs Atelier** (`AGENT_GUIDE.md`): templated assembles stock scene types (text_card, stat_card, charts) —
  "the reason most videos look alike". **Atelier** hand-authors every scene; default for hero work; stock components are
  off-limits; ends with a distinctness review ("could this be any other video?").
- **Taste direction** (`skills/meta/taste-direction.md`): a specific design read + three 1–10 dials (visual variance,
  motion intensity, information density) + anti-default checklist (AI-purple gradients, same transition everywhere,
  text-only slides, …).
- **Two runtimes**, must both be presented before locking: Remotion (React; data-driven explainers, word-level
  captions) and HyperFrames (HTML/CSS/GSAP; kinetic type, launch reels, 30+ CSS and 14 shader transitions).
- **Motion-required rule**: no silent fallback to Ken-Burns stills or a different renderer.
- **Short-form skill** (`skills/creative/short-form.md`): 9:16, ~900×1400 safe zone, hook in 1–2 s, text in 0.5 s,
  visual change every 1–3 s, captions ≥ 42 px, 180–200 wpm.
- **Video composition rules** (HyperFrames creative references): 8–10 elements per scene, background texture +
  midground + foreground accents, headlines 64–120 px, motion verbs per element (SLAMS, DRAWS, SNAPS…).

## Known open issues (read 2026-10-29; 114 open, 2 of 5 pages reviewed)

- **#575** documentary-montage renders silent: `video_compose` ignores `edit_decisions.audio` and `grade_profile`
  (only the `end_tag` schema part fixed). Workaround: separate audio_mixer pass; grade before composing.
- **#619** cannot pass `--browser-executable` to Remotion → fails on locked-down/offline machines (PR #620 proposed).
- Others affecting quality: #855 slowed clips end early (black), #528 requested frame rate ignored (always 30 fps),
  #731 captions cover chart labels, #433 caption burn crash on long videos, #734 colour grade intensity inverted,
  #730 overlays ignored in cinematic/documentary, #732 chart palette ignored, #654 bar labels misstate decimals,
  #637 diagram tool silently degrades to text card, #590 HyperFrames wrongly "unavailable" when npm is slow,
  #587 / #735 Pexels and Pixabay music adapters 401/403, #572 Mixkit scraper stale, #511 stock adapters hide failures,
  #771 audio mixer fade crash, #733 selector routes first-frame calls as text-to-video, #432 Imagen 404 for new users.
- **#864 security**: `math_animate` safety-scan bypass allows host command execution — avoid that tool until fixed.

Takeaway: the instructions are excellent; the implementations need testing. Demo quality (Signal From Tomorrow, The Last
Banana at $1.33 via Kling, Objects in Overdrive via Blender) depends on paid generation or real 3D work, not just install.

## Capability audit

The cloud sandbox **blocked installing/running OpenMontage** (external-code policy), so this is static (code + machine):

| Capability | Cloud sandbox | Owner's Mac (expected; verify with preflight) |
|---|---|---|
| Node 22 / npx | yes | install via brew |
| ffmpeg 7 | yes (manual static build) | `brew install ffmpeg` |
| Remotion | doubtful (#619, browser download) | should work |
| HyperFrames (`npx hyperframes`) | likely (npm reachable) | should work; run `npx hyperframes doctor` |
| Blender 3D | no | install; Eevee on Apple silicon |
| Local AI video (Wan/LTX) | no GPU | no (NVIDIA path) |
| Cloud AI video (Kling/Veo/…) | no keys | needs keys + approved budget |
| Higgsfield (connected via MCP in the cloud session) | 4 credits, free plan | same account; too little for real tests |
| yt-dlp reference download | almost certainly blocked | works |
| Piper TTS / faster-whisper | blocked (huggingface.co) | works |

Preflight on the Mac (report passed / degraded / blocked before creative work):

```sh
cd ~/OpenMontage && .venv/bin/python -c "from tools.tool_registry import registry; import json; registry.discover(); print(json.dumps(registry.provider_menu_summary(), indent=2))"
```

## Lemo-Opuscar vs OpenMontage

| | Lemo-Opuscar | OpenMontage |
|---|---|---|
| Code-rendered 2D/3D film styles | core strength | supported (Remotion, HyperFrames, Three.js) |
| AI motion clips | no | many providers |
| Blender | no | yes |
| Reference-video analysis | no | dedicated workflow |
| Approval gates / storyboard | optional stop | built-in (Backlot) |
| Licence | MIT | AGPL-3.0 |

Decision: OpenMontage is the primary framework; Lemo-Opuscar stays a technique reference.
