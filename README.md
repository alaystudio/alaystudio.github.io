# alaystudio.app

Alay Studio'nun vitrin sitesi: oyun kartları, gizlilik politikaları ve AdMob için `app-ads.txt`.
Saf HTML, build adımı yok. GitHub Pages ile yayınlanır.

## Yapı
| Yol | İçerik |
|---|---|
| `index.html` | Vitrin. Oyun listesi sayfanın altındaki `GAMES` dizisinde |
| `games/` | Oyun ikonları |
| `<oyun>/privacy.html` | Gizlilik politikaları (TR + EN) |
| `app-ads.txt` | AdMob yayıncı kaydı. **Silme, adını değiştirme** |
| `404.html`, `favicon.svg` | |

**Bu yolları değiştirme:** `mobilegame/privacy.html` (Orbitap), `word-blocks/privacy.html` (Lexiblok) ve `app-ads.txt` mağaza kayıtlarında kullanılıyor.

## Oyun eklemek / güncellemek
`index.html` içindeki `GAMES` dizisine bir kayıt ekle:
- `web`: oyunun web adresi (ör. `https://shoova.alaystudio.app`). Boşsa kartta "Web sürümü yakında" yazar.
- `appStore` / `playStore`: mağaza linkleri, yayınlanınca doldur.
- `status`: `dev` (geliştiriliyor), `soon` (mağazaya geliyor), `live` (şimdi oynanabilir).
- `privacy`: gizlilik sayfasının yolu.

## alaystudio.app alan adını bağlamak
Sıra önemli. Önce DNS ayarlanmalı, sonra GitHub'a özel alan adı girilmeli. Aksi halde eski `alaystudio.github.io/...` linkleri çalışmayan bir adrese yönlenir ve mağazalardaki gizlilik linkleri bozulur.

1. Alan adını aldığın firmanın DNS panelinde şu kayıtları ekle:
   - `A` kayıtları (`@` için): `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `AAAA` kayıtları (`@` için): `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`
   - `CNAME` kaydı: `www` → `alaystudio.github.io`
2. Kayıtların yayılmasını bekle (genelde birkaç dakika ile birkaç saat).
3. GitHub → bu repo → **Settings → Pages → Custom domain**: `alaystudio.app` yaz ve **Save** de. GitHub repoya bir `CNAME` dosyası ekler.
4. Sertifika hazır olunca **Enforce HTTPS** kutusunu işaretle. `.app` uzantısı HTTPS'i zorunlu kıldığı için site, sertifika çıkana kadar (genelde 15 dk – 1 saat) açılmayabilir.
5. GitHub Pages bundan sonra `alaystudio.github.io/...` adreslerini otomatik olarak `alaystudio.app/...` adresine yönlendirir; mağazalardaki eski linkler çalışmaya devam eder. Yine de fırsat bulunca mağaza kayıtlarındaki gizlilik ve web sitesi adreslerini yeni alan adıyla güncelle.

Sonra AdMob'da geliştirici web sitesi olarak `https://alaystudio.app` girilir ve `app-ads.txt` buradan doğrulanır.

## Oyunların alt alan adları
Her oyun kendi reposundan Cloudflare Pages ile yayınlanır ve `oyun.alaystudio.app` alt alan adına bağlanır (ayrıntılar her oyunun reposunda). Bir oyun yayına girince buradaki `GAMES` kaydında `web` alanını doldur.
