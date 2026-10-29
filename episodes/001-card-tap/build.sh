#!/bin/sh
# One command: "The Tap Line" (Episode 001 · What Happens After You Tap Your Card?), Transit Map style.
#   sh episodes/001-card-tap/build.sh       voice, events, score + mix, picture, master, reading-time check, subtitles, poster
# Needs the Lemo-Opuscar library at the commit pinned in ../../LEMO_PIN.md (LIB, default ~/lemo-opuscar) with
# `setup.sh deps voice` done and the vcsl, freepats, vsco2ce sample packs fetched; ffmpeg 7+ on PATH.
set -e
HERE=$(cd "$(dirname "$0")" && pwd)
LIB=${LIB:-$HOME/lemo-opuscar}
export LIB
[ -f "$LIB/core/render/video.mjs" ] || { echo "set LIB to the Lemo-Opuscar library folder"; exit 1; }
PY="$LIB/.venv/bin/python"
NAME=the-tap-line
FPS=30                                   # Transit Map renders at 30 fps (STYLE.md §5)
FRAME=57.0                               # the whole network with the end title: poster
cd "$LIB"
for l in vcsl freepats vsco2ce; do [ -d "core/audio/instruments/$l" ] || sh tools/fetch.sh instruments $l; done

# voice (Kokoro, offline): one WAV per line + durations; then the speech-to-text check (needs the Whisper model)
[ -f "$HERE/voice/out/l01.wav" ] || "$PY" core/tts/tts.py "$HERE/voice/lines.json" "$HERE/voice/out"
"$PY" core/tts/asr_check.py "$HERE/voice/lines.json" "$HERE/voice/out" --lang en || echo "! speech check failed or could not run: listen to every line"

# events from the picture, then score + effects + voice (mix.wav, about -16 LUFS before the master)
node core/render/events.mjs "$HERE"
"$PY" "$HERE/audio.py"

# picture and master (mux.sh brings the mix to -14 LUFS; grain 1)
node core/render/video.mjs "$HERE" --fps $FPS --workers 4 --out "$HERE/out/video.mp4"
sh core/render/mux.sh "$HERE/out/video.mp4" "$HERE/mix.wav" "$HERE/$NAME.mp4" $FPS 1

# reading time of every printed word, subtitles, poster
node core/render/readcheck.mjs "$HERE" > "$HERE/out/readcheck.txt" && echo "readcheck ok" || { tail -20 "$HERE/out/readcheck.txt"; exit 1; }
"$PY" "$HERE/tools/subs.py" && "$PY" core/render/srt.py "$HERE/out/cues.json" "$HERE/$NAME.srt"
ffmpeg -v error -y -ss $FRAME -i "$HERE/$NAME.mp4" -frames:v 1 -q:v 2 "$HERE/poster.jpg"
echo "done: $HERE/$NAME.mp4"
