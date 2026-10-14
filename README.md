# Champion Chess Manager ♞ · FM2010 menajer modu

Fırsat, Borsa ve Futbol Akışı'nın oyun kardeşi: Süper Lig'de teknik direktörsün, maçları **satranç**, **tavla** ya da **hızlı maç** (canlı anlatım) ile kazanırsın.
Aynı çizgi: krem tarih şeridi + Devam, koyu yeşil araç çubuğu, maskotlu başlık, sekmeler, krem içerik, CANLI SKORLAR bandı.

## Başlatma

```sh
cd ChampionChess-main/fm2010
./yayin-7-24.sh            # → http://127.0.0.1:8768  (oyun) · http://127.0.0.1:8768/?yayin=1 (yayın)
```
Mac'te `start.command` dosyasına çift tıklamak da olur (sunucuyu açar, tarayıcıyı başlatır).
VS Code'da: klasörü aç → **Terminal → Run Task…** → "♞ Champion Chess: başlat (7/24 sunucu)".
Port doluysa: `kill $(lsof -t -i:8768)`. Fırsat (8765), Borsa (8766) ve Futbol Akışı (8767) ile aynı anda çalışır, çakışmaz.
Sunucu yalnız dosyaları sunar; oyunun kendisi tarayıcıda çalışır, kariyer o tarayıcıda saklanır. Çevrimiçi sürüm: Claude'daki "Champion Chess Manager" sayfası.

## Canlı yayın (YouTube / OBS)

1. **7/24 için:** `./yayin-7-24.sh` — Mac uyumaz, sunucu durursa 5 sn'de kendiliğinden kalkar, eski sunucu açıksa önce kapatılır, kayıt `data/sunucu.log` (5 MB'ta döner).
2. OBS → Kaynak ekle → Tarayıcı → `http://127.0.0.1:8768/?yayin=1` · **1920 × 1080** · ✅ **Sesi OBS üzerinden kontrol et** (düdük ve gol kornası miksere ayrı kanal gelir).
3. Müzik ayrı ses kaynağı.

**Yayın modu kendi kendine oynar** (yapay menajer "Mr. Anduv"): her hafta Genel Bakış → Teknik Ekip → (iki haftada bir) Kadro → takım konuşması →
**canlı Hızlı Maç** (90 dk ≈ 30 sn + gol pankartları) → Maç Sonu + basın toplantısı → **flaş bantları** → Puan Durumu (lig / tek tablo / derbi dönüşümlü) →
Krallık → (üç haftada bir) Fikstür → Gelen Kutusu → sonraki hafta. Sezon bitince final tablosu ve yeni sezon. Yayın kariyeri oyuncunun kendi kariyerinden ayrı saklanır.

