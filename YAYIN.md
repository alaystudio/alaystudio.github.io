# alaystudio.app — web yayın rehberi

Bu belge vitrin sitesinin ve oyunların web sürümlerinin nasıl kurulduğunu, yeni bir oyunun nasıl ekleneceğini ve sorun
çıkınca nereye bakılacağını anlatır. Son güncelleme: Ekim 2026.

## 1. Genel yapı

```
alaystudio.app            → vitrin (bu repo, GitHub Pages)
www.alaystudio.app        → vitrine yönlenir
<oyun>.alaystudio.app     → her oyunun web sürümü (kendi reposundan, Cloudflare Pages)
```

- **Alan adı:** `alaystudio.app`. DNS'i **Cloudflare**'de (Cloudflare → alan adı → DNS → Records).
- **Vitrin:** `alaystudio/alaystudio.github.io` reposu, GitHub Pages ile yayınlanıyor. Saf HTML, build adımı yok.
- **Oyunlar:** her biri kendi reposundan Cloudflare Pages ile yayınlanıyor. İzlenen dala push yapılınca otomatik yayınlanır.
- **Web sürümünde reklam ve satın alma gizli.** Oyun uygulama içinde (Capacitor) çalışmıyorsa reklam ve satın alma düğmeleri
  görünmez. Adrese `?ads=test` eklenirse test reklamları yine görünür (deneme için).
- **Maliyet:** Hepsi ücretsiz katmanda. Ücret yalnızca alan adının yıllık yenilemesi.

## 2. Şu anki durum

| Oyun | Repo | Dal | Cloudflare projesi | Build command | Output | Adres |
|---|---|---|---|---|---|---|
| Orbitap | `alaystudio/mobilegame` | `claude/store-release` | `mobilegame-4jx.pages.dev` | `node scripts/build-web.mjs` | `web` | orbitap.alaystudio.app |
| Lexiblok | `alaystudio/lexiblok` | `main` | `lexiblok.pages.dev` | `node tools/build.js` | `dist` | lexiblok.alaystudio.app |
| Bloom Blast | `alaystudio/bloom-blast` | `main` | `bloom-blast.pages.dev` | `node scripts/build-web.mjs` | `web` | bloomblast.alaystudio.app |
| Shoova | `alaystudio/shoova` | `main` | `shoova.pages.dev` | `node scripts/build-web.mjs` | `web` | shoova.alaystudio.app |
| Drift Garden | `alaystudio/drift-garden` | `main` | `drift-garden.pages.dev` | `node scripts/build-web.mjs` | `web` | driftgarden.alaystudio.app |
| Koz Kimde | `alaystudio/batak` | `main` | `batak-4n2.pages.dev` | `node scripts/build-web.mjs` | `web` | kozkimde.alaystudio.app |

Hepsinde ortak ayarlar:
- **Framework preset:** None.
- **Ortam değişkeni:** `SKIP_DEPENDENCY_INSTALL = true`. Derleme betikleri paket kullanmadığı için gereksiz `npm install`
  adımını atlar.

Oyunlara özel notlar:
- **Orbitap:** Repoda başka dallar da olduğu için **Preview branches: None** olmalı.
- **Lexiblok:** Seviye paketlerini `word-blocks-game.web.app`'ten (Firebase Hosting) çeker. O sunucu her alan adına izin
  veriyor (CORS `*`).
- **Koz Kimde:** Şimdilik bilgisayara karşı tek kişilik. Gizlilik sayfası henüz yok; mağazaya çıkmadan önce yazılmalı.

### DNS kayıtları (Cloudflare)

