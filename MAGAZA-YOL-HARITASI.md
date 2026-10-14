# App Store + Google Play yol haritası (11.10.2026)

Hazır olanlar: Capacitor kabuğu (`package.json`, `capacitor.config.json`), tek komutla kurulum (`magaza/kur.sh`), ikon ve açılış ekranı (`magaza/assets/`),
gizlilik + yasal uyarı + destek sayfası (`www/gizlilik.html`), mağaza metinleri ve form cevapları (`magaza/MAGAZA-METINLERI.md`),
statik yayın için `render.yaml`. Satranç motoru (`www/chess.js`) uygulamanın içinde; **sunucu gerekmez**, oyun çevrimdışı da oynanır.
Uygulama mağaza içinde açılınca kulüp adları kurmaca olur, Mr. Anduv rozeti ve 📺 yayın modu gizlenir.

## 0. Mağazadan önce çözülmüş / dikkat edilecek 3 iş

1. **Marka hakkı (Apple 5.2).** Gerçek kulüp adları ve armaları yalnız kişisel/yayın sürümünde. Telefon sürümü kurmaca adlarla açılır (`FICT` listesi, `index.html`). Arma hiç yok.
2. **Kumar algısı.** Zar ve tavla yalnız oyun mekaniği: para, bahis, ödül, uygulama içi satın alma yok. Formlarda "Simulated Gambling: Yok".
3. **Kurmaca isimler.** Oyuncu, teknik direktör, hakem ve stat adları kurmaca; gerçek kişiyle benzerlik tesadüf. Gizlilik sayfasında yazıyor.

## 1. Gizlilik sayfasını internete koy (mağaza ister)

| Seçenek | Nasıl |
|---|---|
| Render (ücretsiz statik site) | GitHub'a yükle → New → Blueprint → `render.yaml` |
| GitHub Pages | Depo → Settings → Pages → klasör olarak `fm2010/www` |
| Netlify | `www` klasörünü sürükle-bırak |

Kontrol: `https://SITE-ADRESIN/gizlilik.html`. Destek e-postasını `emreanduvart@gmail.com` yerine kendi adresinle değiştir.
Aynı adreste oyunun web sürümü de açılır (`https://SITE-ADRESIN/`).

## 2. Paketle (Mac: Node 22+, Xcode 26, Android Studio)

```sh
cd ChampionChess-main/fm2010
./magaza/kur.sh                    # paketleri kurar, ios/android projelerini ve ikonları üretir
npx cap open ios                   # Xcode → Team seç → Product › Archive → Distribute App
npx cap open android               # Build › Generate Signed App Bundle (.aab) → Play Console
```
Arayüzü değiştirdikten sonra yalnız: `npx cap sync`.
Not: Üst klasördeki eski React + Capacitor projesi (ChampionChess-main/android) ayrı; bu yeni sürüm kendi `fm2010/android` ve `fm2010/ios` klasörlerini üretir.

## 3. Sonraki yerel özellikler (isteğe bağlı)

- 📤 Maç sonucunu görsel olarak paylaşma — `@capacitor/share`
- 📳 Golde titreşim — `@capacitor/haptics`
- ☁️ Kariyeri iCloud / Google hesabına yedekleme

## 4. Hesaplar

| | Apple | Google |
|---|---|---|
| Geliştirici hesabı | Apple Developer Program (yıllık ücretli) | Google Play Console (tek seferlik ücret) |
| Kategori | Oyunlar › Strateji | Oyun › Strateji |
| Metinler | `magaza/MAGAZA-METINLERI.md` | aynı dosya |

Kişisel hesapla açılan yeni Play hesaplarında yayından önce kapalı test (en az 12 test kullanıcısı, 14 gün) istenebilir. Güncel ücret ve kuralları başvuru anında developer.apple.com ve play.google.com/console'dan teyit et.

## Önerilen sıra

1. Birkaç gün `./yayin-7-24.sh` ile yayında dene, oyunu oturt.
2. `www` klasörünü statik siteye koy → gizlilik adresi hazır.
3. `./magaza/kur.sh` → TestFlight / dahili test → mağaza.

---

## 13.10.2026 · Mağazaya çıkış durumu (Claude)

| İş | Durum |
|---|---|
| Oyun son hali (birleşik yayın çizgisi, telefon düzeni, kurmaca adlar) | ✅ `www/index.html` |
| İkon, açılış ekranı | ✅ `magaza/assets/` |
| Ekran görüntüleri | ✅ `magaza/ekran-goruntuleri/` — iPhone 6,9" 1320×2868 · iPad 13" 2064×2752 · Android 1080×2400 · Play öne çıkan görsel 1024×500 |
| Mağaza metinleri, form cevapları | ✅ `magaza/MAGAZA-METINLERI.md` |
| Paketleme betikleri (çift tıkla) | ✅ `magaza/1-ARACLARI-KUR.command` → `2-ANDROID-PAKETLE.command` → `3-IOS-PAKETLE.command` |
| Mac'te Xcode | ⛔ kurulu değil (App Store'dan, Apple kimliğinle) |
| Mac'te Java + Android SDK | ⛔ kurulu değil (`1-ARACLARI-KUR.command` kurar; SDK lisanslarını sen onaylarsın) |
| App Store Connect / Play Console oturumu (Claude'un tarayıcısında) | ⛔ açık değil — şifreyi Claude giremez, bir kez sen açacaksın |
| Gizlilik sayfasının herkese açık adresi | ⛔ yok — GitHub Pages / Render (GitHub oturumu gerekir) |
| Destek e-postası | ⛔ `emreanduvart@gmail.com` yerine gerçek adres |

**Google Play notu:** 13.11.2023'ten sonra açılan kişisel geliştirici hesaplarında üretime (herkese açık) çıkmadan önce **kapalı test: en az 12 test kullanıcısı, 14 gün kesintisiz** zorunlu. Sıra: dahili test → kapalı test (12 kişi, 14 gün) → üretim başvurusu. Apple'da böyle bir bekleme yok; TestFlight sonrası doğrudan incelemeye gönderilir (genelde 1–3 gün).

**Sürüm artırma:** her yeni yüklemede `magaza/surum.json` içindeki `androidVersionCode` ve `iosBuild` 1 artırılır; görünen sürüm `package.json` → `version`.
