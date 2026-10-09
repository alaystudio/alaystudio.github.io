# alaystudio.app — Claude için notlar

Kullanıcıyla **Türkçe** konuş. Bu repo Alay Studio'nun vitrin sitesi (GitHub Pages, özel alan adı `alaystudio.app`).
Ayrıntılar ve alan adı kurulumu: `README.md`. Oyunların web yayını (Cloudflare Pages, DNS, yeni oyun ekleme): **`YAYIN.md`**.

- Saf HTML; kütüphane ve build yok. Sayfa metinleri EN/TR, `index.html` içindeki `T` sözlüğünde; oyunlar `GAMES` dizisinde.
- **Dokunma:** `mobilegame/privacy.html`, `word-blocks/privacy.html`, `app-ads.txt` — mağaza kayıtları bu yollara bağlı.
- Gizlilik sayfaları oyunların gerçek davranışını anlatmalı. Bir oyuna sunucu, analitik veya yeni bir SDK eklenirse ilgili
  `privacy.html` güncellenmeli. Bloom Blast ve Shoova'nın resmi gizlilik sayfaları kendi Firebase Hosting'lerinde
  (`bloom-blast-game.web.app`, `shoova-game.web.app`); buradaki `bloom-blast/` ve `shoova/` sayfaları yalnızca oraya yönlendirir.
  Drift Garden'ın sayfası burada (reklam ve ağ bağlantısı yok).
- `CNAME` dosyasını elle ekleme; DNS hazır olmadan eklenirse eski linkler kırılır (README'deki sıraya bak).
- Oyun repoları: `alaystudio/mobilegame` (Orbitap, dal `claude/store-release`), `alaystudio/lexiblok`, `alaystudio/bloom-blast`,
  `alaystudio/shoova`, `alaystudio/drift-garden`, `alaystudio/batak` (Koz Kimde). Koz Kimde ikonu geçici (repodaki ile aynı).
- Web yayınında bir şey değişirse (yeni oyun, adres, Cloudflare projesi) `YAYIN.md`'yi güncel tut.