| Type | Name | Content | Ne için |
|---|---|---|---|
| A ×4 | `@` | `185.199.108.153`, `.109.153`, `.110.153`, `.111.153` | Vitrin (GitHub Pages) |
| AAAA ×4 | `@` | `2606:50c0:8000::153` … `8003::153` | Vitrin (IPv6, varsa) |
| CNAME | `www` | `alaystudio.github.io` | Vitrin |
| CNAME | `orbitap` | `mobilegame-4jx.pages.dev` | Oyun |
| CNAME | `lexiblok` | `lexiblok.pages.dev` | Oyun |
| CNAME | `bloomblast` | `bloom-blast.pages.dev` | Oyun |
| CNAME | `shoova` | `shoova.pages.dev` | Oyun |
| CNAME | `driftgarden` | `drift-garden.pages.dev` | Oyun |
| CNAME | `kozkimde` | `batak-4n2.pages.dev` | Oyun |

Oyunların CNAME kayıtlarını Cloudflare, "Custom domain" eklenince **kendisi** oluşturur; elle eklenmez.
**SSL/TLS modu:** Full. Flexible olursa vitrinde "too many redirects" hatası çıkar.

## 3. Yeni bir oyunu web'e çıkarmak

### Aşama 1 — Oyun reposunda gerekenler

| Dosya | Ne olmalı |
|---|---|
| `index.html` | Oyunun giriş sayfası. `<title>`, açıklama (`description`), `theme-color`, manifest ve ikon bağlantıları |
| `manifest.webmanifest` | Ad, renkler, `display`, `orientation`, ikonlar (192 ve 512 PNG, isteğe bağlı SVG) |
| `icons/icon-192.png`, `icons/icon-512.png` | Uygulama ikonu. Ana ekrana eklenince bu görünür |
| `sw.js` | Service worker. `ASSETS` listesinde siteye çıkacak **bütün** dosyalar olmalı. `CACHE` sürümü her yayında artırılır |
| `scripts/build-web.mjs` | Siteye çıkacak dosyaları `web/` klasörüne toplar (aşağıya bak) |
| `package.json` | `"build:web": "node scripts/build-web.mjs"` betiği |
| `.gitignore` | `web/` satırı. Derleme çıktısı repoya girmez |
| Reklam katmanı (`ads.js` vb.) | Web'de reklam ve satın almayı gizleyen kontrol (aşağıya bak) |
| Gizlilik politikası | Oyunun gerçek davranışını anlatan TR + EN sayfa (bu repoda `<oyun>/privacy.html` ya da oyunun kendi sitesinde) |

**`scripts/build-web.mjs`** Orbitap, Bloom Blast, Shoova ve Drift Garden'da aynı. `sw.js` içindeki `ASSETS` listesini okur,
yalnızca o dosyaları `web/`'e kopyalar ve `_headers` dosyası yazar (`sw.js` önbelleğe alınmaz). Böylece native projeler
(`android/`, `ios/`), mağaza görselleri, imza dosyaları ve notlar siteye çıkmaz. Yeni oyunda bu dosyayı kopyalamak yeterli.
Oyunun kendi derleyicisi varsa (Lexiblok: `tools/build.js` → `dist/`) onu kullan.
Koz Kimde'de `client/` ve `shared/` birlikte kopyalanır.

**Web'de reklamı gizleme** (diğer oyunlardaki kalıp):

```js
// Uygulama dışında (tarayıcıda) reklam ve satın alma yok. ?ads=test ile denenebilir.
const WEB_NO_ADS = !(window.Capacitor && Capacitor.isNativePlatform && Capacitor.isNativePlatform())
  && !/[?&]ads=test\b/.test(location.search);
```

Bu bayrak açıkken:
- ödüllü reklam hakkı 0 olmalı ve reklam düğmeleri gizlenmeli;
- geçiş reklamı gösterilmemeli;
- "Reklamları kaldır" ve "Satın alımı geri yükle" görünmemeli.

Ödül veren bir şey reklama bağlıysa, web'de oyuncunun o yolu kilitli kalmamalı.

Yerelde deneme:

```bash
node scripts/build-web.mjs && python3 -m http.server 8000 -d web   # → http://localhost:8000
```

