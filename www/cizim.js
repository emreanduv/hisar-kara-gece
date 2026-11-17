/* Hisar: Kara Gece — ayrıntılı vektör çizim (Çizim Planı D1, Kasım 2026)
   Mr. Anduv! ortak kalemiyle aynı dil (kurt-yolu src/cizim/kalem.js): mürekkep kontur #1e130b,
   düz renk + gölge yüzü + ışık yüzü (hücre gölgeleme), yüzlü karakterler, parlayan göz ve hale.
   Ölçüler eski çizimle birebir: ayak y=0, kalça y=-17, baş (1,-47), yüz +x yönüne.
   Oyun mantığı ve çarpışma değişmez; index.html'deki drawFig/drawHorse bu dosyayı çağırır.
   Kare başına çok asker çizildiği için degrade ve shadowBlur az kullanılır (telefonda akıcılık). */
(function () {
  'use strict';
  const OL = '#1e130b', PI = Math.PI, TAU = PI * 2;
  const SHC = {};
  function ton(h, a) {
    if (!h || h[0] !== '#') return h;
    const k = h + a; if (SHC[k]) return SHC[k];
    const n = parseInt(h.slice(1), 16); let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    const f = a < 0 ? 0 : 255, p = Math.abs(a);
    r = Math.round((f - r) * p + r); g = Math.round((f - g) * p + g); b = Math.round((f - b) * p + b);
    return (SHC[k] = '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1));
  }
  const T = () => (window.HISAR && window.HISAR.T) || performance.now() / 1000;
  function daire(c, x, y, r) { c.beginPath(); c.arc(x, y, Math.max(0.01, r), 0, TAU); }
  function elips(c, x, y, rx, ry, rot) { c.beginPath(); c.ellipse(x, y, Math.max(0.01, rx), Math.max(0.01, ry), rot || 0, 0, TAU); }
  function boya(c, dolgu, lw, ol) { c.fillStyle = dolgu; c.fill(); if (lw !== 0) { c.lineWidth = lw || 0.9; c.strokeStyle = ol || OL; c.lineJoin = 'round'; c.stroke(); } }
  function cizgi(c, x1, y1, x2, y2, renk, w) { c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.strokeStyle = renk; c.lineWidth = w; c.lineCap = 'round'; c.stroke(); }
  function kapsul(c, x1, y1, x2, y2, r1, r2) {
    r2 = r2 == null ? r1 : r2; const a = Math.atan2(y2 - y1, x2 - x1);
    c.beginPath(); c.arc(x1, y1, r1, a + PI / 2, a - PI / 2); c.arc(x2, y2, r2, a - PI / 2, a + PI / 2); c.closePath();
  }
  function yol(c, p) { c.beginPath(); c.moveTo(p[0], p[1]); for (let i = 2; i < p.length; i += 2) c.lineTo(p[i], p[i + 1]); c.closePath(); }
  // yumuşak kapalı eğri
  function egri(c, p) {
    const n = p.length / 2, mx = i => (p[(i % n) * 2] + p[((i + 1) % n) * 2]) / 2, my = i => (p[(i % n) * 2 + 1] + p[((i + 1) % n) * 2 + 1]) / 2;
    c.beginPath(); c.moveTo(mx(0), my(0));
    for (let i = 1; i <= n; i++) c.quadraticCurveTo(p[(i % n) * 2], p[(i % n) * 2 + 1], mx(i), my(i));
    c.closePath();
  }
  // hale: shadowBlur yerine iç içe saydam daireler (ucuz ve her cihazda aynı)
  function hale(c, x, y, r, renk, a) {
    a = a == null ? 0.5 : a; c.save(); c.fillStyle = renk;
    for (let k = 3; k >= 1; k--) { c.globalAlpha = a * 0.22 * (4 - k) / 3; daire(c, x, y, r * (0.45 + k * 0.33)); c.fill(); }
    c.restore();
  }
  function parlakGoz(c, x, y, r, renk) {
    hale(c, x, y, r * 3.2, renk, 0.55);
    daire(c, x, y, r); c.fillStyle = renk; c.fill();
    daire(c, x - r * 0.3, y - r * 0.3, r * 0.45); c.fillStyle = '#fffbe8'; c.fill();
  }
  // insan gözü: ak, kara bebek, ışık noktası
  function insanGoz(c, x, y) {
    elips(c, x, y, 1.25, 1.55); boya(c, '#fbf6ec', 0.45);
    daire(c, x + 0.35, y + 0.15, 0.9); c.fillStyle = '#24160c'; c.fill();
    daire(c, x + 0.05, y - 0.35, 0.36); c.fillStyle = '#fff'; c.fill();
  }

  /* ---------- BACAK ---------- */
  function bacak(c, L, hx, fx, arka) {
    const salvar = arka ? ton(L.salvar || ton(L.leg, 0.28), -0.25) : (L.salvar || ton(L.leg, 0.28));
    const cizme = arka ? ton(L.boot || L.leg, -0.25) : (L.boot || L.leg);
    const kx = (hx + fx) / 2 + (fx - hx) * 0.1, ky = -8;
    // şalvar (bol, dizde büzgü)
    c.beginPath(); c.moveTo(hx - 3.2, -18); c.quadraticCurveTo(hx - 4.4, -12, kx - 2.6, ky); c.lineTo(kx + 2.8, ky);
    c.quadraticCurveTo(hx + 4.6, -12, hx + 3.2, -18); c.closePath(); boya(c, salvar);
    // çizme
    c.beginPath(); c.moveTo(kx - 2.3, ky - 0.6); c.lineTo(fx - 1.9, -1.6); c.quadraticCurveTo(fx - 2.4, 0.4, fx - 0.6, 0.5);
    c.lineTo(fx + 3.6, 0.5); c.quadraticCurveTo(fx + 5.2, 0.2, fx + 4.4, -1.1); c.quadraticCurveTo(fx + 2.2, -1.9, fx + 1.8, -3); c.lineTo(kx + 2.4, ky - 0.6); c.closePath();
    boya(c, cizme);
    if (!arka) { cizgi(c, kx - 1.6, ky + 1.2, fx - 1.2, -2.2, 'rgba(255,240,220,.18)', 0.7); }
    cizgi(c, kx - 2.4, ky - 0.4, kx + 2.5, ky - 0.4, ton(cizme, 0.3), 0.8);
  }

  // eyerde oturan binicinin bacağı: uyluk öne, baldır aşağı, üzengide çizme
  function oturBacak(c, L) {
    const salvar = L.salvar || ton(L.leg, 0.28), cizme = L.boot || L.leg;
    c.beginPath(); c.moveTo(-4, -19); c.quadraticCurveTo(2, -20.4, 7.4, -16.6); c.lineTo(7.6, -12.6); c.quadraticCurveTo(1, -12, -3.6, -14); c.closePath(); boya(c, salvar);
    c.beginPath(); c.moveTo(4.6, -14.4); c.lineTo(8.4, -14.6); c.lineTo(7.6, -4.6); c.quadraticCurveTo(9.6, -4.4, 10.6, -3); c.lineTo(10.4, -1.8); c.lineTo(4.4, -1.8); c.closePath(); boya(c, cizme);
    cizgi(c, 4.8, -2.2, 10, -2.2, '#c8a23a', 0.9);
    cizgi(c, 6.2, -13.6, 6, -4.4, 'rgba(255,240,220,.18)', 0.7);
  }

  /* ---------- GÖVDE ---------- */
  function kaftan(c, L) {
    const cl = L.cloth, tr = L.cloth2 || ton(cl, 0.3);
    // etek + gövde
    c.beginPath(); c.moveTo(-6.4, -23); c.quadraticCurveTo(-7.6, -14, -6, -9); c.lineTo(-8.6, 3.5); c.quadraticCurveTo(0, 5.2, 8.4, 3.2);
    c.lineTo(6, -9); c.quadraticCurveTo(7.6, -15, 6.6, -23); c.quadraticCurveTo(0, -25.4, -6.4, -23); c.closePath(); boya(c, cl);
    // gölge yüzü (arka) ve ışık yüzü (ön omuz)
    c.save(); c.clip();
    c.fillStyle = 'rgba(20,10,4,.28)'; c.beginPath(); c.moveTo(-9, -26); c.lineTo(-3.2, -26); c.quadraticCurveTo(-4.6, -10, -2.6, 6); c.lineTo(-10, 6); c.closePath(); c.fill();
    c.fillStyle = 'rgba(255,245,225,.16)'; c.beginPath(); c.moveTo(2.4, -24); c.quadraticCurveTo(5.8, -22, 5.6, -15); c.quadraticCurveTo(3.6, -18, 2.4, -24); c.fill();
    // ön kenar şeridi (kaftan açıklığı) ve etek kenarı
    c.fillStyle = tr; c.beginPath(); c.moveTo(3.2, -23.6); c.quadraticCurveTo(4.6, -12, 3.6, 5); c.lineTo(5.2, 5); c.quadraticCurveTo(6.2, -12, 4.8, -23.6); c.closePath(); c.fill();
    c.fillStyle = ton(tr, -0.2); c.beginPath(); c.moveTo(-9, 2.6); c.quadraticCurveTo(0, 4.4, 9, 2.4); c.lineTo(9, 6); c.lineTo(-9, 6); c.closePath(); c.fill();
    // düğme ilikleri
    c.strokeStyle = ton(tr, 0.35); c.lineWidth = 0.7; for (let y = -21; y < -11; y += 3) { c.beginPath(); c.moveTo(4.9, y); c.lineTo(7, y); c.stroke(); }
    c.restore();
    c.lineWidth = 0.9; c.strokeStyle = OL; c.beginPath(); c.moveTo(-6.4, -23); c.quadraticCurveTo(-7.6, -14, -6, -9); c.lineTo(-8.6, 3.5); c.quadraticCurveTo(0, 5.2, 8.4, 3.2); c.lineTo(6, -9); c.quadraticCurveTo(7.6, -15, 6.6, -23); c.stroke();
    // kuşak ve sarkan uç
    c.beginPath(); c.moveTo(-6.4, -10.5); c.quadraticCurveTo(0, -9.2, 6.4, -10.5); c.lineTo(6.2, -6.8); c.quadraticCurveTo(0, -5.4, -6.4, -6.8); c.closePath(); boya(c, tr, 0.75);
    cizgi(c, -6, -8.6, 6, -8.6, ton(tr, -0.25), 0.6);
    c.beginPath(); c.moveTo(-5.6, -8.4); c.quadraticCurveTo(-8.4, -4, -7.4, 0.6); c.lineTo(-5.4, 0); c.quadraticCurveTo(-6, -4, -4, -7.6); c.closePath(); boya(c, ton(tr, -0.12), 0.65);
    // yaka
    c.beginPath(); c.moveTo(-3.6, -24.4); c.quadraticCurveTo(0.8, -21.4, 4.6, -24); c.lineTo(3.8, -22.2); c.quadraticCurveTo(0.6, -20, -3, -22.6); c.closePath(); boya(c, tr, 0.6);
  }
  // yaratık gövdesi: yırtık, tırtıklı etek
  function yirtikGovde(c, L) {
    const cl = L.cloth;
    c.beginPath(); c.moveTo(-6.6, -23); c.quadraticCurveTo(-8.4, -12, -7.6, -2);
    c.lineTo(-8.8, 3); c.lineTo(-5.4, 0.4); c.lineTo(-3.4, 4.2); c.lineTo(-0.8, 0.8); c.lineTo(1.8, 4.6); c.lineTo(4.2, 0.6); c.lineTo(6.6, 3.6); c.lineTo(7.4, -2);
    c.quadraticCurveTo(8.2, -13, 6.6, -23); c.quadraticCurveTo(0, -25.6, -6.6, -23); c.closePath(); boya(c, cl);
    c.save(); c.clip();
    c.fillStyle = 'rgba(0,0,0,.3)'; c.beginPath(); c.moveTo(-10, -26); c.lineTo(-2.6, -26); c.quadraticCurveTo(-4.4, -8, -2, 6); c.lineTo(-10, 6); c.closePath(); c.fill();
    c.fillStyle = 'rgba(255,255,255,.1)'; c.beginPath(); c.moveTo(2.6, -24); c.quadraticCurveTo(6.6, -20, 6, -12); c.quadraticCurveTo(3.6, -17, 2.6, -24); c.fill();
    if (L.cloth2) { c.fillStyle = L.cloth2; c.beginPath(); c.moveTo(-9, -9.5); c.quadraticCurveTo(0, -7.8, 9, -9.5); c.lineTo(9, -6.6); c.quadraticCurveTo(0, -5, -9, -6.6); c.closePath(); c.fill(); }
    c.restore();
    // yama dikişleri
    c.strokeStyle = 'rgba(0,0,0,.35)'; c.lineWidth = 0.5;
    for (let k = 0; k < 3; k++) { const y = -19 + k * 1.4; c.beginPath(); c.moveTo(-3 + k * 0.3, y); c.lineTo(-1 + k * 0.3, y - 0.4); c.stroke(); }
  }
  function cubbe(c, L) {   // havada süzülen: kukuletalı uzun cübbe, alt ucu dalgalı
    const wv = Math.sin(T() * 4) * 2, cl = L.cloth;
    c.beginPath(); c.moveTo(-7.6, -23); c.quadraticCurveTo(-10, -8, -11.4, 10 + wv); c.quadraticCurveTo(-8, 6, -5.6, 5.2);
    c.quadraticCurveTo(-3, 9, 0, 11 - wv); c.quadraticCurveTo(3, 7, 5.6, 5.2); c.quadraticCurveTo(8.4, 6.4, 11.4, 10 + wv);
    c.quadraticCurveTo(10, -8, 7.6, -23); c.quadraticCurveTo(0, -26, -7.6, -23); c.closePath();
    boya(c, cl);
    c.save(); c.clip();
    c.fillStyle = 'rgba(0,0,0,.32)'; c.beginPath(); c.moveTo(-12, -26); c.lineTo(-3, -26); c.quadraticCurveTo(-5, -4, -1, 14); c.lineTo(-12, 14); c.closePath(); c.fill();
    c.strokeStyle = ton(cl, -0.35); c.lineWidth = 0.7;
    for (const x of [-4.5, 0.5, 5]) { c.beginPath(); c.moveTo(x * 0.5, -18); c.quadraticCurveTo(x * 0.9, -4, x * 1.4, 8); c.stroke(); }
    if (L.cloth2) { c.fillStyle = L.cloth2; c.fillRect(-12, -10, 24, 2.4); }
    c.restore();
    // alt uçta sönen duman
    c.save(); c.globalAlpha = 0.35; c.fillStyle = ton(cl, 0.15);
    for (let k = 0; k < 3; k++) { daire(c, -6 + k * 6, 10 + Math.sin(T() * 3 + k) * 1.5, 2.6 - k * 0.3); c.fill(); }
    c.restore();
  }
  function zirh(c, L) {   // pul/levha zırh ve perçin
    c.save(); c.beginPath(); c.moveTo(-6.4, -23); c.quadraticCurveTo(-7.6, -14, -6, -9); c.lineTo(6, -9); c.quadraticCurveTo(7.6, -15, 6.6, -23); c.closePath(); c.clip();
    for (let r = 0; r < 4; r++) for (let k = -3; k < 4; k++) {
      const x = k * 2.6 + (r % 2) * 1.3, y = -22.5 + r * 3.4;
      c.beginPath(); c.arc(x, y, 1.6, 0, PI); c.strokeStyle = 'rgba(255,255,255,.26)'; c.lineWidth = 0.5; c.stroke();
      c.beginPath(); c.arc(x, y + 0.4, 1.6, 0.1, PI - 0.1); c.strokeStyle = 'rgba(0,0,0,.35)'; c.stroke();
    }
    c.restore();
    // omuz levhaları
    for (const sx of [-1, 1]) { c.beginPath(); c.ellipse(sx * 5.4, -22.4, 3.6, 2.2, sx * 0.4, 0, TAU); boya(c, ton(L.cloth, sx > 0 ? 0.18 : -0.1), 0.7); daire(c, sx * 5.4, -22.6, 0.55); c.fillStyle = '#d8d0b0'; c.fill(); }
  }
  function kurkUst(c, L) {   // kıllı post: gövdenin üstünde sarkık tutamlar
    const r = L.skin; c.strokeStyle = ton(r, -0.4); c.lineWidth = 0.7;
    for (let k = 0; k < 9; k++) {
      const x = -7 + k * 1.75, y = -23 + (k % 2) * 1.2;
      c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x - 1.4, y + 4, x - 0.6, y + 8 + (k % 3)); c.stroke();
    }
    c.fillStyle = ton(r, -0.15); c.beginPath(); c.moveTo(-7.6, -24); c.quadraticCurveTo(0, -27, 7.6, -24);
    for (let k = 7; k >= -7; k -= 1.5) c.lineTo(k, -21.4 + Math.abs((k * 7) % 3) * 0.7); c.closePath(); c.fill();
    c.strokeStyle = OL; c.lineWidth = 0.6; c.stroke();
  }

  /* ---------- BAŞ ---------- */
  const HX = 1, HY = -30;
  function yuz(c, L, r) {
    // kulak
    elips(c, HX - 2.4, HY + 0.6, 1.6, 2.2); boya(c, ton(L.skin, -0.08), 0.7);
    daire(c, HX, HY, r); boya(c, L.skin);
    c.save(); daire(c, HX, HY, r); c.clip();
    c.fillStyle = 'rgba(80,30,10,.2)'; c.beginPath(); c.arc(HX - r * 0.9, HY + r * 0.3, r * 1.15, 0, TAU); c.fill();
    c.fillStyle = 'rgba(255,240,220,.22)'; daire(c, HX + r * 0.45, HY - r * 0.45, r * 0.45); c.fill();
    c.restore();
    daire(c, HX + 3.4, HY + 2.2, 1.3); c.fillStyle = 'rgba(220,90,70,.25)'; c.fill();   // yanak
  }
  function insanYuz(c, L) {
    const r = 6.5; yuz(c, L, r);
    // burun
    c.beginPath(); c.moveTo(HX + 5.6, HY - 1.2); c.quadraticCurveTo(HX + 8.4, HY + 1.4, HX + 5.9, HY + 2); c.lineWidth = 0.75; c.strokeStyle = OL; c.fillStyle = ton(L.skin, -0.05); c.fill(); c.stroke();
    insanGoz(c, HX + 3.4, HY - 1.4);
    cizgi(c, HX + 1.9, HY - 3.6, HX + 4.9, HY - 3.9, '#2a1a0e', 0.85);   // kaş
    const bc = L.beard || '#2a1a0e';
    // pala bıyık
    c.beginPath(); c.moveTo(HX + 5.8, HY + 2.4); c.quadraticCurveTo(HX + 3.6, HY + 2.4, HX + 1.8, HY + 4.6); c.quadraticCurveTo(HX + 3.6, HY + 3.8, HX + 5.6, HY + 3.4);
    c.quadraticCurveTo(HX + 6.6, HY + 3.6, HX + 7.4, HY + 4.4); c.quadraticCurveTo(HX + 7.4, HY + 2.6, HX + 5.8, HY + 2.4); c.closePath(); boya(c, bc, 0.5);
    if (L.sakal) {   // ak/kır sakal
      c.beginPath(); c.moveTo(HX - 0.6, HY + 2.4); c.quadraticCurveTo(HX + 0.4, HY + 9.6, HX + 4, HY + 10.6); c.quadraticCurveTo(HX + 6.6, HY + 8.4, HX + 6.4, HY + 4.4);
      c.quadraticCurveTo(HX + 3, HY + 5.6, HX - 0.6, HY + 2.4); c.closePath(); boya(c, bc, 0.6);
      cizgi(c, HX + 2.2, HY + 6, HX + 3.4, HY + 9, ton(bc, -0.2), 0.4);
    }
  }
  function serpus(c, L) {
    const t = T();
    switch (L.head) {
      case 'kalpak': {   // samur kalpak, al tepelik
        c.beginPath(); c.moveTo(HX - 6.6, HY - 3.4); c.quadraticCurveTo(HX - 7.4, HY - 12, HX - 4, HY - 14.6); c.lineTo(HX + 5.4, HY - 14.2); c.quadraticCurveTo(HX + 7.6, HY - 10, HX + 6.8, HY - 3.6); c.quadraticCurveTo(HX, HY - 5.4, HX - 6.6, HY - 3.4); c.closePath();
        boya(c, '#3a2818');
        c.strokeStyle = 'rgba(255,230,190,.28)'; c.lineWidth = 0.5; for (let k = -5; k < 6; k += 1.4) { c.beginPath(); c.moveTo(HX + k, HY - 5); c.lineTo(HX + k + 0.5, HY - 12.8); c.stroke(); }
        c.beginPath(); c.moveTo(HX - 4, HY - 14.6); c.quadraticCurveTo(HX + 0.6, HY - 17.4, HX + 5.4, HY - 14.2); c.quadraticCurveTo(HX + 0.6, HY - 13, HX - 4, HY - 14.6); c.closePath(); boya(c, '#a8322a', 0.7);
        break; }
      case 'bork': {   // ak keçe börk, altın alınlık; arkaya düşen yatırma
        c.beginPath(); c.moveTo(HX - 6, HY - 4.6); c.quadraticCurveTo(HX - 6.4, HY - 12, HX - 3.4, HY - 18); c.quadraticCurveTo(HX - 8.6, HY - 14, HX - 11, HY - 6.4);
        c.quadraticCurveTo(HX - 8, HY - 6.4, HX - 6, HY - 4.6); c.closePath(); boya(c, '#ddd4bc', 0.8);
        c.beginPath(); c.moveTo(HX - 6.2, HY - 4.2); c.quadraticCurveTo(HX - 6, HY - 13, HX - 2.6, HY - 18.4); c.quadraticCurveTo(HX + 3.6, HY - 14, HX + 6.8, HY - 4.4); c.quadraticCurveTo(HX, HY - 6.2, HX - 6.2, HY - 4.2); c.closePath();
        boya(c, '#efe8d4'); c.save(); c.clip(); c.fillStyle = 'rgba(80,60,30,.18)'; c.fillRect(HX - 8, HY - 20, 5, 18); c.restore();
        c.beginPath(); c.moveTo(HX - 6.6, HY - 3.6); c.quadraticCurveTo(HX, HY - 6.4, HX + 7, HY - 3.8); c.lineTo(HX + 6.6, HY - 6); c.quadraticCurveTo(HX, HY - 8.4, HX - 6.4, HY - 5.8); c.closePath(); boya(c, '#c8a23a', 0.7);
        daire(c, HX + 1.4, HY - 6.4, 0.9); boya(c, '#a8322a', 0.4);
        break; }
      case 'migfer': {   // çelik çiçekli miğfer, burun siperi, zincir peçe
        c.beginPath(); c.moveTo(HX - 6.4, HY + 4.6); c.quadraticCurveTo(HX - 8.4, HY + 1, HX - 6.6, HY - 2); c.lineTo(HX - 2, HY - 1); c.lineTo(HX - 2.4, HY + 4.8); c.closePath(); boya(c, '#6e7074', 0.6);
        c.strokeStyle = 'rgba(255,255,255,.25)'; c.lineWidth = 0.4; for (let y = HY - 0.6; y < HY + 4.6; y += 1.2) { c.beginPath(); c.moveTo(HX - 7, y); c.lineTo(HX - 2.4, y); c.stroke(); }
        c.beginPath(); c.moveTo(HX - 7.6, HY - 1.4); c.quadraticCurveTo(HX - 7.2, HY - 11.4, HX + 0.2, HY - 15.6); c.quadraticCurveTo(HX + 7.8, HY - 11, HX + 7.8, HY - 1.6); c.quadraticCurveTo(HX, HY - 3.4, HX - 7.6, HY - 1.4); c.closePath(); boya(c, '#9ea2a8');
        c.save(); c.clip(); c.fillStyle = 'rgba(0,0,0,.25)'; c.fillRect(HX - 9, HY - 17, 6, 16); c.fillStyle = 'rgba(255,255,255,.55)'; elips(c, HX + 3.2, HY - 9, 1.2, 3.6, 0.5); c.fill(); c.restore();
        c.strokeStyle = '#c8a23a'; c.lineWidth = 1.1; c.beginPath(); c.moveTo(HX - 7.4, HY - 2.4); c.quadraticCurveTo(HX, HY - 4.6, HX + 7.6, HY - 2.6); c.stroke();
        yol(c, [HX - 0.6, HY - 15.4, HX + 0.4, HY - 19.4, HX + 1.4, HY - 15.4]); boya(c, '#9ea2a8', 0.6);
        yol(c, [HX + 4.2, HY - 3, HX + 5.4, HY - 3, HX + 5.2, HY + 3.4, HX + 4.4, HY + 3.4]); boya(c, '#8a8e94', 0.55);
        break; }
      case 'sarik': {   // ak kavuk sarığı, al külah ve sorguç
        c.beginPath(); c.moveTo(HX - 3.6, HY - 8); c.quadraticCurveTo(HX - 2, HY - 17, HX + 1.6, HY - 17.6); c.quadraticCurveTo(HX + 4.4, HY - 14, HX + 4, HY - 8); c.closePath(); boya(c, '#a8322a', 0.7);
        elips(c, HX + 0.2, HY - 6.2, 8.8, 5.2); boya(c, '#f0ecdc');
        c.save(); elips(c, HX + 0.2, HY - 6.2, 8.8, 5.2); c.clip();
        c.strokeStyle = 'rgba(120,100,70,.45)'; c.lineWidth = 0.6;
        for (let k = -2; k < 3; k++) { c.beginPath(); c.moveTo(HX - 9, HY - 6 + k * 2.2); c.quadraticCurveTo(HX, HY - 9 + k * 2.2, HX + 9, HY - 5 + k * 2.6); c.stroke(); }
        c.fillStyle = 'rgba(0,0,0,.18)'; c.fillRect(HX - 10, HY - 3.6, 20, 4); c.restore();
        // sorguç (tüy) ve mücevher
        c.beginPath(); c.moveTo(HX + 2.6, HY - 9.4); c.quadraticCurveTo(HX - 0.6, HY - 18, HX - 4.6 + Math.sin(t * 4) * 0.8, HY - 22); c.quadraticCurveTo(HX + 0.6, HY - 17, HX + 3.6, HY - 10); c.closePath(); boya(c, '#efe8d4', 0.55);
        daire(c, HX + 3, HY - 9.4, 1.2); boya(c, '#2f8a5a', 0.5);
        break; }
      case 'bere': {   // humbaracı: al keçe külah, püskül
        c.beginPath(); c.moveTo(HX - 6.8, HY - 3); c.quadraticCurveTo(HX - 6.6, HY - 12, HX + 1, HY - 12.6); c.quadraticCurveTo(HX + 7.4, HY - 11, HX + 7, HY - 3.2); c.quadraticCurveTo(HX, HY - 5, HX - 6.8, HY - 3); c.closePath(); boya(c, '#a8322a');
        c.save(); c.clip(); c.fillStyle = 'rgba(0,0,0,.25)'; c.fillRect(HX - 8, HY - 14, 5, 12); c.restore();
        c.beginPath(); c.moveTo(HX - 7, HY - 2.4); c.quadraticCurveTo(HX, HY - 4.8, HX + 7.4, HY - 2.6); c.lineTo(HX + 7.2, HY - 4.4); c.quadraticCurveTo(HX, HY - 6.6, HX - 6.8, HY - 4.2); c.closePath(); boya(c, '#2a2420', 0.6);
        c.beginPath(); c.moveTo(HX + 1, HY - 12.6); c.quadraticCurveTo(HX - 5, HY - 13, HX - 7.2, HY - 8 + Math.sin(t * 5)); c.strokeStyle = '#1e130b'; c.lineWidth = 0.9; c.stroke();
        elips(c, HX - 7.4, HY - 6.8 + Math.sin(t * 5), 1.1, 2); boya(c, '#2a2420', 0.5);
        break; }
      case 'deli': {   // deli serpuşu: pars postu kalpak, kartal kanatları
        for (const [a, b, d] of [[-5, -12, 0], [-3, -13.4, 1]]) {
          c.beginPath(); c.moveTo(HX + a, HY + b);
          c.quadraticCurveTo(HX - 14 - d * 3, HY - 20 - d * 6, HX - 21 - d * 2, HY - 14 - d * 8);
          c.quadraticCurveTo(HX - 14 - d * 2, HY - 14 - d * 4, HX + a + 2, HY + b + 1.6); c.closePath(); boya(c, d ? '#f4ecd8' : '#d8ccb0', 0.7);
          c.strokeStyle = 'rgba(80,60,30,.45)'; c.lineWidth = 0.4;
          for (let k = 1; k < 5; k++) { const q = k / 5; c.beginPath(); c.moveTo(HX + a - q * (18 + d * 3), HY + b - q * (6 + d * 5)); c.lineTo(HX + a - q * (18 + d * 3) + 1.6, HY + b - q * (6 + d * 5) + 2.4); c.stroke(); }
        }
        c.beginPath(); c.moveTo(HX - 7, HY - 3.6); c.quadraticCurveTo(HX - 7.6, HY - 13.6, HX + 0.6, HY - 14.6); c.quadraticCurveTo(HX + 7.8, HY - 13, HX + 7.2, HY - 3.8); c.quadraticCurveTo(HX, HY - 5.6, HX - 7, HY - 3.6); c.closePath(); boya(c, '#c8923a');
        c.fillStyle = '#4a2a10'; for (const [x, y] of [[-4, -11], [0, -12.4], [4, -10.6], [-2, -7.6], [2.6, -7.2], [5.4, -6.6], [-5.4, -6.6]]) { daire(c, HX + x, HY + y, 0.9); c.fill(); }
        c.beginPath(); c.moveTo(HX - 7.2, HY - 2.6); c.quadraticCurveTo(HX, HY - 5, HX + 7.4, HY - 2.8); c.lineTo(HX + 7.2, HY - 4.4); c.quadraticCurveTo(HX, HY - 6.6, HX - 7, HY - 4.2); c.closePath(); boya(c, '#c8a23a', 0.6);
        break; }
      case 'tolga': {   // tolga: altın yaldızlı başlık, burun siperi, al sorguç
        c.beginPath(); c.moveTo(HX - 7.8, HY - 1); c.quadraticCurveTo(HX - 7.6, HY - 11.6, HX, HY - 13.4); c.quadraticCurveTo(HX + 7.8, HY - 11.6, HX + 8, HY - 1.2); c.quadraticCurveTo(HX, HY - 3.4, HX - 7.8, HY - 1); c.closePath(); boya(c, '#c4c6ca');
        c.save(); c.clip(); c.fillStyle = 'rgba(0,0,0,.24)'; c.fillRect(HX - 9, HY - 15, 6, 14); c.fillStyle = 'rgba(255,255,255,.6)'; elips(c, HX + 3.4, HY - 8.4, 1.1, 3, 0.5); c.fill();
        c.strokeStyle = '#c8a23a'; c.lineWidth = 0.6; for (let k = -2; k <= 2; k++) { c.beginPath(); c.moveTo(HX + k * 2.8, HY - 1.6); c.quadraticCurveTo(HX + k * 1.4, HY - 9, HX, HY - 13); c.stroke(); } c.restore();
        c.strokeStyle = '#c8a23a'; c.lineWidth = 1.2; c.beginPath(); c.moveTo(HX - 7.6, HY - 1.8); c.quadraticCurveTo(HX, HY - 4, HX + 7.8, HY - 2); c.stroke();
        yol(c, [HX - 1.4, HY - 13, HX - 0.4, HY - 17.6, HX + 0.6, HY - 17.6, HX + 1.4, HY - 13]); boya(c, '#c8a23a', 0.6);
        const sw = Math.sin(t * 6) * 0.15;
        c.save(); c.translate(HX, HY - 17.4); c.rotate(-0.5 + sw);
        c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(-4, -3.6, -10, -2); c.quadraticCurveTo(-6, 0.6, 0, 1); c.closePath(); boya(c, '#c0302a', 0.6);
        cizgi(c, -1, 0.2, -8, -1.6, '#e8705a', 0.5); c.restore();
        yol(c, [HX + 4, HY - 2.4, HX + 5.2, HY - 2.4, HX + 5, HY + 4, HX + 4.2, HY + 4]); boya(c, '#c4c6ca', 0.5);
        break; }
    }
  }
  function yaratikBas(c, L) {
    const t = T(), hd = L.head;
    if (hd === 'sac') {   // Albastı: uzun dağınık saç arkaya savrulur
      c.beginPath(); c.moveTo(HX - 4, HY - 6); c.quadraticCurveTo(HX - 16, HY - 2 + Math.sin(t * 3) * 1.5, HX - 13, HY + 22); c.quadraticCurveTo(HX - 8, HY + 12, HX - 3, HY + 16);
      c.quadraticCurveTo(HX - 4, HY + 6, HX - 1, HY + 4); c.closePath(); boya(c, '#3a0a10');
      c.strokeStyle = 'rgba(200,80,100,.35)'; c.lineWidth = 0.5; for (let k = 0; k < 4; k++) { c.beginPath(); c.moveTo(HX - 5 - k, HY - 3); c.quadraticCurveTo(HX - 13 - k, HY + 4, HX - 11 - k * 0.4, HY + 18); c.stroke(); }
    }
    if (hd === 'kukuleta') {   // kukuleta içinde karanlık, iki parlak göz
      c.beginPath(); c.moveTo(HX - 8.4, HY + 5); c.quadraticCurveTo(HX - 10, HY - 8, HX - 1, HY - 11.6); c.quadraticCurveTo(HX + 8, HY - 9, HX + 8.6, HY + 4); c.quadraticCurveTo(HX, HY + 7, HX - 8.4, HY + 5); c.closePath(); boya(c, L.cloth);
      c.save(); c.clip(); c.fillStyle = 'rgba(0,0,0,.3)'; c.fillRect(HX - 11, HY - 12, 6, 20); c.restore();
      elips(c, HX + 3, HY + 0.6, 5, 6); c.fillStyle = '#07060e'; c.fill();
      parlakGoz(c, HX + 1.8, HY - 0.4, 1.1, L.eye); parlakGoz(c, HX + 5, HY - 0.4, 1.1, L.eye);
      return;
    }
    if (hd === 'alev') {   // Ateş Cini: alev saç, köz yüz
      const f = Math.sin(t * 14) * 2;
      hale(c, HX, HY - 6, 16, '#ff7a1f', 0.6);
      c.beginPath(); c.moveTo(HX - 8, HY + 4); c.quadraticCurveTo(HX - 11, HY - 10, HX - 3, HY - 20 + f); c.quadraticCurveTo(HX - 1, HY - 12, HX + 2, HY - 24 - f); c.quadraticCurveTo(HX + 6, HY - 14, HX + 8, HY - 17 + f); c.quadraticCurveTo(HX + 11, HY - 6, HX + 8, HY + 4); c.closePath(); boya(c, '#ff7a1f', 0.7, '#5a1a0a');
      c.beginPath(); c.moveTo(HX - 5, HY + 3); c.quadraticCurveTo(HX - 6, HY - 8, HX, HY - 15 - f * 0.5); c.quadraticCurveTo(HX + 6, HY - 8, HX + 5, HY + 3); c.closePath(); c.fillStyle = '#ffc04a'; c.fill();
      daire(c, HX, HY - 1, 5.4); c.fillStyle = '#ffe9a0'; c.fill();
      c.fillStyle = '#5a1a0a'; elips(c, HX + 3, HY - 2.4, 1.1, 1.6); c.fill(); elips(c, HX - 0.6, HY - 2.4, 1.1, 1.6); c.fill();
      c.beginPath(); c.arc(HX + 1.4, HY + 0.6, 2, 0.2, PI - 0.2); c.strokeStyle = '#5a1a0a'; c.lineWidth = 0.8; c.stroke();
      return;
    }
    if (hd === 'yedi') {   // Yelbegen: yedi baş yay biçiminde, küçük boynuzlar (evren kitabı)
      const P7 = [[-12, 4], [-9, -3], [-4, -8], [2, -10], [8, -8], [12, -2], [14, 5]];
      for (const [dx, dy] of P7) {
        const x = HX + dx, y = HY + dy;
        kapsul(c, HX, HY + 6, x, y, 2.2, 1.8); boya(c, ton(L.skin, -0.12), 0.6);
      }
      for (const [dx, dy] of P7) {
        const x = HX + dx, y = HY + dy;
        for (const s of [-1, 1]) { yol(c, [x + s * 2.4, y - 2.4, x + s * 3.6, y - 6.8, x + s * 0.8, y - 3.2]); boya(c, '#d8ccb0', 0.45); }
        daire(c, x, y, 3.9); boya(c, L.skin, 0.65);
        daire(c, x - 1, y + 1, 3); c.fillStyle = 'rgba(0,0,0,.15)'; c.fill();
        parlakGoz(c, x + 1.4, y - 0.4, 0.8, L.eye);
        cizgi(c, x + 0.6, y + 1.8, x + 3, y + 1.6, OL, 0.5);
      }
      return;
    }
    const r = hd === 'tek' ? 8.5 : 6.5;
    if (hd === 'kulak') {   // Gulyabani: sivri uzun kulak
      yol(c, [HX - 3, HY - 4, HX - 12, HY - 15, HX + 1, HY - 6]); boya(c, L.skin, 0.75);
      yol(c, [HX - 3.4, HY - 5.4, HX - 9.6, HY - 12.4, HX - 0.6, HY - 6.4]); c.fillStyle = ton(L.skin, -0.3); c.fill();
    }
    if (hd === 'kurt') {   // Kurtbaşı: kurt kafası, uzun burun
      yol(c, [HX - 5, HY - 4, HX - 4, HY - 15, HX + 1, HY - 6]); boya(c, L.skin, 0.75);
      yol(c, [HX - 4.4, HY - 6, HX - 3.8, HY - 12, HX - 0.6, HY - 6.6]); c.fillStyle = '#c8a8a0'; c.fill();
      c.beginPath(); c.moveTo(HX + 2, HY - 4.6); c.quadraticCurveTo(HX + 9, HY - 3, HX + 14.6, HY + 0.4); c.quadraticCurveTo(HX + 14.4, HY + 3.6, HX + 11, HY + 4.4); c.lineTo(HX + 2, HY + 4.6); c.closePath(); boya(c, L.skin);
      cizgi(c, HX + 5, HY + 3, HX + 13.4, HY + 2.6, OL, 0.6);
      daire(c, HX + 14.4, HY + 0.6, 1.5); c.fillStyle = '#111'; c.fill();
      c.fillStyle = '#efe6c4'; yol(c, [HX + 8, HY + 3, HX + 8.8, HY + 5.6, HX + 9.6, HY + 3]); c.fill(); yol(c, [HX + 11, HY + 2.8, HX + 11.7, HY + 5.2, HX + 12.4, HY + 2.8]); c.fill();
    }
    if (hd === 'boynuz') {   // Karakoncolos: kırağılı post, boynuz (Kırmızı Yalı / Tamga Yolu ile aynı yüz)
      for (const s of [-1, 1]) {
        c.beginPath(); c.moveTo(HX + s * 3 - 1.2, HY - 5); c.quadraticCurveTo(HX + s * 10, HY - 14, HX + s * 4, HY - 20.4); c.quadraticCurveTo(HX + s * 7, HY - 13, HX + s * 3 + 1.4, HY - 4.4); c.closePath();
        boya(c, '#d8c8a0', 0.7); cizgi(c, HX + s * 5.2, HY - 9, HX + s * 6.6, HY - 10, 'rgba(90,70,40,.6)', 0.5);
      }
    }
    if (hd === 'tek') { daire(c, HX, HY, r); boya(c, L.skin); }
    else if (hd === 'demir') {   // Demir Cin: kapalı demir başlık, yarık siperde köz göz
      daire(c, HX, HY, 8); boya(c, '#4a4e56');
      c.save(); daire(c, HX, HY, 8); c.clip(); c.fillStyle = 'rgba(255,255,255,.22)'; elips(c, HX + 3, HY - 4, 2, 4, 0.6); c.fill(); c.fillStyle = 'rgba(0,0,0,.3)'; c.fillRect(HX - 9, HY - 9, 5, 18); c.restore();
      c.fillStyle = '#16181c'; c.fillRect(HX - 1, HY - 3.4, 9, 3.2);
      hale(c, HX + 4.6, HY - 1.8, 6, L.eye, 0.6); c.fillStyle = L.eye; c.fillRect(HX + 1.6, HY - 2.6, 5.4, 1.6);
      for (const [x, y] of [[-5, 3], [-2, 5.6], [2, 5.8], [5.6, 3.8]]) { daire(c, HX + x, HY + y, 0.7); c.fillStyle = '#9aa0a8'; c.fill(); }
      cizgi(c, HX - 6.6, HY + 4, HX + 7.4, HY + 4, '#8a8e96', 1.2);
      return;
    }
    else { yuz(c, L, r); }
    switch (hd) {
      case 'kulak': case 'kel': case 'sac': case 'kurt': break;
      case 'boynuz':
        c.strokeStyle = ton(L.skin, -0.45); c.lineWidth = 1.1; for (let k = -2; k < 3; k++) { c.beginPath(); c.moveTo(HX + k * 2.6, HY - 6); c.quadraticCurveTo(HX + k * 2.6 - 2, HY, HX + k * 3 - 1.4, HY + 7.6); c.stroke(); }
        c.strokeStyle = 'rgba(230,240,255,.5)'; c.lineWidth = 0.5; for (let k = -2; k < 3; k++) { c.beginPath(); c.moveTo(HX + k * 2.6 + 0.6, HY - 5.6); c.lineTo(HX + k * 2.6 - 0.2, HY - 2.6); c.stroke(); }
        break;
      case 'cadi': {
        c.beginPath(); c.moveTo(HX - 5, HY - 3); c.quadraticCurveTo(HX - 12, HY + 6, HX - 10, HY + 13); c.quadraticCurveTo(HX - 6, HY + 6, HX - 2.6, HY + 2); c.closePath(); boya(c, '#cfcfc8', 0.6);
        c.beginPath(); c.moveTo(HX + 5, HY - 1.4); c.quadraticCurveTo(HX + 10.6, HY + 1, HX + 10.4, HY + 4.2); c.quadraticCurveTo(HX + 8, HY + 2.6, HX + 5.4, HY + 2.2); c.closePath(); boya(c, L.skin, 0.6);
        daire(c, HX + 8.4, HY + 2.6, 0.7); c.fillStyle = ton(L.skin, -0.4); c.fill();
        elips(c, HX, HY - 5, 12.4, 2.6); boya(c, '#16101a', 0.7);
        c.beginPath(); c.moveTo(HX - 6.4, HY - 5.6); c.quadraticCurveTo(HX - 4, HY - 14, HX - 9, HY - 25); c.quadraticCurveTo(HX + 2, HY - 16, HX + 6.4, HY - 5.6); c.closePath(); boya(c, '#16101a', 0.7);
        c.fillStyle = '#4a2a4a'; c.fillRect(HX - 6, HY - 8.4, 12.2, 2);
        break; }
      case 'muhafiz': {
        c.beginPath(); c.arc(HX, HY - 1, 8, PI, 0); c.lineTo(HX + 8, HY + 1); c.lineTo(HX - 8, HY + 1); c.closePath(); boya(c, '#2a1a2a');
        yol(c, [HX + 2, HY - 2, HX + 7.4, HY - 2, HX + 7, HY + 6, HX + 2.4, HY + 6]); boya(c, '#2a1a2a', 0.6);
        for (const [a, b, cx, cy, ex, ey] of [[-5, -6, -14, -10, -12, -20], [4, -7, 8, -16, 3, -21]]) {
          c.beginPath(); c.moveTo(HX + a - 1, HY + b); c.quadraticCurveTo(HX + cx, HY + cy, HX + ex, HY + ey); c.quadraticCurveTo(HX + cx * 0.6, HY + cy * 0.8 + 2, HX + a + 1.4, HY + b + 1); c.closePath(); boya(c, '#d8c8a0', 0.6);
        }
        parlakGoz(c, HX + 4.4, HY - 0.4, 1.2, L.eye);
        return; }
      case 'erlik': {
        c.beginPath(); c.arc(HX, HY - 2, 7.6, PI, 0); c.closePath(); boya(c, '#120810');
        for (let k = -2; k <= 2; k++) { yol(c, [HX + k * 3 - 1.6, HY - 7, HX + k * 3, HY - 15 - (2 - Math.abs(k)) * 3, HX + k * 3 + 1.6, HY - 7]); boya(c, '#c8a23a', 0.55); }
        hale(c, HX, HY - 14, 9, '#ff2a2a', 0.35);
        c.beginPath(); c.moveTo(HX - 6, HY - 4); c.quadraticCurveTo(HX - 16, HY - 6, HX - 14, HY - 18); c.quadraticCurveTo(HX - 12.6, HY - 8, HX - 4.6, HY - 2.4); c.closePath(); boya(c, '#d8c8a0', 0.6);
        c.beginPath(); c.moveTo(HX - 1, HY + 3); c.quadraticCurveTo(HX + 1, HY + 12, HX + 4, HY + 13); c.quadraticCurveTo(HX + 7, HY + 9, HX + 6.4, HY + 3); c.closePath(); boya(c, '#2a1a1a', 0.6);
        break; }
      case 'tek': {   // Tepegöz: tek büyük göz
        cizgi(c, HX - 1, HY - 6.6, HX + 7.4, HY - 5.4, '#3a2a1a', 1.4);
        elips(c, HX + 3, HY - 1, 4.2, 4); boya(c, '#f4ecd0', 0.7);
        daire(c, HX + 4.2, HY - 0.8, 2.2); c.fillStyle = L.eye; c.fill(); daire(c, HX + 4.6, HY - 0.8, 1); c.fillStyle = '#000'; c.fill();
        daire(c, HX + 3.4, HY - 2, 0.7); c.fillStyle = '#fff'; c.fill();
        c.beginPath(); c.moveTo(HX + 1, HY + 5); c.quadraticCurveTo(HX + 4.6, HY + 6.6, HX + 7.6, HY + 4.4); c.strokeStyle = OL; c.lineWidth = 0.8; c.stroke();
        c.fillStyle = '#efe6c4'; yol(c, [HX + 3, HY + 5.4, HX + 3.6, HY + 7.4, HX + 4.2, HY + 5.6]); c.fill();
        return; }
    }
    // yaratık yüzü: kaş çizgisi, parlak göz, sivri diş
    if (hd !== 'kurt') { cizgi(c, HX + 1.6, HY - 3.6, HX + 6, HY - 2.4, OL, 0.9); }
    parlakGoz(c, HX + 3.6, HY - 1.2, 1.3, L.eye);
    if (hd === 'kulak' || hd === 'kel' || hd === 'sac' || hd === 'boynuz') {
      c.beginPath(); c.moveTo(HX + 2.4, HY + 3); c.quadraticCurveTo(HX + 4.6, HY + 4.4, HX + 6.6, HY + 2.6); c.strokeStyle = OL; c.lineWidth = 0.7; c.stroke();
      c.fillStyle = '#f4ecd0'; yol(c, [HX + 3.4, HY + 3.4, HX + 3.9, HY + 5.2, HX + 4.4, HY + 3.6]); c.fill(); yol(c, [HX + 5.2, HY + 3.4, HX + 5.7, HY + 5, HX + 6.2, HY + 3.1]); c.fill();
    }
  }

  /* ---------- KOL VE SİLAH ---------- */
  function kolAcisi(L, atk) {
    switch (L.wpn) {
      case 'kilic': case 'kizil': case 'ejder': return -1.0 + atk * 1.5;
      case 'yay': return -0.15; case 'kalkan': return -0.8 + atk * 1.2; case 'mizrak': return 0.05;
      case 'humbara': return -2.2 + atk * 2.4; case 'pence': return -0.4 + atk * 1.1; case 'asa': return -0.3 - atk * 0.6;
      case 'sopa': case 'cekic': case 'balta': case 'gurz': return -1.3 + atk * 1.9;
      case 'yok': return -0.2 - atk * 0.5; case 'mesale': return -1.1; case 'kopuz': return 0.5 + Math.sin(T() * 8) * 0.15;
    }
    return 0;
  }
  function kilic(c, x, y, boy, renk, parla) {
    // pala: kavisli ağız, kabzada altın balçak
    c.beginPath(); c.moveTo(x, y - 1.1); c.quadraticCurveTo(x + boy * 0.55, y - 2.4, x + boy, y - 7.4); c.quadraticCurveTo(x + boy * 0.6, y + 0.4, x, y + 1); c.closePath();
    boya(c, renk || '#e4e8ee', 0.7);
    cizgi(c, x + 2, y - 0.6, x + boy * 0.8, y - 4.6, 'rgba(255,255,255,.75)', 0.5);
    if (parla) hale(c, x + boy * 0.6, y - 3.4, 9, parla, 0.5);
    yol(c, [x - 0.8, y - 4, x + 0.8, y - 4, x + 0.8, y + 4, x - 0.8, y + 4]); boya(c, '#c8a23a', 0.55);
  }
  function kolVeSilah(c, L, atk) {
    const a = kolAcisi(L, atk), t = T();
    c.save(); c.translate(1 + (L.wpn === 'mizrak' ? atk * 8 : 0), -19); c.rotate(a);
    // yen
    kapsul(c, 0, 0, 9.6, 0, 2.6, 2.1); boya(c, L.cloth, 0.8);
    cizgi(c, 1, 1.4, 8.6, 1.2, 'rgba(0,0,0,.25)', 1);
    if (L.cloth2 && !L.eye) { yol(c, [7.6, -2.3, 9.8, -2.1, 9.8, 2.1, 7.6, 2.3]); boya(c, L.cloth2, 0.5); }
    // silah (elin arkasında kalan sap) sonra el
    const el = () => { daire(c, 11, 0, 2.3); boya(c, L.skin, 0.7); };
    switch (L.wpn) {
      case 'kilic': el(); kilic(c, 12, 0, 19); break;
      case 'kizil': el(); kilic(c, 12, 0, 24, '#ff5a46', '#ff2a2a'); break;
      case 'ejder': el(); kilic(c, 12, 0, 25, '#ffd27a', '#ffb347'); break;
      case 'kalkan': el(); c.beginPath(); c.moveTo(12, -1); c.lineTo(24, -1.8); c.lineTo(26, -0.6); c.lineTo(12, 1); c.closePath(); boya(c, '#e4e8ee', 0.6); break;
      case 'yay': {   // Türk yayı: çifte kavisli, kirişli
        el();
        c.beginPath(); c.moveTo(4, -13); c.quadraticCurveTo(9, -11, 10, -6); c.quadraticCurveTo(12.4, 0, 10, 6); c.quadraticCurveTo(9, 11, 4, 13);
        c.strokeStyle = OL; c.lineWidth = 3; c.lineCap = 'round'; c.stroke(); c.strokeStyle = '#7a4a24'; c.lineWidth = 1.8; c.stroke();
        cizgi(c, 9.6, -5, 10.6, 5, '#c8a23a', 0.8);
        const pull = atk > 0.5 ? 0 : 4; c.beginPath(); c.moveTo(4, -13); c.lineTo(4 - pull, 0); c.lineTo(4, 13); c.strokeStyle = '#efe6d0'; c.lineWidth = 0.6; c.stroke();
        if (atk < 0.5) { cizgi(c, 4 - pull, 0, 21, 0, '#5a3a1a', 1.1); yol(c, [21, -1.4, 24, 0, 21, 1.4]); boya(c, '#cfd4da', 0.4); yol(c, [-1, -1.6, 2, 0, -1, 1.6]); c.fillStyle = '#a8322a'; c.fill(); }
        break; }
      case 'mizrak': {
        cizgi(c, -14, 0, 36, 0, OL, 3.2); cizgi(c, -14, 0, 36, 0, '#7a5230', 1.8);
        yol(c, [35, -2.8, 46, 0, 35, 2.8]); boya(c, '#e4e8ee', 0.6); cizgi(c, 36, 0, 44, 0, '#9aa0a8', 0.4);
        const fl = L.cloth2 === '#8a2a2a' ? '#3a0a0a' : '#a8322a';
        c.beginPath(); c.moveTo(31, -1); c.quadraticCurveTo(26, -7 + Math.sin(t * 9) * 1.5, 21, -6 + Math.sin(t * 9 + 1) * 1.5); c.lineTo(22, -1); c.closePath(); boya(c, fl, 0.55);
        el(); break; }
      case 'humbara': el(); daire(c, 14, 0, 5.6); boya(c, '#1e1e22', 0.8); daire(c, 12.4, -1.8, 1.6); c.fillStyle = 'rgba(255,255,255,.35)'; c.fill();
        cizgi(c, 16, -4, 17, -7, '#7a5a2a', 0.9); { const f = (t % 0.2 < 0.1); hale(c, 17.4, -7.6, 4, '#ffb347', 0.8); daire(c, 17.4, -7.6, 1.4); c.fillStyle = f ? '#fff2a0' : '#ff6a2a'; c.fill(); } break;
      case 'pence': {
        el(); const pc = L.glow ? '#c8a0ff' : '#efe6c4';
        for (let k = -1; k < 2; k++) { c.beginPath(); c.moveTo(12, k * 2 - 0.6); c.quadraticCurveTo(16, k * 2.4 - 1, 18.6, k * 3 - 1.6); c.lineTo(12.4, k * 2 + 0.8); c.closePath(); boya(c, pc, 0.5); }
        break; }
      case 'asa': {
        const oc = L.orb || '#b48aff';
        cizgi(c, 11, 13, 11, -18, OL, 3); cizgi(c, 11, 13, 11, -18, '#5a4030', 1.8);
        c.beginPath(); c.moveTo(11, -17); c.quadraticCurveTo(7, -21, 9, -25); c.moveTo(11, -17); c.quadraticCurveTo(15, -21, 13, -25); c.strokeStyle = '#5a4030'; c.lineWidth = 1; c.stroke();
        hale(c, 11, -21, 9, oc, 0.7); daire(c, 11, -21, 3.4); c.fillStyle = oc; c.fill(); daire(c, 10, -22, 1.2); c.fillStyle = '#fff'; c.fill();
        el(); break; }
      case 'sopa': {
        el(); c.beginPath(); c.moveTo(10, -1.6); c.lineTo(24, -4.6); c.quadraticCurveTo(31, -9, 34, -2); c.quadraticCurveTo(31, 4, 24, 1.4); c.lineTo(10, 1.8); c.closePath(); boya(c, '#5a3a1a', 0.8);
        cizgi(c, 14, -0.4, 24, -2.4, 'rgba(255,220,180,.25)', 0.7);
        for (const [x, y] of [[29, -6.4], [32.6, -1.6], [28, 1.6]]) { yol(c, [x - 1, y, x, y - 2, x + 1, y]); boya(c, '#9a9a9a', 0.4); }
        break; }
      case 'cekic': {
        el(); cizgi(c, 10, 0, 28, -1, OL, 3.6); cizgi(c, 10, 0, 28, -1, '#4a3420', 2.2);
        yol(c, [23.6, -9, 33, -9, 33, 7, 23.6, 7]); boya(c, '#6a6e76', 0.8);
        c.fillStyle = 'rgba(255,255,255,.25)'; c.fillRect(24.4, -8.2, 2, 14.4);
        hale(c, 28.3, -9, 6, '#ff7a2a', 0.5); c.fillStyle = '#ff9a3a'; c.fillRect(23.6, -9.4, 9.4, 1.8);
        break; }
      case 'balta': {
        el(); cizgi(c, 10, 0, 28, -1, OL, 3); cizgi(c, 10, 0, 28, -1, '#6a4422', 1.8);
        c.beginPath(); c.moveTo(24, -2); c.quadraticCurveTo(31, -13, 35, -1.4); c.quadraticCurveTo(32, 9, 24, 3); c.closePath(); boya(c, '#d8dce4', 0.7);
        c.beginPath(); c.moveTo(33.6, -6); c.quadraticCurveTo(35.6, -1, 33, 4); c.strokeStyle = '#fff'; c.lineWidth = 0.6; c.stroke();
        break; }
      case 'gurz': {   // şeşper gürz
        el(); cizgi(c, 10, 0, 27, -1, OL, 3.4); cizgi(c, 10, 0, 27, -1, '#4a3020', 2);
        for (let k = 0; k < 6; k++) { const an = k * 1.047 + 0.3; yol(c, [30 + Math.cos(an) * 4, -1 + Math.sin(an) * 4, 30 + Math.cos(an + 0.3) * 8, -1 + Math.sin(an + 0.3) * 8, 30 + Math.cos(an + 0.6) * 4, -1 + Math.sin(an + 0.6) * 4]); boya(c, '#b0b6c0', 0.5); }
        daire(c, 30, -1, 5); boya(c, '#8a8f98', 0.7); daire(c, 28.6, -2.6, 1.6); c.fillStyle = 'rgba(255,255,255,.5)'; c.fill();
        break; }
      case 'yok': { el(); const r = 4 + Math.sin(t * 12); hale(c, 13, 0, r * 3, '#ff7a1f', 0.7); daire(c, 13, 0, r); c.fillStyle = '#ffb347'; c.fill(); daire(c, 12.4, -0.6, r * 0.5); c.fillStyle = '#fff2a0'; c.fill(); break; }
      case 'mesale': {
        el(); cizgi(c, 10, 0, 24, 0, OL, 3.6); cizgi(c, 10, 0, 24, 0, '#6a4422', 2.2);
        yol(c, [21, -2.6, 25, -2.6, 25, 2.6, 21, 2.6]); boya(c, '#3a2a1a', 0.5);
        hale(c, 28, -1, 13, '#ff9a3a', 0.6);
        c.beginPath(); c.moveTo(24, -3); c.quadraticCurveTo(32 + Math.sin(t * 14) * 2, -4, 31, 3.6); c.quadraticCurveTo(28, 8, 24, 3); c.closePath(); c.fillStyle = '#ff8a2a'; c.fill();
        daire(c, 27, 0.6, 2.2); c.fillStyle = '#fff2a0'; c.fill();
        break; }
      case 'kopuz': {   // kopuz: oyma gövde, uzun sap, iki tel
        c.beginPath(); c.moveTo(6.4, 4); c.quadraticCurveTo(8, -1.4, 14, 0.4); c.quadraticCurveTo(19, 2, 17, 6.8); c.quadraticCurveTo(12, 10.4, 6.4, 4); c.closePath(); boya(c, '#9a6634', 0.8);
        elips(c, 12.6, 4.4, 2.6, 2); c.fillStyle = '#c8a26a'; c.fill();
        cizgi(c, 15, 2, 31, -6.4, OL, 2.6); cizgi(c, 15, 2, 31, -6.4, '#6b4a2e', 1.5);
        cizgi(c, 30, -6, 32.6, -8.6, '#3a2a1a', 1.4);
        cizgi(c, 9, 4, 30.6, -6.8, '#efe6d0', 0.4); cizgi(c, 9, 5, 30.8, -6, '#efe6d0', 0.4);
        el(); break; }
      default: el();
    }
    c.restore();
    if (L.wpn === 'kalkan') {   // yuvarlak Türk kalkanı (yandan): hasır örgü, tunç göbek, altın kenar
      c.save(); c.translate(9.4, -11);
      elips(c, 0, 0, 6, 12.4); boya(c, '#a8322a', 1);
      c.save(); elips(c, 0, 0, 6, 12.4); c.clip();
      c.strokeStyle = 'rgba(255,220,150,.35)'; c.lineWidth = 0.6; for (let k = -3; k <= 3; k++) { elips(c, 0, 0, 5.2 - Math.abs(k) * 0.2, 11 - Math.abs(k) * 1.4); }
      for (let r = 2; r < 12; r += 2.6) { elips(c, 0, 0, r * 0.48, r); c.stroke(); }
      c.fillStyle = 'rgba(0,0,0,.2)'; c.fillRect(-7, -13, 4, 26); c.restore();
      elips(c, 0, 0, 6, 12.4); c.strokeStyle = '#c8a23a'; c.lineWidth = 1.3; c.stroke();
      elips(c, 0.6, 0, 2.2, 3.2); boya(c, '#d8b050', 0.6); daire(c, 0.2, -1, 0.8); c.fillStyle = '#fff4c0'; c.fill();
      c.restore();
    }
  }

  /* ---------- İNSAN / YARATIK ---------- */
  function fig(c, L, walk, atk, moving) {
    if (L.dragon) return ejder(c, L, walk, atk, moving);
    if (L.beast) return kurt(c, L, walk, atk, moving);
    const sw = moving ? Math.sin(walk) * 6 : 0;
    c.save(); c.lineCap = 'round'; c.lineJoin = 'round';
    if (L.glow) hale(c, 0, -24, 26, L.glow, 0.45);
    if (L.cape) {   // pelerin: arkaya savrulur
      const fl = Math.sin(T() * 5) * 1.2;
      c.beginPath(); c.moveTo(-3, -38); c.quadraticCurveTo(-17 - Math.abs(sw) + fl, -22, -14 - Math.abs(sw) * 0.5 + fl, -3); c.quadraticCurveTo(-8, -1, -3, -6); c.lineTo(-2, -18); c.closePath();
      boya(c, L.cape); c.save(); c.clip(); c.fillStyle = 'rgba(0,0,0,.25)'; c.fillRect(-20, -40, 9, 40); c.restore();
      cizgi(c, -6, -30, -11 - Math.abs(sw) * 0.6, -6, ton(L.cape, -0.3), 0.7);
    }
    const insan = !L.eye;
    const oturan = binik; binik = false;
    if (oturan) c.translate(0, 6);   // eyere otur
    if (oturan && !L.float) oturBacak(c, L);
    else if (!L.float) { bacak(c, L, -1, -sw, true); bacak(c, L, 1, sw, false); }
    c.translate(0, -17); c.rotate(L.hunch || 0);
    if (L.float) cubbe(c, L);
    else if (insan) kaftan(c, L);
    else yirtikGovde(c, L);
    if (L.plate) zirh(c, L);
    if (L.hairy) kurkUst(c, L);
    if (L.spots) { c.fillStyle = '#4a2a10'; for (const [x, y] of [[-4, -19], [2, -15], [-2, -12.4], [4, -20], [-4.6, -14]]) { elips(c, x, y, 1.2, 0.9); c.fill(); } }
    if (insan) { insanYuz(c, L); serpus(c, L); } else yaratikBas(c, L);
    kolVeSilah(c, L, atk);
    c.restore();
  }

  /* ---------- BOZKURT ---------- */
  function kurt(c, L, walk, atk, moving) {
    const sw = moving ? Math.sin(walk * 1.6) * 7 : 0, t = T();
    c.save(); c.lineCap = 'round'; c.lineJoin = 'round';
    const bc = L.cloth, dk = L.cloth2;
    const ayak = (x, dx, arka) => { kapsul(c, x, -10, x + dx, -0.6, 2, 1.4); boya(c, arka ? ton(dk, -0.2) : dk, 0.7); elips(c, x + dx + 0.8, -0.4, 2, 1); boya(c, ton(dk, -0.3), 0.5); };
    ayak(-9, -sw, true); ayak(7, sw, true);
    // kuyruk
    c.beginPath(); c.moveTo(-11, -15); c.quadraticCurveTo(-21, -21, -25, -12 + Math.sin(t * 10) * 2); c.quadraticCurveTo(-19, -12.6, -11, -11); c.closePath(); boya(c, bc);
    cizgi(c, -22, -14 + Math.sin(t * 10) * 1.6, -24.4, -12 + Math.sin(t * 10) * 2, '#eef0f2', 1.4);
    // gövde
    c.beginPath(); c.moveTo(-12, -13); c.quadraticCurveTo(-12, -20, -2, -19.6); c.quadraticCurveTo(9, -20.6, 13, -16); c.quadraticCurveTo(14, -9, 8, -8);
    c.quadraticCurveTo(0, -6.4, -8, -8); c.quadraticCurveTo(-12.6, -8.6, -12, -13); c.closePath(); boya(c, bc);
    c.save(); c.clip(); c.fillStyle = '#d8dce2'; elips(c, 1, -7.4, 11, 3); c.fill(); c.fillStyle = 'rgba(0,0,0,.18)'; elips(c, -4, -19, 10, 3); c.fill(); c.restore();
    c.strokeStyle = ton(bc, -0.3); c.lineWidth = 0.5; for (let k = 0; k < 5; k++) { c.beginPath(); c.moveTo(-8 + k * 4, -17); c.lineTo(-9 + k * 4, -14); c.stroke(); }
    ayak(-5, sw, false); ayak(11, -sw, false);
    // yele ve baş
    c.beginPath(); c.moveTo(8, -21); c.quadraticCurveTo(13, -25, 18, -23); c.quadraticCurveTo(21, -20, 20, -16); c.lineTo(11, -12); c.closePath(); boya(c, ton(bc, -0.08));
    c.beginPath(); c.moveTo(11, -23); c.lineTo(12, -30.4); c.lineTo(16.6, -23.6); c.closePath(); boya(c, bc, 0.75);
    yol(c, [12.4, -24, 12.8, -28, 15, -24]); c.fillStyle = '#c8a8a0'; c.fill();
    c.beginPath(); c.moveTo(13, -23); c.quadraticCurveTo(18, -24.4, 21, -21.4); c.lineTo(27.6, -18.4); c.quadraticCurveTo(28, -16, 26, -15.4); c.lineTo(18, -14.6); c.quadraticCurveTo(13, -15, 13, -23); c.closePath(); boya(c, bc);
    elips(c, 22, -15.6, 4.4, 1.4); c.fillStyle = '#e4e6ea'; c.fill();
    daire(c, 27.4, -18, 1.3); c.fillStyle = '#111'; c.fill();
    if (atk > 0.3) { c.fillStyle = '#efe6c4'; yol(c, [21, -15.6, 21.6, -13.4, 22.2, -15.6]); c.fill(); yol(c, [24, -15.4, 24.6, -13.6, 25.2, -15.4]); c.fill(); }
    parlakGoz(c, 19.4, -20.4, 1.1, L.eye);
    c.restore();
  }

  /* ---------- AT ---------- */
  let binik = false;   // at çizildikten hemen sonra çizilen asker eyerde oturur
  function at(c, walk, col, moving) {
    binik = true;
    const s = moving ? Math.sin(walk) * 8 : 0, t = T();
    c.save(); c.lineCap = 'round'; c.lineJoin = 'round';
    const koyu = ton(col, -0.25), yele = ton(col, -0.55);
    const bacakC = (x, dx, arka) => {
      const cc = arka ? koyu : col;
      kapsul(c, x, -17, x + dx * 0.6, -8, 2.6, 1.7); boya(c, cc, 0.75);
      kapsul(c, x + dx * 0.6, -8, x + dx, -1.6, 1.7, 1.3); boya(c, cc, 0.75);
      yol(c, [x + dx - 1.6, -2.2, x + dx + 1.8, -2.2, x + dx + 2.2, 0.4, x + dx - 1.8, 0.4]); boya(c, '#2a1a10', 0.6);
    };
    bacakC(-13, s, true); bacakC(10, -s, true);
    // kuyruk
    c.beginPath(); c.moveTo(-16, -25); c.quadraticCurveTo(-25, -22, -26, -9 + Math.sin(t * 7) * 2); c.quadraticCurveTo(-22, -14, -15, -21); c.closePath(); boya(c, yele, 0.75);
    // gövde
    c.beginPath(); c.moveTo(-17, -22); c.quadraticCurveTo(-17, -29, -8, -28.6); c.quadraticCurveTo(4, -28, 12, -27); c.quadraticCurveTo(19, -25, 18, -18.6);
    c.quadraticCurveTo(12, -13.4, 2, -14); c.quadraticCurveTo(-10, -13.6, -15, -15.4); c.quadraticCurveTo(-17.6, -18, -17, -22); c.closePath(); boya(c, col);
    c.save(); c.clip(); c.fillStyle = 'rgba(0,0,0,.2)'; elips(c, 0, -13, 20, 3.4); c.fill(); c.fillStyle = 'rgba(255,240,220,.18)'; elips(c, -2, -27, 13, 2); c.fill(); c.restore();
    // boyun ve baş
    c.beginPath(); c.moveTo(9, -27); c.quadraticCurveTo(15, -36, 21, -40); c.quadraticCurveTo(25, -40, 26.6, -37); c.lineTo(17, -19); c.closePath(); boya(c, col);
    c.beginPath(); c.moveTo(20, -40.4); c.quadraticCurveTo(27, -41, 32.6, -35.4); c.quadraticCurveTo(34, -32.4, 31, -31.6); c.quadraticCurveTo(26, -32.6, 22.6, -33.6); c.closePath(); boya(c, col);
    yol(c, [21, -40, 21.6, -44, 23.6, -40.6]); boya(c, col, 0.6);
    daire(c, 26, -37.4, 0.9); c.fillStyle = '#111'; c.fill(); daire(c, 25.8, -37.7, 0.3); c.fillStyle = '#fff'; c.fill();
    daire(c, 32, -33.4, 0.6); c.fillStyle = '#111'; c.fill();
    // yele
    c.beginPath(); c.moveTo(21, -41); c.quadraticCurveTo(14, -38, 9, -28);
    for (let k = 0; k < 5; k++) c.quadraticCurveTo(9 + k * 2.2 - 3, -31 - k * 2.4 + Math.sin(t * 7 + k), 10.6 + k * 2.2, -30 - k * 2.4);
    c.closePath(); boya(c, yele, 0.6);
    // koşum: gem, dizgin, eyer örtüsü
    cizgi(c, 30, -33.4, 8, -27, '#3a2414', 0.8);
    c.beginPath(); c.moveTo(-9, -29); c.quadraticCurveTo(-1, -31, 7, -29); c.lineTo(7.6, -20.6); c.quadraticCurveTo(-1, -19, -9.4, -21); c.closePath(); boya(c, '#a8322a', 0.75);
    c.strokeStyle = '#c8a23a'; c.lineWidth = 0.8; c.beginPath(); c.moveTo(-8.6, -22.4); c.quadraticCurveTo(-1, -20.6, 7.2, -22); c.stroke();
    for (let k = -7; k < 7; k += 3) { yol(c, [k, -21, k + 1.2, -19.4, k + 2.4, -21]); c.fillStyle = '#c8a23a'; c.fill(); }
    c.beginPath(); c.moveTo(-6, -29.6); c.quadraticCurveTo(-1, -32, 4.4, -29.6); c.lineTo(4, -27.6); c.quadraticCurveTo(-1, -29.4, -5.6, -27.6); c.closePath(); boya(c, '#5a3a1e', 0.6);
    bacakC(-8, -s, false); bacakC(15, s, false);
    c.restore();
  }

  /* ---------- EJDER (Evren, Van Gölü Canavarı) ---------- */
  function ejder(c, L, walk, atk, moving) {
    const w = moving ? walk : T() * 2, t = T(), fl = Math.sin(t * 3) * 10;
    c.save(); c.lineCap = 'round'; c.lineJoin = 'round';
    const sk = L.skin, kar = '#d8c890';
    // arka kanat
    c.beginPath(); c.moveTo(-4, -46); c.quadraticCurveTo(-22, -84 - fl, -36, -96 - fl); c.quadraticCurveTo(-30, -78 - fl * 0.6, -48, -70 - fl * 0.7);
    c.quadraticCurveTo(-34, -62, -42, -54 - fl * 0.3); c.quadraticCurveTo(-26, -54, -16, -48); c.closePath(); boya(c, ton(L.cloth, -0.35));
    c.strokeStyle = ton(L.cloth, -0.6); c.lineWidth = 0.8; for (const [x, y] of [[-36, -96 - fl], [-48, -70 - fl * 0.7], [-42, -54 - fl * 0.3]]) { c.beginPath(); c.moveTo(-6, -46); c.lineTo(x, y); c.stroke(); }
    // kuyruk halkaları
    for (let k = 7; k >= 0; k--) {
      const x = -60 + k * 9, y = -14 - Math.sin(w * 0.8 + k * 0.7) * 5 - k * 2.4, r = 5 + k * 1.5;
      daire(c, x, y, r); boya(c, k % 2 ? sk : ton(sk, -0.12));
      daire(c, x + r * 0.2, y + r * 0.45, r * 0.55); c.fillStyle = kar; c.globalAlpha = 0.6; c.fill(); c.globalAlpha = 1;
      if (k < 7) { yol(c, [x - 2, y - r + 0.6, x, y - r - 4, x + 2, y - r + 0.6]); boya(c, '#c8a23a', 0.5); }
    }
    yol(c, [-66, -14 - Math.sin(w * 0.8) * 5, -74, -20 - Math.sin(w * 0.8) * 5, -70, -10 - Math.sin(w * 0.8) * 5]); boya(c, '#c8a23a', 0.6);
    // bacaklar
    const s = moving ? Math.sin(walk) * 8 : 0;
    for (const [x, dx, arka] of [[-14, s, 1], [10, -s, 1]]) { kapsul(c, x, -22, x + dx, -1.6, 4, 2.8); boya(c, arka ? ton(sk, -0.3) : sk); for (let k = -1; k <= 1; k++) { yol(c, [x + dx + k * 2 - 0.8, 0, x + dx + k * 2 + 2.4, 0.8, x + dx + k * 2 + 0.6, -1.4]); boya(c, '#efe6c4', 0.4); } }
    // gövde
    elips(c, -2, -30, 24, 15, -0.15); boya(c, sk, 1);
    c.save(); elips(c, -2, -30, 24, 15, -0.15); c.clip();
    c.fillStyle = 'rgba(0,0,0,.22)'; elips(c, -8, -40, 22, 7, -0.15); c.fill();
    c.fillStyle = kar; elips(c, 2, -19, 18, 7, -0.1); c.fill();
    c.strokeStyle = ton(kar, -0.3); c.lineWidth = 0.6; for (let k = -12; k < 16; k += 4) { c.beginPath(); c.moveTo(k, -25); c.quadraticCurveTo(k + 1.6, -20, k + 1, -13); c.stroke(); }
    c.strokeStyle = 'rgba(255,255,255,.18)'; for (let k = 0; k < 6; k++) { c.beginPath(); c.arc(-14 + k * 6, -32, 2.6, PI, TAU); c.stroke(); }
    c.restore();
    // ön kanat
    c.beginPath(); c.moveTo(-6, -44); c.quadraticCurveTo(-16, -80 - fl, -26, -92 - fl); c.quadraticCurveTo(-22, -76 - fl * 0.6, -36, -66 - fl * 0.7);
    c.quadraticCurveTo(-24, -60, -28, -52 - fl * 0.3); c.quadraticCurveTo(-16, -52, -8, -40); c.closePath(); boya(c, ton(L.cloth, -0.1));
    c.save(); c.clip(); c.fillStyle = 'rgba(255,255,255,.1)'; elips(c, -16, -72 - fl * 0.6, 6, 18, 0.5); c.fill(); c.restore();
    cizgi(c, -6, -44, -26, -92 - fl, ton(L.cloth, -0.45), 1.2);
    // sırt dikenleri
    for (let k = 0; k < 5; k++) { const x = -18 + k * 8; yol(c, [x - 3, -43 + k * 0.5, x, -52 + k * 0.5, x + 3, -43 + k * 0.5]); boya(c, '#c8a23a', 0.6); }
    // boyun
    c.beginPath(); c.moveTo(8, -40); c.quadraticCurveTo(20, -62, 30, -66); c.lineTo(34, -56); c.quadraticCurveTo(24, -52, 20, -32); c.closePath(); boya(c, sk);
    c.save(); c.clip(); c.fillStyle = kar; c.globalAlpha = 0.7; c.beginPath(); c.moveTo(16, -30); c.quadraticCurveTo(24, -50, 34, -56); c.lineTo(34, -48); c.lineTo(22, -26); c.fill(); c.restore();
    // baş
    const ja = atk * 0.5;
    c.save(); c.translate(32, -60);
    c.save(); c.rotate(ja); c.beginPath(); c.moveTo(-2, 2); c.quadraticCurveTo(10, 6, 20, 5); c.quadraticCurveTo(14, 10, 0, 7); c.closePath(); boya(c, ton(sk, -0.2), 0.8);
    c.fillStyle = '#efe6c4'; for (let k = 4; k < 18; k += 4) { yol(c, [k, 5, k + 1, 2.6, k + 2, 5.4]); c.fill(); } c.restore();
    c.beginPath(); c.moveTo(-6, -2); c.quadraticCurveTo(-4, -9, 5, -8.6); c.quadraticCurveTo(14, -7, 20, -2.4); c.quadraticCurveTo(21, 1.4, 18, 2.6); c.quadraticCurveTo(8, 4, -2, 4.6); c.quadraticCurveTo(-7, 3, -6, -2); c.closePath(); boya(c, sk);
    c.fillStyle = '#efe6c4'; for (let k = 6; k < 18; k += 4) { yol(c, [k, 2.8, k + 1, 5.2, k + 2, 2.6]); c.fill(); }
    daire(c, 18.4, -1.6, 0.9); c.fillStyle = '#111'; c.fill();
    // boynuzlar
    for (const [a, b, cx, cy, ex, ey] of [[0, -6, -8, -18, -14, -16], [4, -7, 0, -20, -6, -22]]) { c.beginPath(); c.moveTo(a - 1.4, b); c.quadraticCurveTo(cx, cy, ex, ey); c.quadraticCurveTo(cx + 3, cy + 4, a + 1.6, b + 0.6); c.closePath(); boya(c, '#e8dcc0', 0.7); }
    // yüzgeç kulak (Van Gölü Canavarı) / diken yele (Evren)
    yol(c, [-4, 0, -12, -4, -11, 3, -5, 4]); boya(c, ton(L.cloth, 0.1), 0.6);
    parlakGoz(c, 9, -3.4, 1.9, L.eye);
    cizgi(c, 5.6, -6.4, 12, -5.6, OL, 1);
    if (atk > 0.4) {   // ağızdan alev / su püskürmesi
      const su = L.eye === '#e8f6ff'; const ac = su ? '#9fe0ff' : '#ff9a3a';
      hale(c, 30, 2, 16, ac, 0.6);
      c.beginPath(); c.moveTo(18, 3); c.quadraticCurveTo(30, -6, 40, -6); c.quadraticCurveTo(36, 2, 42, 10); c.quadraticCurveTo(30, 9, 18, 5); c.closePath(); c.fillStyle = su ? 'rgba(190,240,255,.85)' : 'rgba(255,150,40,.88)'; c.fill();
      c.beginPath(); c.moveTo(19, 3.6); c.quadraticCurveTo(28, -1, 34, 0); c.quadraticCurveTo(28, 4, 19, 4.6); c.closePath(); c.fillStyle = su ? '#f4fcff' : '#fff2a0'; c.fill();
    }
    c.restore();
    c.restore();
  }

  window.HC = { fig, at, ton, hale, OL, daire, elips, boya, cizgi, yol, egri, kapsul };
})();
