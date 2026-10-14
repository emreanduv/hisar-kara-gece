#!/bin/bash
# Champion Chess — iOS ve Android projelerini hazırlar (Mac'te çalıştırılır).
#
#   cd "<ChampionChess-main/fm2010>" && ./magaza/kur.sh
#
# Oyun sunucusuz çalışır (her şey www/ içinde, satranç motoru dahil); veri adresi gerekmez.
# Her çalıştırmada güvenle yeniden çalışır: eksikleri kurar, ikonları ve web dosyalarını projelere kopyalar.
set -e
cd "$(dirname "$0")/.."

say(){ printf "\n\033[1;32m▶ %s\033[0m\n" "$*"; }
die(){ printf "\n\033[1;31m✖ %s\033[0m\n\n" "$*"; exit 1; }

# 1) Araçlar
command -v node >/dev/null || die "Node.js yok. Kur:  brew install node   (Homebrew yoksa: https://nodejs.org → LTS)"
NODE_MAJOR=$(node -p 'process.versions.node.split(".")[0]')
[ "$NODE_MAJOR" -ge 22 ] || die "Node.js 22 veya üstü gerekli (sende $(node -v)). Güncelle:  brew upgrade node"
command -v xcodebuild >/dev/null || echo "⚠️  Xcode bulunamadı — iOS için App Store'dan Xcode 26 kur (Android yine hazırlanır)."
[ -f www/chess.js ] || die "www/chess.js eksik (satranç motoru). Klasörü eksiksiz kopyaladığından emin ol."

# 2) Paketler
say "Capacitor paketleri kuruluyor"
npm install --no-audit --no-fund

# 3) Platformlar
[ -d android ] || { say "Android projesi oluşturuluyor"; npx cap add android; }
if command -v xcodebuild >/dev/null; then
  [ -d ios ] || { say "iOS projesi oluşturuluyor"; npx cap add ios; }
fi

# 4) İkon + açılış ekranı
say "İkonlar ve açılış ekranı üretiliyor"
npm run ikonlar >/dev/null && echo "   tamam ✓"

# 5) Web dosyalarını kopyala
say "Web dosyaları projelere kopyalanıyor"
npx cap sync

# 6) iOS ayarları: şifreleme beyanı, Türkçe dil, görünen ad, yalnız dikey değil (oyun yatay da açılır)
PLIST=ios/App/App/Info.plist
if [ -f "$PLIST" ]; then
  /usr/libexec/PlistBuddy -c "Set :ITSAppUsesNonExemptEncryption false" "$PLIST" 2>/dev/null || /usr/libexec/PlistBuddy -c "Add :ITSAppUsesNonExemptEncryption bool false" "$PLIST"
  /usr/libexec/PlistBuddy -c "Set :CFBundleDevelopmentRegion tr" "$PLIST" 2>/dev/null || true
  /usr/libexec/PlistBuddy -c "Set :CFBundleDisplayName Champion Chess" "$PLIST" 2>/dev/null || /usr/libexec/PlistBuddy -c "Add :CFBundleDisplayName string Champion Chess" "$PLIST"
fi

say "Hazır."
cat <<'E'
   iOS     : npx cap open ios       → Xcode: Signing & Capabilities'te Team seç → Product › Archive → Distribute App
   Android : npx cap open android   → Build › Generate Signed App Bundle (.aab) → Play Console'a yükle
   Ayrıntı : MAGAZA-YOL-HARITASI.md  ·  Mağaza metinleri: magaza/MAGAZA-METINLERI.md
E
