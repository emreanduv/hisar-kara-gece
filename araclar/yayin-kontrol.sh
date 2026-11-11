#!/usr/bin/env bash
# Yayın öncesi kontrol: biri tutmazsa derleme durur (CLAUDE.md "Yayın güvenliği").
# Kullanım: araclar/yayin-kontrol.sh <sürüm>
set -u
SURUM="${1:-}"
HATA=0
hata() { echo "::error::$1"; HATA=1; }
tamam() { echo "✓ $1"; }

# 1) Dal main mi
DAL="${GITHUB_REF_NAME:-$(git rev-parse --abbrev-ref HEAD)}"
[ "$DAL" = "main" ] && tamam "dal: main" || hata "Derleme yalnız main dalından alınır (şu an: $DAL)"

# 2) Test geri bildirim standardı kodda var mı
var() { grep -rqE "$2" www package.json && tamam "$1" || hata "Eksik: $1"; }
var "rehber (ilk karşılaşma ipuçları)" "function rhGoster"
var "Nasıl Oynanır ekranı ve 'Rehberi baştan göster'" "Rehberi baştan göster"
var "uygulama içi puan (in-app-review)" "@capacitor-community/in-app-review"
var "paylaş (@capacitor/share)" "@capacitor/share"
var "Bize yaz (görüş e-postası)" "emreanduvart@gmail.com"
var "Verilerimi sil" "Verilerimi sil"

# 3) İmza ana ekranda mı
grep -q 'src="dil.js"' www/index.html && [ -f www/dil-en.js ] \
  && tamam "dil seçimi (Türkçe/English) var" || hata "dil seçimi yok (www/dil.js + www/dil-en.js)"
grep -q 'Hisar.ı ayakta tut. · <b>Bir Mr. Anduv! yapımıdır.</b>' www/index.html \
  && tamam "\"Bir Mr. Anduv! yapımıdır.\" ana ekranda" || hata "\"Bir Mr. Anduv! yapımıdır.\" ana ekranda yok"

# 4) Sürüm son yayınlanandan küçük mü; package.json ve oyun içi sürüm aynı mı
if [ -n "$SURUM" ] && [ -f store/SON-SURUM ]; then
  SON=$(tr -d '[:space:]' < store/SON-SURUM)
  EN=$(printf '%s\n%s\n' "$SON" "$SURUM" | sort -V | tail -1)
  [ "$EN" = "$SURUM" ] && tamam "sürüm $SURUM ≥ son yayınlanan $SON" || hata "Sürüm $SURUM, son yayınlanandan ($SON) küçük: geri giden sürüm olmaz"
  PKG=$(node -p "require('./package.json').version" 2>/dev/null)
  [ "$PKG" = "$SURUM" ] && tamam "package.json sürümü $PKG" || hata "package.json sürümü ($PKG) derleme sürümüyle ($SURUM) aynı değil"
  grep -q "const SURUM='$SURUM'" www/index.html && tamam "oyun içi sürüm $SURUM" || hata "www/index.html SURUM derleme sürümüyle ($SURUM) aynı değil"
else
  hata "Sürüm verilmedi ya da store/SON-SURUM yok"
fi

[ $HATA = 0 ] && echo "Yayın öncesi kontrol geçti." || { echo "Yayın öncesi kontrol TUTMADI, derleme durdu."; exit 1; }
