#!/bin/bash
# Champion Chess — 7/24 yayın (OBS) için yerel sunucu.
#   cd "/Users/karakalpakli/Documents/ChampionChess-main/fm2010" && ./yayin-7-24.sh
# · Mac uykuya geçmez (ekran kararabilir, sistem açık kalır)
# · Sunucu herhangi bir sebeple durursa 5 sn sonra kendiliğinden yeniden başlar
# · Eski sunucu açık kaldıysa önce o kapatılır · Kayıt: data/sunucu.log (5 MB'ı geçince eskisi .1 olur)
# OBS → Tarayıcı kaynağı → http://127.0.0.1:8768/?yayin=1  (1920×1080, "Sesi OBS üzerinden kontrol et")
# Durdurmak için: Ctrl+C
cd "$(dirname "$0")"
PORT="${CC_PORT:-8768}"
mkdir -p data
trap 'echo; echo "Yayın sunucusu durduruldu."; exit 0' INT TERM
caffeinate -ims -w $$ &
OLD=$(lsof -t -i:"$PORT" 2>/dev/null)
[ -n "$OLD" ] && { echo "Eski sunucu kapatılıyor ($OLD)…"; kill $OLD 2>/dev/null; sleep 1; }
echo "♞ Champion Chess yayında:  http://127.0.0.1:$PORT/?yayin=1   ·   oyun: http://127.0.0.1:$PORT"
n=0
while true; do
  [ -f data/sunucu.log ] && [ "$(wc -c < data/sunucu.log)" -gt 5000000 ] && mv -f data/sunucu.log data/sunucu.log.1
  PYTHONUNBUFFERED=1 python3 -m http.server "$PORT" --bind 127.0.0.1 --directory www 2>&1 | tee -a data/sunucu.log
  code=${PIPESTATUS[0]}
  n=$((n+1))
  echo "$(date '+%d.%m %H:%M:%S') ⚠️ sunucu durdu (kod $code) — 5 sn sonra yeniden başlıyor (#$n)" | tee -a data/sunucu.log
  sleep 5
done