Kontrol et:
- [ ] Ana ekran, oyun ve ayarlar açılıyor; konsolda hata yok.
- [ ] Reklam ve satın alma düğmeleri görünmüyor.
- [ ] `?ads=test` ile test reklamları geri geliyor.
- [ ] Sayfa yenilenince ilerleme kaybolmuyor (`localStorage`).
- [ ] İnternet kesikken ikinci açılışta oyun yine açılıyor (service worker).

### Aşama 2 — GitHub erişimi

Cloudflare'in repoyu görebilmesi için:
1. GitHub → **Settings → Applications → Installed GitHub Apps** → **Cloudflare Workers and Pages** → **Configure**.
2. **Repository access** bölümüne yeni repoyu ekle → **Save**.

Claude'un da repoda çalışması gerekiyorsa aynı ekrandan **Claude** uygulamasına da bu repoyu ekle.

### Aşama 3 — Cloudflare Pages projesi

1. Cloudflare → **Workers & Pages** → **Create**.
2. **Önemli:** Workers formunu değil Pages'i seç. Ekranın altındaki **"Looking to deploy Pages? Get started"** bağlantısı →
   **Import an existing Git repository**.
   Formda "Deploy command: `npx wrangler deploy`" görüyorsan yanlış yerdesin, geri dön.
3. Repoyu seç → **Begin setup**.
4. Formu doldur:

   | Alan | Değer |
   |---|---|
   | Project name | Oyunun kısa adı (ör. `yenioyun`). Alınmışsa Cloudflare sonuna ek koyar (`-4n2` gibi), sorun değil |
   | Production branch | Oyunun yayın dalı (genelde `main`) |
   | Framework preset | `None` |
   | Build command | `node scripts/build-web.mjs` |
   | Build output directory | `web` |
   | Root directory | boş |
   | Environment variables | `SKIP_DEPENDENCY_INSTALL` = `true` |

5. **Save and Deploy.** Derleme 1–2 dakika sürer.
6. Oyun `<proje>.pages.dev` adresinde açılır. Kalıcı adres budur; `c38354d0.<proje>.pages.dev` gibi başında kod olan adres
   yalnızca o tek sürümün önizlemesidir.
7. Repoda başka dallar varsa: **Settings → Builds & deployments → Preview branches → None**.

Ortam değişkeni unutulduysa sonradan eklenebilir:
1. **Settings → Variables and Secrets** → **Add**.
2. **Deployments** → en üstteki sürüm → **⋯ → Retry deployment**.

### Aşama 4 — Alt alan adı

1. Projede **Custom domains** → **Set up a custom domain**.
2. `yenioyun.alaystudio.app` yaz → **Continue** → **Activate domain**.
3. DNS Cloudflare'de olduğu için CNAME kaydı kendiliğinden açılır. Birkaç dakika içinde durum **Active** olur, SSL
   sertifikası otomatik gelir.
4. Adı kısa ve tiresiz seç (ör. `bloomblast`). Vitrinde ve mağaza metinlerinde bu adres görünecek.

### Aşama 5 — Vitrine eklemek (bu repo)

1. **İkon:** `games/<oyun-id>.png`, 192×192 PNG (mağaza ikonundan küçültülmüş).
2. **Oyun kaydı:** `index.html` → `GAMES` dizisine bir kayıt ekle.

   | Alan | Değer |
   |---|---|
   | `id`, `name`, `icon` | Kimlik, görünen ad, ikon yolu |
   | `g1`, `g2` | Kartın üst kısmındaki geçişin iki rengi (oyunun ana renkleri) |
   | `status` | `dev` (geliştiriliyor), `soon` (mağazaya geliyor), `live` (mağazada) |
   | `web` | `https://yenioyun.alaystudio.app/` (boşsa "Web sürümü yakında" yazar) |
   | `appStore`, `playStore` | Mağaza linkleri, yayınlanınca |
   | `privacy` | Gizlilik sayfası yolu ya da tam adresi (`null` ise bağlantı çıkmaz) |
   | `genre`, `pitch`, `spec` | `{ en, tr }` metinleri: tür, tek cümlelik tanıtım, kısa özellik satırı (`spec` boş olabilir) |

