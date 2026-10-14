# Mağaza metinleri ve formlar — kopyala / yapıştır

Gerçek kulüp adı, arma, lig sponsoru adı ve bahis kelimeleri (iddaa, oran, kupon) **hiçbir alanda kullanılmaz**:
Apple 5.2 (fikrî mülkiyet) ve Google Play'in marka ve kumar kuralları yüzünden ret sebebidir.
Uygulama telefonda açılınca kulüp adları **kendiliğinden kurmaca** olur ("İstanbul Sarı-Lacivert" gibi); Mr. Anduv rozeti ve yayın modu gizlenir.

---

## App Store Connect

| Alan | Değer |
|---|---|
| Ad (en çok 30) | `Champion Chess: Menajer` |
| Alt başlık (en çok 30) | `Satranç ve tavlayla lig kazan` |
| Paket kimliği (Bundle ID) | `com.anduv.championchess` |
| SKU | `championchess-ios-1` |
| Birincil kategori | Oyunlar › Strateji |
| İkincil kategori | Oyunlar › Spor |
| Fiyat | Ücretsiz |
| Gizlilik politikası adresi | `https://SITE-ADRESIN/gizlilik.html` |
| Destek adresi | `https://SITE-ADRESIN/gizlilik.html#destek` |
| Telif (Copyright) | `2026 Emre …` (adın soyadın) |

**Tanıtım metni (en çok 170):**
Eski menajerlik oyunlarının tadında bir lig kariyeri: maçlarını satranç tahtasında, tavla masasında ya da kulübeden canlı anlatımla kazan.

**Anahtar kelimeler (en çok 100, virgülle, boşluksuz):**
`satranç,tavla,menajer,futbol,lig,strateji,kariyer,teknik direktör,puan durumu,maç`

**Açıklama:**
```
Champion Chess, eski menajerlik oyunlarının tadında bir futbol kariyeri. Ama maçlar sahada değil, tahtada kazanılır.

MAÇINI SEÇ
• Satranç: iç sahada beyaz, deplasmanda siyah. Mat et, puanları al
• Tavla: kırık taş, mars ve eşek marsı kurallarıyla tam oyun
• Hızlı maç: 90 dakikayı canlı anlatımla kulübeden yönet, devre arasında tavrını seç

MENAJER GİBİ DÜŞÜN
• Maç önü takım konuşması oyuncuların odağını belirler
• Moral, yönetim güveni ve taraftar desteği her sonucu etkiler
• Basın toplantısında söylediklerin soyunma odasında yankılanır
• Yönetimin sezon hedefi: şampiyonluk, Avrupa ya da ligde kalmak

DERİN BİR LİG
• 18 kulüp, 34 hafta, fikstür ve canlı puan durumu
• 24 kişilik kadrolar, gol ve asist krallığı
• Teknik ekip notları, rakip analizi, derbi ligi
• Sezonlar boyu süren kariyer ve geçmiş

Üyelik yok, reklam yok, uygulama içi satın alma yok, kişisel veri toplanmaz.

Champion Chess bağımsız bir oyundur; hiçbir kulüp, lig ya da federasyonla bağlantısı yoktur. Kulüp, oyuncu ve hakem adları kurmacadır.
```
> Not: Uygulamada olmayan özelliği yazma (Apple 2.3.1).

**Yaş derecelendirmesi formu:** her soruya *Yok / None*. "Kumar / Simulated Gambling": **Yok** (zar ve tavla oyun mekaniği; para, bahis, ödül yok). "Sınırsız web erişimi": **Hayır**. Sonuç: 4+.

**App Privacy:** "Do you or your third-party partners collect data from this app?" → **No**. Etiket: *Data Not Collected*.

**Export compliance:** kur.sh, Info.plist'e `ITSAppUsesNonExemptEncryption = NO` yazar.

**İnceleme notu (App Review Information → Notes):**
```
Champion Chess is a single-player football manager game in which matches are played as chess, backgammon or a quick text simulation. No login is required.
Pick a club and tap the large "Devam" (Continue) button at the top right to reach match day. Give a team talk, then choose "Satranç" (chess), "Tavla" (backgammon) or "Hızlı Maç" (quick match).
Club names are fictional. There is no real money, betting, in-app purchase, advertising or user-generated content. Everything runs on the device.
```

---

## Google Play Console

| Alan | Değer |
|---|---|
| Uygulama adı (en çok 30) | `Champion Chess: Menajer` |
| Paket adı | `com.anduv.championchess` |
| Uygulama / oyun | **Oyun** |
| Kategori | Strateji |
| Ücretli / ücretsiz | Ücretsiz |
| Gizlilik politikası | `https://SITE-ADRESIN/gizlilik.html` |
| E-posta | destek e-postan |

**Kısa açıklama (en çok 80):**
`Lig kariyeri: maçlarını satranç, tavla ya da canlı anlatımla kazan.`

**Tam açıklama:** App Store açıklamasının aynısı.

**Grafikler:** ikon 512×512 (`www/icon-512.png`), öne çıkan görsel 1024×500, en az 2 telefon ekran görüntüsü.

**Uygulama içeriği formları:**
- *Reklam:* Reklam içermiyor.
- *Uygulama erişimi:* Tüm işlevler kısıtlama olmadan kullanılabilir.
- *İçerik derecelendirmesi (IARC):* Kategori **Oyun**; şiddet, kumar, simüle kumar, kullanıcı etkileşimi soruları **Hayır**.
- *Hedef kitle:* 13+ (çocuklara yönelik değil — "Families" kurallarına girmemek için).
- *Veri güvenliği:* Veri toplanmıyor / paylaşılmıyor → **Hayır**.
- *Finans / sağlık / devlet:* Hayır.

---

## Ekran görüntüleri

| Mağaza | Gerekli boyut |
|---|---|
| App Store (iPhone 6,9") | 1320×2868 (dikey) — en az 1 |
| App Store (iPad) | Yalnız iPad açıksa gerekir (Xcode → Supported Destinations) |
| Google Play (telefon) | 1080×1920 ya da 1080×2400 — en az 2 |

Önerilen 4 kare: Genel Bakış (maskot balonu) · tavla tahtası · satranç maçı · Puan Durumu (Zirve / Alt sıralar).
Çekmek için: Xcode → iPhone 17 Pro Max simülatörü → oyunu aç → ⌘S.
