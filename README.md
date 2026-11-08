# Hisar: Kara Gece

Yandan görünümlü kale savunma (lane defense) oyunu. Tema ve bütün içerik özgün: Anadolu efsanelerinden yaratıklar (gulyabani, albastı, hortlak, karakoncolos, Tepegöz), lisanslı film/marka unsuru yok.

## Klasörler
- `www/index.html` → Oyunun tamamı (tek dosya, HTML5 canvas, dış bağımlılık yok, internetsiz çalışır)
- `android/` → Android Studio projesi (Capacitor, paket `com.anduv.hisar`, yatay kilitli)
- `ios/` → Xcode projesi (Capacitor, yatay kilitli)
- `assets/` → İkon 1024, splash, Google Play öne çıkan görsel
- `store/` → Mağaza metinleri (TR/EN), gizlilik politikası, ekran görüntüleri

## Bilgisayarda deneme
```
npm install
npm run serve        # http://localhost:8080
```
Ya da `www/index.html` dosyasını doğrudan tarayıcıda aç.

## Oyunu değiştirince
`www/index.html` içinde düzenle, sonra:
```
npx cap sync
```

## Google Play (Android)
1. Android Studio'yu kur, `npx cap open android` ile projeyi aç.
2. `android/app/build.gradle` içinde her yeni sürümde `versionCode` +1, `versionName` güncelle.
3. Build → Generate Signed App Bundle → yeni bir upload anahtarı (keystore) oluştur. **Keystore dosyasını ve şifresini kaybetme, yedekle.**
4. Çıkan `.aab` dosyasını Play Console'da yeni uygulamaya yükle.
5. Mağaza kaydı: `store/magaza-metinleri.md`, ikon `store/play-icon-512.png`, öne çıkan görsel `assets/feature-graphic.png`, ekran görüntüleri `store/screenshots/`.
6. Gizlilik politikası URL'si gerekiyor: `store/gizlilik-politikasi.html` dosyasını herkese açık bir adrese koy (GitHub Pages / Vercel) ve linki forma yaz.
7. Yeni kişisel geliştirici hesaplarında üretime çıkmadan önce kapalı test şartı var; güncel kuralı Play Console gösterir.

## App Store (iOS)
1. Mac + Xcode gerekir. `npm install` → `npx cap sync ios` → `npx cap open ios`.
2. Signing & Capabilities → kendi Apple Developer Team'ini seç.
3. App Store Connect'te yeni uygulama aç, Bundle ID `com.anduv.hisar`.
4. Xcode → Product → Archive → Distribute App → App Store Connect.
5. Ekran görüntüleri: `store/screenshots-ios/`. Gizlilik: "Data Not Collected".
6. Mac yoksa: Codemagic / Ionic Appflow gibi bulut derleme servisleriyle de derlenebilir.

## Oyun ayarları (www/index.html)
- `UNITS` → birlik bedeli, can, güç, menzil, açıldığı bölüm
- `FOES` → düşman değerleri
- `LEVELS` → bölüm adı, Kule canı, düşman sıklığı, düşman karışımı, dev (boss)
- `UPS` → Ordugâh geliştirmeleri ve fiyatları

## Rehber, puan, paylaş (1.1.0)
- `www/index.html` içinde `IPUCU` → rehber ipuçları (ilk karşılaşmada kart, Nasıl Oynanır'da liste). İlerleme `hisar_rehber_v1` anahtarında, cihazda.
- Puan: `@capacitor-community/in-app-review`, paylaş: `@capacitor/share`. App Store kimliği belli olunca `IOS_ID` sabitine yaz (boşken iOS paylaşımında site bağlantısı kullanılır).
- Ayarlar → Verilerimi sil: `hisar` ile başlayan bütün localStorage anahtarlarını siler (oyunda satın alma yok).
