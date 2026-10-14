#!/bin/bash
# Champion Chess — App Store için arşivler ve App Store Connect'e yükler. Finder'da çift tıkla.
# Gerekenler: Xcode (Settings › Accounts'ta Apple kimliğin ekli) · magaza/surum.json içinde appleTeamId
set -e
cd "$(dirname "$0")/.."
say(){ printf "\n\033[1;32m▶ %s\033[0m\n" "$*"; }
trap 'echo; echo "✖ Bir adım başarısız oldu. Yukarıdaki hatayı Claude ile paylaş."; read -n1 -p "Kapatmak için bir tuşa bas…"' ERR
command -v brew >/dev/null || { [ -x "$HOME/.homebrew/bin/brew" ] && eval "$("$HOME/.homebrew/bin/brew" shellenv)"; [ -x /opt/homebrew/bin/brew ] && eval "$(/opt/homebrew/bin/brew shellenv)"; } || true
xcodebuild -version >/dev/null 2>&1 || { echo "Xcode yok ya da ilk kurulum bitmemiş. Önce Xcode'u kur ve bir kez aç."; read -n1; exit 1; }
VER=$(node -p "require('./package.json').version"); BUILD=$(node -p "require('./magaza/surum.json').iosBuild"); TEAM=$(node -p "require('./magaza/surum.json').appleTeamId||''")
[ -n "$TEAM" ] || { echo "magaza/surum.json → appleTeamId boş. developer.apple.com › Membership'teki 10 haneli Team ID'yi yaz (Claude da doldurabilir)."; read -n1; exit 1; }
say "Sürüm $VER ($BUILD) · Team $TEAM"
npm install --no-audit --no-fund
[ -d ios ] || npx cap add ios
npm run ikonlar >/dev/null
npx cap sync ios
PLIST=ios/App/App/Info.plist
/usr/libexec/PlistBuddy -c "Set :ITSAppUsesNonExemptEncryption false" "$PLIST" 2>/dev/null || /usr/libexec/PlistBuddy -c "Add :ITSAppUsesNonExemptEncryption bool false" "$PLIST"
/usr/libexec/PlistBuddy -c "Set :CFBundleDisplayName Champion Chess" "$PLIST" 2>/dev/null || /usr/libexec/PlistBuddy -c "Add :CFBundleDisplayName string Champion Chess" "$PLIST"
/usr/libexec/PlistBuddy -c "Set :CFBundleDevelopmentRegion tr" "$PLIST" 2>/dev/null || true
mkdir -p magaza/cikti
cat > magaza/cikti/ExportOptions.plist <<E2
<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict><key>method</key><string>app-store-connect</string><key>destination</key><string>upload</string><key>teamID</key><string>$TEAM</string><key>signingStyle</key><string>automatic</string><key>manageAppVersionAndBuildNumber</key><false/></dict></plist>
E2
say "Arşivleniyor"
xcodebuild -project ios/App/App.xcodeproj -scheme App -configuration Release -destination 'generic/platform=iOS' \
  -archivePath magaza/cikti/ChampionChess.xcarchive DEVELOPMENT_TEAM="$TEAM" CODE_SIGN_STYLE=Automatic \
  MARKETING_VERSION="$VER" CURRENT_PROJECT_VERSION="$BUILD" PRODUCT_BUNDLE_IDENTIFIER=com.anduv.championchess \
  -allowProvisioningUpdates archive
say "App Store Connect'e yükleniyor"
xcodebuild -exportArchive -archivePath magaza/cikti/ChampionChess.xcarchive -exportOptionsPlist magaza/cikti/ExportOptions.plist \
  -exportPath magaza/cikti/ios -allowProvisioningUpdates
say "Yüklendi. 10–30 dk içinde App Store Connect › TestFlight'ta görünür."
read -n1 -p "Kapatmak için bir tuşa bas…"
