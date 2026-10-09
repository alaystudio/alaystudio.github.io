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

## Oyunların alt alan adları (Cloudflare Pages)
Her oyun kendi reposundan yayınlanır. Repolarda `scripts/build-web.mjs` var; yalnızca service worker'ın listelediği dosyaları
`web/` klasörüne kopyalar (native projeler, mağaza görselleri ve notlar siteye çıkmaz). Web sürümünde reklam ve satın alma yoktur.

| Oyun | Repo | Dal | Alt alan adı |
|---|---|---|---|
| Orbitap | `alaystudio/mobilegame` | `claude/store-release` | `orbitap.alaystudio.app` |
| Bloom Blast | `alaystudio/bloom-blast` | `main` | `bloomblast.alaystudio.app` |
| Shoova | `alaystudio/shoova` | `main` | `shoova.alaystudio.app` |
| Drift Garden | `alaystudio/drift-garden` | `main` | `driftgarden.alaystudio.app` |

Her oyun için bir kez:
1. Cloudflare → **Workers & Pages → Create → Pages → Connect to Git**. GitHub'ı bağla ve Cloudflare uygulamasına bu repoya erişim ver.
2. Dalı seç. **Framework preset:** None. **Build command:** `node scripts/build-web.mjs`. **Build output directory:** `web`.
3. **Save and Deploy.** Oyun önce `<proje>.pages.dev` adresinde açılır; orada dene.
4. Projede **Custom domains → Set up a custom domain** → alt alan adını yaz (ör. `shoova.alaystudio.app`).
   Alan adının DNS'i Cloudflare'de değilse, alan adı firmasının panelinde Cloudflare'in gösterdiği CNAME kaydını ekle
   (`shoova` → `<proje>.pages.dev`).
5. Oyun açılınca bu repodaki `index.html` → `GAMES` içinde `web` alanını doldur.

Bundan sonra repoya her push otomatik yayınlanır. Derleme `npm install` aşamasında takılırsa (paketler mobil uygulama için),
projenin ortam değişkenlerine `SKIP_DEPENDENCY_INSTALL = true` ekle; derleme betiği hiçbir paket kullanmaz.
