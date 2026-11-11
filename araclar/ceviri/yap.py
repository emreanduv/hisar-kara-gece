import json,re
g={}
for f in ['sozluk1.py','sozluk2.py','sozluk3.py','sozluk4.py']:
    try: exec(open(__import__('os').path.join(__import__('os').path.dirname(__file__),f)).read(),g)
    except FileNotFoundError: pass
D={}
for k in ['D','D2','REG','FIRST','NOUN','ADJ','LINES','D4']:
    D.update(g.get(k,{}))
# çok cümleli kayıtların cümlelerini de ayrı kayıt yap (cümle sayıları eşitse)
sp=lambda x: re.split(r'(?<=[.!?…])\s+',x)
for k,v in list(D.items()):
    a,b=sp(k),sp(v)
    if len(a)>1 and len(a)==len(b):
        if any(len(re.sub(r'\{\d\}|[^A-Za-zÇĞİÖŞÜçğıöşü]','',x))<4 for x in a): continue
        for x,y in zip(a,b):
            if x not in D: D[x]=y
js='/* Hisar: Kara Gece — İngilizce sözlük (Mr. Anduv! dil paketi: dil.js). Yerel adlar (Alp Er, Sekban, Akıncı, Deli, Ozan, akçe, Gulyabani, Albastı, Karakoncolos, Tepegöz, Yelbegen, Erlik) özgün kalır. Üretim: araclar/ceviri (sozluk*.py → yap.py). */\n'
js+='window.DIL_EN = '+json.dumps(D,ensure_ascii=False,indent=0)+';\n'
js+='''/* Bölüm adları sıfat + isimden kurulur (ör. "Eski Mezra" → "Old Hamlet"): bütün eşleşmeler burada üretilir. */
(function(){var A=%s,N=%s;Object.keys(A).forEach(function(a){Object.keys(N).forEach(function(n){var k=a+' '+n;if(!(k in window.DIL_EN))window.DIL_EN[k]=A[a]+' '+N[n];});});})();
''' % (json.dumps(g['ADJ'],ensure_ascii=False),json.dumps(g['NOUN'],ensure_ascii=False))
open(__import__('os').path.join(__import__('os').path.dirname(__file__),'..','..','www','dil-en.js'),'w').write(js)
print(len(D))
