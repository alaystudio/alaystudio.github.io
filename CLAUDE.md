# alaystudio.app — Claude için notlar

Kullanıcıyla **Türkçe** konuş. Bu repo Alay Studio'nun vitrin sitesi (GitHub Pages, özel alan adı `alaystudio.app`).
Ayrıntılar ve alan adı kurulumu: `README.md`.

- Saf HTML; kütüphane ve build yok. Sayfa metinleri EN/TR, `index.html` içindeki `T` sözlüğünde; oyunlar `GAMES` dizisinde.
- **Dokunma:** `mobilegame/privacy.html`, `word-blocks/privacy.html`, `app-ads.txt` — mağaza kayıtları bu yollara bağlı.
- Gizlilik sayfaları oyunların gerçek davranışını anlatmalı. Bir oyuna sunucu, analitik veya yeni bir SDK eklenirse ilgili
  `privacy.html` güncellenmeli. Bloom Blast ve Shoova'nın resmi gizlilik sayfaları kendi Firebase Hosting'lerinde
  (`bloom-blast-game.web.app`, `shoova-game.web.app`); buradaki `bloom-blast/` ve `shoova/` sayfaları yalnızca oraya yönlendirir.
  Drift Garden'ın sayfası burada (reklam ve ağ bağlantısı yok).
- `CNAME` dosyasını elle ekleme; DNS hazır olmadan eklenirse eski linkler kırılır (README'deki sıraya bak).
- Oyun repoları: `alaystudio/mobilegame` (Orbitap, dal `claude/store-release`), `alaystudio/bloom-blast`, `alaystudio/shoova`,
  `alaystudio/drift-garden`. Lexiblok (`word-blocks`) ve Koz Kimde'nin repoları bu oturumda yoktu; Lexiblok ve Koz Kimde ikonları geçici.
