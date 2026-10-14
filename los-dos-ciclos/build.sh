#!/bin/sh
# One command, from scratch: voice → events → score → mix → frames → master (-14 LUFS) → subtitles → poster
set -e
LIB=${LIB:-/root/lemo-opuscar}; export LIB
HERE=$(cd "$(dirname "$0")" && pwd)
export PLAYWRIGHT_CHROME=${PLAYWRIGHT_CHROME:-/opt/pw-browsers/chromium}
SZ="--size 1080x1920"
cd "$LIB"
.venv/bin/python core/tts/tts.py "$HERE/lines.json" "$HERE/voices"
node core/render/events.mjs "$HERE" $SZ
.venv/bin/python "$HERE/music/score.py"
.venv/bin/python "$HERE/mix.py"
node core/render/video.mjs "$HERE" --fps 24 --workers 4 $SZ --out "$HERE/out/video.mp4"
sh "$HERE/master.sh" "$HERE/out/video.mp4" "$HERE/mix.wav" "$HERE/los-dos-ciclos.mp4"
node -e "import('$HERE/story.js').then(m=>process.stdout.write(JSON.stringify(m.VO.map(v=>({t0:v.sub[0],t1:v.sub[1],text:v.text})))))" > "$HERE/out/cues.json"
.venv/bin/python core/render/srt.py "$HERE/out/cues.json" "$HERE/los-dos-ciclos.srt"
node core/render/still.mjs "$HERE" 29.5 $SZ --out "$HERE/out/poster" --prefix p_ && cp "$HERE/out/poster/p_29.5.jpg" "$HERE/poster.jpg"
echo done
