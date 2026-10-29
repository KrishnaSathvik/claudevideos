# Production environment pin

Upgrade any of these deliberately, never silently. Episodes are built against exactly this.

| Component | Version |
|---|---|
| Lemo-Opuscar library | `lemomo-ai/lemo-opuscar` @ `f17136060781a0068a7951245a3aa7835a7230de` (2026-10-29) |
| Style | Transit Map (`styles/transit-map`, style.json num 72) |
| Node | 22.22.0 |
| ffmpeg | 7.0.2 static (johnvansickle build, taken from the PyPI wheel `imageio-ffmpeg` 0.7.0); ffprobe 6.1.1 (system) |
| Python (library venv) | 3.12.3 |
| Browser | Playwright Chromium headless shell 1243 (software WebGL / SwiftShader in the cloud sandbox) |
| Voice | kokoro-onnx, model `kokoro-v1.0.onnx`, voice `am_michael` |
| Sample packs | `vcsl`, `vsco2ce`, `freepats` from the library's `assets` release (checksums in its `tools/assets.json`) |
| Fonts | Inter variable (latin), @fontsource-variable/inter 5.3.0 |

## Set up a matching library

```sh
git clone https://github.com/lemomo-ai/lemo-opuscar.git ~/lemo-opuscar
git -C ~/lemo-opuscar checkout f17136060781a0068a7951245a3aa7835a7230de
cd ~/lemo-opuscar && sh plugin/skills/lemo-opuscar/scripts/setup.sh deps voice
for l in vcsl freepats vsco2ce; do sh tools/fetch.sh instruments $l; done
```

Then build an episode with `sh episodes/<episode>/build.sh` (ffmpeg 7+ first on PATH).
