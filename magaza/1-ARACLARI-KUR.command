#!/bin/bash
# Champion Chess — Mac'e paketleme araçlarını kurar (bir kez). Finder'da çift tıkla.
#  · Node.js 22+  · Java 21 (Android için)  · Android komut satırı araçları + SDK
#  · Xcode App Store'dan ayrıca kurulur (Apple kimliğin gerekir); bu betik yalnız kontrol eder.
# Android SDK lisansları burada SENİN onayınla kabul edilir (ekranda "y" yazman istenir).
cd "$(dirname "$0")/.."
say(){ printf "\n\033[1;32m▶ %s\033[0m\n" "$*"; }
if ! command -v brew >/dev/null; then
  [ -x "$HOME/.homebrew/bin/brew" ] && eval "$("$HOME/.homebrew/bin/brew" shellenv)"
  [ -x /opt/homebrew/bin/brew ] && eval "$(/opt/homebrew/bin/brew shellenv)"
fi
command -v brew >/dev/null || { echo "Homebrew yok → https://brew.sh adresindeki tek satırlık komutla kur, sonra bu dosyayı yeniden çalıştır."; read -n1 -p "Kapatmak için bir tuşa bas…"; exit 1; }
say "Node.js";      brew list node >/dev/null 2>&1 || brew install node
say "Java 21";      brew list openjdk@21 >/dev/null 2>&1 || brew install openjdk@21
JAVA_HOME="$(brew --prefix openjdk@21)/libexec/openjdk.jdk/Contents/Home"; export JAVA_HOME PATH="$JAVA_HOME/bin:$PATH"
say "Android komut satırı araçları"; brew list --cask android-commandlinetools >/dev/null 2>&1 || brew install --cask android-commandlinetools
SDK="$(brew --prefix)/share/android-commandlinetools"; export ANDROID_HOME="$SDK"
say "Android SDK lisansları (okuyup kabul etmek için y yaz)"
sdkmanager --sdk_root="$SDK" --licenses
say "Android SDK bileşenleri"
sdkmanager --sdk_root="$SDK" "platform-tools" "platforms;android-36" "build-tools;36.0.0"
mkdir -p magaza/imza
cat > magaza/imza/ortam.sh <<E2
export JAVA_HOME="$JAVA_HOME"
export ANDROID_HOME="$SDK"
export PATH="\$JAVA_HOME/bin:\$PATH"
E2
say "Xcode kontrolü"
if xcodebuild -version >/dev/null 2>&1; then xcodebuild -version; else echo "⚠️  Xcode yok: App Store → Xcode → Al/Yükle. Kurulunca bir kez aç, ek bileşenleri kur, Settings › Accounts'a Apple kimliğini ekle."; fi
say "Bitti. Sırada: 2-ANDROID-PAKETLE.command ve 3-IOS-PAKETLE.command"
read -n1 -p "Kapatmak için bir tuşa bas…"