| Adres | Ne yapar |
|---|---|
| `?yayin=1` | Menajer modu yayını (otomatik kariyer) |
| `&sayfa=12` | Ekran başına süre (5–60 sn, varsayılan 12; tablolu ekranlar 1,5 katı; hiçbir ekran 5 sn'den kısa kalmaz) |
| `&takim=fb` | Yayın kulübü (gs, fb, bjk, ts, ibfk, kon, aly, svs, ant, ads, ksp, gfk, kay, sam, hty, riz, fkg, pen) |
| `&felsefe=hucum` | Oyun felsefesi: `hucum`, `denge`, `prag` |
| `&kurgu=1` | Kurmaca kulüp adları |
| `&ses=40` | Ses düzeyi 0–100 (varsayılan 70; `ses=0` sessiz) |
| `→` tuşu | Sonraki ekrana geç |
| `g` / `d` / `f` tuşu | GOL pankartını / düdüğü / flaş bandını dene (prova) |

Claude sayfasında sorgu dizesi geçmediği için aynı modlar `#yayin`, `#hepsi`, `#skor`, `#bant`, `#dikey` ile de açılır; oyunda **CC ▾ → 📺 Yayın modu** da başlatır.

**Ekrandaki yeni parçalar:** takvim şeridinde maça geri sayım (**MAÇA 0:12**), son 10 saniyede sağ üstte büyük sayaç ve başlama düdüğü · Devam düğmesi ekranın kalan süresiyle dolar ·
**flaş bantları** (🏆 ZİRVE DEĞİŞTİ · ⚔️ DERBİ · ⚡ SÜRPRİZ: en az 3 güç farkıyla kazanılan maç · 💥 FARK: 4+ gol farkı) — her biri 7 sn ekranda, sesli; alt bantta da FLAŞ olarak kayar ·
7/24 bekçisi: sayfa 6 saatte bir, hafta başında (sakin anda) kendini tazeler, kayıt kaldığı yerden sürer.

**Yayın sesleri** (hepsi tarayıcıda üretilir, kayıt yok → telif sorunu yok): hakem düdüğü (başlama 1, devre arası 2, maç sonu 3) · golde stadyum kornası + tribün uğultusu ·
satrançta hamle, taş alma ve şah sesi · tavlada zar ve taş sesi · galibiyet / mağlubiyet melodisi · flaş uyarısı · yeni hafta zili. Oyunda 🔊 düğmesiyle kapatılır (ayar cihazda kalır).

### Kamerayla yayın katmanları ve dikey ekran

Kendin kameradayken bunlar **şeffaf** tarayıcı kaynağı olarak kameranın üstüne konur (1920 × 1080). Altta yayın modu oynar:

| Adres | Ne gösterir |
|---|---|
| `?katman=hepsi` | Sol üstte skor kutusu (canlı dakika + son anlatım satırı) + altta kayan skor bandı + GOOOL! pankartı |
| `?katman=skor` | Yalnız skor kutusu |
| `?katman=bant` | Yalnız kayan skor bandı (+ gol pankartı) |
| `?katman=dikey` | **Dikey yayın 1080 × 1920** (Shorts / TikTok / Kick mobil): üst şerit, maskotlu başlık, maç kutusu, son 5 anlatım satırı, puan durumu, gol krallığı, son haber, kayan bant |

OBS'de dikey için: Ayarlar → Video → Temel/Çıkış çözünürlüğü 1080×1920 (ya da Aitum Vertical eklentisi ile yatayla aynı anda).

## Oyun

- **Satranç:** iç sahada beyaz, deplasmanda siyah. Mat 3 puan; skor materyal farkına göre yazılır. Asistana sor, beraberlik teklif et, pes et.
- **Tavla:** iç sahada beyaz, deplasmanda siyah taşlar. Kırık taş rakibin iç sahasından girer (giriş kapalıysa sıra geçer), iki zarı oynama zorunluluğu, büyük zar kuralı, taş toplama, mars (2-0) ve eşek marsı (3-0). Turu bitirmeden geri al.
- **Hızlı Maç:** 90 dk canlı anlatım, devre arasında tavır (hücum / koru), GOOOL! pankartı, golcü ve asist adları.
- **Menajer zihniyeti:** takım konuşması → odak; moral, yönetim güveni, taraftar; basın toplantısı; yönetimin sezon hedefi ve kovulma riski.
- **FM2010 ekranları:** Genel Bakış (maskot balonu), Haberler (kulüp kartı), Kadro, Teknik Ekip Notları, Fikstür + maç ayrıntısı, Puan Durumu (zirve/alt, tek tablo, derbi ligi), İstatistik (gol/asist krallığı), Yönetim, Kulüpler.
- **Kulüp adları:** yeni kariyerde *Gerçek adlar* ya da *Kurmaca adlar* ("İstanbul Sarı-Lacivert" gibi). Telefon uygulamasında hep kurmaca.

## Uygulama (App Store / Google Play)

`./magaza/kur.sh` → iOS + Android projeleri, ikonlar, açılış ekranı. Ayrıntı: `MAGAZA-YOL-HARITASI.md`, metinler ve formlar: `magaza/MAGAZA-METINLERI.md`,
gizlilik + yasal uyarı + destek: `www/gizlilik.html`. Telefonda kulüp adları kurmaca olur, Mr. Anduv rozeti ve yayın modu gizlenir. Sunucu gerekmez.

## Dosyalar

```
www/index.html            oyun + yayın + katmanlar (tek sayfa)
www/chess.js              satranç kuralları (chess.js 0.10.3, BSD-2)
www/gizlilik.html         gizlilik politikası · destek · yasal uyarı
www/icon.svg · icon-512.png · manifest.webmanifest
yayin-7-24.sh             7/24 yerel sunucu (caffeinate + kendini yeniden başlatma)
start.command             çift tıkla başlat
.vscode/tasks.json        VS Code'dan tek tıkla başlat / yayın / mağaza
package.json · capacitor.config.json   Capacitor kabuğu (com.anduv.championchess)
magaza/kur.sh             iOS + Android hazırlığı (Terminal)
magaza/1-ARACLARI-KUR.command · 2-ANDROID-PAKETLE.command · 3-IOS-PAKETLE.command   çift tıkla: araçlar → .aab → App Store yükleme
magaza/ekran-goruntuleri/ mağaza ekran görüntüleri (iPhone 6,9", iPad 13", Android) + Play öne çıkan görsel
magaza/surum.json         sürüm kodları ve Apple Team ID
magaza/imza/ · magaza/cikti/   yükleme anahtarı ve paketler (git'e girmez, YEDEKLE)
magaza/assets/            ikon ve açılış ekranı (1024 / 2732 px)
magaza/MAGAZA-METINLERI.md  mağaza metinleri ve form cevapları
MAGAZA-YOL-HARITASI.md    App Store / Google Play'e giden yol
render.yaml               statik site (gizlilik adresi ve web sürümü)
```

## Sınırlar (dürüst not)

- Oyuncular, teknik direktörler, hakemler ve stat adları kurmacadır; kulüp armaları kullanılmaz (forma renkli kutular).
- Kayıt cihazın tarayıcı belleğindedir; tarayıcı verisi silinirse kariyer de silinir.
- Yazı tipleri Google Fonts'tan gelir; internet yoksa sistem yazı tipiyle açılır.
- Tarayıcılar sesi ilk tıklamadan önce başlatmaz; OBS tarayıcı kaynağında ses kendiliğinden açılır.

## Kardeş projelerden gelen iyileştirmeler (11.10.2026)

7/24 yayın betiği · yayın sesleri (`&ses=`) · flaş bantları · maça geri sayım ve son 10 sn sayacı · Devam dolgusu · 6 saatlik tazeleme · kamerayla katmanlar ve dikey ekran ·
kurmaca kulüp adları · Capacitor mağaza paketi, ikonlar, gizlilik sayfası, mağaza metinleri ve yol haritası · VS Code görevleri.
(10.10: Kadro, Teknik Ekip, Krallık, Fikstür ayrıntısı, tek tablo, Derbi Ligi, kulüp kartı, maskot yorumcu, GOOOL! pankartı, 75 px/sn skor bandı.)

## Birleşik yayın çizgisinden gelenler (12.10.2026)

- **Platform imzası:** müzik rozeti her ekran geçişinde sıradaki platforma döner: “Spotify / Mr. Anduv!”, “YouTube Music / Mr. Anduv!”, “Twitch / Mr. Anduv!” … `&platform=twitch` yalnız o platformu gösterir (spotify, youtube, ytmusic, apple, amazon, tiktok, twitch, kick). Logo yok, yalnız ad.
- **Stadyum LED panosu (yayın modu):** araç çubuğu saha kenarı panosuna döner; iki pano 8 sn'de bir sırayla döner: lider, gol kralı, sıradaki maç, derbi, en golcü takım ve kardeş yayınlar (Futbol, Borsa, Fırsat Akışı). `&pano=0` kapatır.
- Telefon uygulamasında Mr. Anduv rozeti, LED panosu ve yayın modu görünmez.