3. **Gizlilik sayfası:** Burada tutulacaksa `<oyun-id>/privacy.html` (TR + EN). Mevcut sayfaları örnek al.
4. **Sayfa açıklaması:** `<meta name="description">` içindeki oyun listesine yeni oyunu ekle.
5. **Kayıt tabloları:** Bu belgedeki tabloya (bölüm 2) ve `README.md`'deki tabloya satır ekle.
6. **Yayın:** Commit ve push. GitHub Pages birkaç dakikada yayınlar.

### Aşama 6 — Son kontrol

- [ ] `https://yenioyun.alaystudio.app` telefonda açılıyor ve oynanıyor.
- [ ] Vitrinde kart görünüyor, "Web'de oyna" doğru adrese gidiyor.
- [ ] Gizlilik bağlantısı açılıyor.
- [ ] Safari'de "Ana Ekrana Ekle" ya da Chrome'da "Uygulamayı yükle" ile doğru ikon ve adla ekleniyor.

## 4. Güncelleme yayınlamak

- Oyunun yayın dalına push yap; Cloudflare otomatik derler ve yayınlar (**Deployments** sekmesinde görünür).
- Oyuncuların eski sürümde kalmaması için her yayında `sw.js` içindeki `CACHE` sürümünü artır
  (ör. `shoova-v4` → `shoova-v5`).
- Yeni dosya eklediysen `sw.js` → `ASSETS` listesine de ekle. Listede olmayan dosya siteye çıkmaz.
- Hatalı bir yayını geri almak için: **Deployments** → önceki sürüm → **⋯ → Rollback to this deployment**.
- Vitrin değişiklikleri: bu repoya push. Önbellek yok, hemen yansır.

## 5. Sorun giderme

| Belirti | Neden / çözüm |
|---|---|
| Kurulumda "Deploy command: `npx wrangler deploy`" isteniyor | Workers formundasın. Geri dön, "Looking to deploy Pages? Get started" |
| Repo listede yok | Aşama 2: Cloudflare GitHub uygulamasına repo erişimi ver |
| Derleme `npm install`'da hata veriyor | `SKIP_DEPENDENCY_INSTALL = true` ekle, Retry deployment |
| Derleme "output directory not found" diyor | Build command ve output yanlış; tablodaki değerleri kontrol et |
| Proje adı `bloom-blast` ya da `batak-4n2` gibi çıktı | Normal. Repo adı kullanılmış ya da ad alınmış; değiştirmeye gerek yok, oyuncular `.alaystudio.app` adresini görür |
| Custom domain "Pending"/"Verifying" kalıyor | 5–30 dk bekle. Uzarsa DNS'te aynı ada başka bir kayıt var mı bak |
| Vitrin "too many redirects" | SSL/TLS modu Full olmalı (Flexible değil) |
| Oyun eski sürümü gösteriyor | `sw.js` `CACHE` artırılmamış. Artırıp push et; tarayıcıda bir kez yenile |
| Web'de reklam düğmesi görünüyor | Oyunun reklam katmanında web kontrolü eksik (Aşama 1) |
| Sayfa açılıyor ama bir dosya 404 | Dosya `sw.js` → `ASSETS` listesinde yok, build-web onu kopyalamadı |

## 6. Dokunulmayacaklar

- `mobilegame/privacy.html`, `word-blocks/privacy.html`, `app-ads.txt`: mağaza kayıtları ve AdMob bu adreslere bağlı.
  Taşıma, adını değiştirme.
- `CNAME` dosyası (`alaystudio.app`): silinirse vitrin alan adından düşer.
- DNS'teki vitrin kayıtları (`@` A/AAAA ve `www`).
- Oyunlardaki kayıt anahtarları (`localStorage`): değişirse oyuncu ilerlemesi kaybolur.
