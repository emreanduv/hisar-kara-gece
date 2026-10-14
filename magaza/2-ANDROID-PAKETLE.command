#!/bin/bash
# Champion Chess — Google Play için imzalı .aab üretir. Finder'da çift tıkla.
# İlk çalıştırmada yükleme anahtarı (keystore) üretilir: magaza/imza/champion-chess-yukleme.jks
# ⚠️  Bu dosyayı ve magaza/imza/ANAHTAR-BILGI.txt'yi YEDEKLE (iCloud/USB). Kaybedilirse Play'de güncelleme için anahtar sıfırlama gerekir.
set -e
cd "$(dirname "$0")/.."
say(){ printf "\n\033[1;32m▶ %s\033[0m\n" "$*"; }
trap 'echo; echo "✖ Bir adım başarısız oldu. Yukarıdaki hatayı Claude ile paylaş."; read -n1 -p "Kapatmak için bir tuşa bas…"' ERR
[ -f magaza/imza/ortam.sh ] && source magaza/imza/ortam.sh
command -v brew >/dev/null || { [ -x "$HOME/.homebrew/bin/brew" ] && eval "$("$HOME/.homebrew/bin/brew" shellenv)"; [ -x /opt/homebrew/bin/brew ] && eval "$(/opt/homebrew/bin/brew shellenv)"; } || true
VER=$(node -p "require('./package.json').version"); CODE=$(node -p "require('./magaza/surum.json').androidVersionCode")
say "Sürüm $VER (kod $CODE)"
npm install --no-audit --no-fund
[ -d android ] || npx cap add android
npm run ikonlar >/dev/null
npx cap sync android
# sürüm numaraları
sed -i '' -E "s/versionCode [0-9]+/versionCode $CODE/; s/versionName \"[^\"]+\"/versionName \"$VER\"/" android/app/build.gradle
# yükleme anahtarı
KS=magaza/imza/champion-chess-yukleme.jks
if [ ! -f "$KS" ]; then
  say "Yükleme anahtarı üretiliyor"
  PW=$(LC_ALL=C tr -dc 'A-Za-z0-9' </dev/urandom | head -c 24)
  keytool -genkeypair -v -keystore "$KS" -alias champion -keyalg RSA -keysize 2048 -validity 10000 -storepass "$PW" -keypass "$PW" -dname "CN=Emre Anduv, L=Istanbul, C=TR"
  printf "Champion Chess yükleme anahtarı\nDosya: %s\nTakma ad (alias): champion\nŞifre: %s\nOluşturma: %s\n" "$KS" "$PW" "$(date)" > magaza/imza/ANAHTAR-BILGI.txt
  chmod 600 magaza/imza/ANAHTAR-BILGI.txt
fi
PW=$(sed -n 's/^Şifre: //p' magaza/imza/ANAHTAR-BILGI.txt)
say "İmzalı paket (.aab) derleniyor"
( cd android && ./gradlew bundleRelease \
  -Pandroid.injected.signing.store.file="$PWD/../$KS" -Pandroid.injected.signing.store.password="$PW" \
  -Pandroid.injected.signing.key.alias=champion -Pandroid.injected.signing.key.password="$PW" )
mkdir -p magaza/cikti
cp android/app/build/outputs/bundle/release/app-release.aab "magaza/cikti/champion-chess-$VER-$CODE.aab"
say "Hazır: magaza/cikti/champion-chess-$VER-$CODE.aab  → Play Console'a yüklenecek"
open magaza/cikti
read -n1 -p "Kapatmak için bir tuşa bas…"
