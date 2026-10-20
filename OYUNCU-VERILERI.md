# Oyuncu verileri — kimlik, oyuncu özeti, hediyeler ve istatistikler

Her oyuncunun bir **oyuncu kimliği** var. Bu kimlikle oyuncunun oyun içi bilgilerini görebilir; coin, yıldız, tohum ve
güçlendirici gibi değerlerini değiştirebilir ya da hediye gönderebilirsin. Son güncelleme: 20 Ekim 2026.

## 1. Oyun oyun durum

| Oyun | Veri nerede | Kimlik oyunda nerede | Değiştirilebilen değerler | Senin yapman gereken |
|---|---|---|---|---|
| Lexiblok | Firebase `word-blocks-game` | Ayarlar → Oyuncu kimliği | `coins`, `hint`, `shuffle`, `bomb` | Anonymous girişin açık olduğunu kontrol et (bölüm 2) |
| Orbitap | Firebase `orbitap-game` | Güçler → en altta | `stars` | Anonymous aç, kuralları yayınla |
| Bloom Blast | Firebase `bloom-blast-game` | Ayarlar → en altta | `seeds`, `hammer`, `bomb`, `shuffle` | Anonymous aç, kuralları ve gizlilik sayfasını yayınla |
| Shoova | Firebase `shoova-game` | Ayarlar → Oyuncu kimliği | `hint`, `grab` | Firestore oluştur, Anonymous aç, web uygulaması ekleyip apiKey'i bana gönder, kuralları ve gizlilik sayfasını yayınla |
| Drift Garden | Henüz yok (kapalı) | Açılınca Ayarlar'da | `stars` | Firebase projesi kur (bölüm 7) |
| Koz Kimde | Kendi sunucusu (Cloudflare) | Ayarlar → Hesap → Oyuncu kodu | chip (yönetim sayfasından) | Sunucuyu ve hosting'i yayınla (bölüm 5) |

**Önemli:**
- Telefonlara mağazadan yeni sürüm gitmeden uygulamada bu özellik çalışmaz. Web sürümleri push'tan sonra hemen güncellenir.
- Web sürümünde (alaystudio.app) oyuncu kimliği görünür ve hediyeler çalışır, ama oyuncu özeti yazılmaz.
  Özet yalnızca mağaza uygulamasından gelir. Drift Garden'ın uygulaması olmadığı için onda özet web'den yazılır.

## 2. Firebase'de bir kez yapılacaklar (her proje için)

Bu adımları her proje için ayrı yap: `word-blocks-game`, `orbitap-game`, `bloom-blast-game` ve `shoova-game`.

1. **Anonim girişi aç:**
   1. [console.firebase.google.com](https://console.firebase.google.com) → projeyi seç.
   2. **Build → Authentication**. İlk kezse **Get started** de.
   3. **Sign-in method → Anonymous → Enable → Save**.
   4. Oyuncu bunu görmez. Her kuruluma, kişisel bilgi istemeyen bir giriş açılır; özetini yalnızca o cihaz yazabilir.
2. **Firestore** (sadece Shoova'da gerekli, diğerlerinde zaten var):
   1. **Build → Firestore Database → Create database**.
   2. Konum: `eur3 (europe)`, mod: **production**.
3. **Web uygulaması** (sadece Shoova):
   1. **Proje ayarları (⚙) → Your apps → Add app → Web (`</>`)**, ad: `Shoova Web`.
   2. Çıkan `apiKey`'i bana gönder (`AIza…` ile başlar). Bu anahtar gizli değildir.
4. **Kuralları yayınla.** Her oyunun reposundaki `firestore.rules` dosyasını yayınla. İki yolu var:
   - **Terminalden:** `firebase deploy --only firestore:rules --project <proje>`
   - **Konsoldan:** **Firestore → Rules**, dosyanın içeriğini yapıştır, **Publish**.

   Orbitap'in kuralları `claude/store-release` dalındadır. Kurallar yayınlanmazsa özet yazılamaz ve hediyeler okunamaz.
5. **Gizlilik sayfalarını yayınla.** Bloom Blast ve Shoova'nın sayfaları kendi Firebase Hosting'lerinde:
   `firebase deploy --only hosting --project bloom-blast-game` (Shoova için `shoova-game`).
   Orbitap'in sayfası vitrinde, o zaten güncel.
6. **Mağaza veri formlarını güncelle.**
   - **Google Play → Data safety:** "Kimlikler → Kullanıcı kimlikleri" ve "Uygulama etkinliği → Diğer işlemler (oyun
     ilerlemesi)" ekle. Amaç: Uygulama işlevi + Analiz. Paylaşılmıyor, aktarımda şifreli.
   - **App Store → App Privacy:** "Identifiers → User ID" ve "Usage Data → Product Interaction" ekle. Kimlikle
     ilişkili (linked), izleme (tracking) için değil.

## 3. Bir oyuncuya bakmak

1. Oyuncudan oyuncu kimliğini iste. Ayarlar'daki satıra dokununca kopyalanır; 8 haneli, ör. `K7PX2MQA`.
2. Firebase konsolu → oyunun projesi → **Firestore Database → players** koleksiyonu.
3. Belgeyi kimliğe göre bul: belge kimliği = oyuncu kimliği.
   Çok oyuncu varsa üstteki **Filter** ile `pid == K7PX2MQA` filtrele.

Belgede neler var:

| Oyun | Alanlar |
|---|---|
| Hepsi | `pid`, `platform` (android/ios/web), `version`, `lang`, `firstSeen`, `lastSeen` |
| Lexiblok | `coins`, `hint`, `shuffle`, `bomb`, `enLevelsWon`/`trLevelsWon`, `enTopLevel`/`trTopLevel`, yıldız, klasik en iyi, `streak`, `dailyPlayed`, `purchases`, `noAds` |
| Orbitap | `name` (sıralama adı), `best`, `stars`, `totalStars`, `games`, `playMinutes`, `streak`, `skin`, `skinsOwned`, `upgShield`/`upgMagnet`/`upgSlow`/`upgDouble`, `maxRings`, `challengeBest`, `noAds`, `boardId` |
| Bloom Blast | `level`, `stars`, `classicBest`, `seeds`, `hammer`, `bomb`, `shuffle`, `garden`, `gardenSteps`, `gardensDone`, `dailyStreak`, `noAds`, `installId` |
| Shoova | `level`, `levelsCleared`, `stars`, `hint`, `grab`, `noAds` |
| Drift Garden | `stars`, `songsOwned`, `songsPlayed`, `plays`, `balloonsOwned`, `decor`, `blooms`, `mode` |

**Bu belge yalnızca bir ayna.** Burada bir sayıyı değiştirirsen oyuna hiçbir şey olmaz; oyun bir sonraki açılışta
belgenin üstüne kendi kaydını yazar. Bir değeri değiştirmek için hediye belgesi kullan (bölüm 4).

Özet en sık dakikada bir ve oyun arka plana geçince güncellenir. `lastSeen` oyuncunun en son ne zaman oynadığını gösterir.

## 4. Değer değiştirmek ya da hediye göndermek

1. Firebase konsolu → oyunun projesi → **Firestore Database**. **gifts** koleksiyonu yoksa **Start collection** ile
   `gifts` adıyla oluştur.
2. **Add document** de. **Document ID** alanına:
   - tek bir oyuncu için oyuncu kimliğini yaz (`K7PX2MQA`);
   - herkese göndermek için `all` yaz.
3. Alanları ekle. Sayılar için tip **number** olmalı, **string** değil:

   | Alan | Ne yapar | Örnek |
   |---|---|---|
   | `<değer>` | Ekler (eksi sayı düşer) | `coins` = `500`, `hint` = `3`, `stars` = `-50` |
   | `set_<değer>` | Tam o değere ayarlar | `set_coins` = `1000`, `set_grab` = `5` |
   | `msg_tr`, `msg_en` (string) | Oyuncuya gösterilen mesaj (yoksa "Hediye: +500 …" yazar) | `Destek: altınların geri yüklendi` |

   Oyun başına değer adları bölüm 1'deki tabloda. Bilinmeyen alanlar yok sayılır.
4. **Save.** Oyuncu oyunu bir sonraki açışında ya da oyuna geri döndüğünde (internet varsa) hediye uygulanır ve mesaj görünür.

**Kurallar:**
- Bir belgenin her kaydı **bir kez** uygulanır. Aynı oyuncuya tekrar göndermek için aynı belgeyi aç, değeri düzenleyip
  yeniden **Save** de; her kayıt yeni bir hediye sayılır.
- `gifts/all` yalnızca o kayıttan **önce** kurulmuş oyunculara gider; sonradan yükleyenler eski "herkese" hediyelerini almaz.
- Belgeyi silmen gerekmez; uygulanmış kayıt tekrar uygulanmaz.
- Değer 0'ın altına inmez. Tek oyuncu için en güvenli yol önce özetten (bölüm 3) mevcut değeri görmek, sonra `set_…` kullanmak.

## 5. Koz Kimde istatistikleri

- **Oyunda:** ana menü → **İstatistikler**. Bilgisayar / Online / Hepsi sekmeleri, sütunlar Klasik, Tekli, Eşli ve Toplam.
  Okey 101 Plus'taki profil istatistikleri örnek alındı. Satırlar:
  - oyun, galibiyet, kazanma oranı;
  - şu anki ve en uzun galibiyet serisi;
  - oynanan tur;
  - ihale/söz tutturma sayısı ve oranı;
  - batılan tur;
  - bütün elleri alma;
  - tur başına alınan el;
  - en yüksek puan.
- **Yönetimde:** Koz Kimde yönetim sayfası (adresi `batak` reposunun `CLAUDE.md`'sinde) → oyuncu kodunu ara. Panelde:
  - chip bakiyesi, sıralama puanı ve sunucunun saydığı online galibiyet/oyun;
  - aynı istatistik tablosu, son oyun zamanıyla.
- Chip eklemek/düşmek yine aynı sayfadan yapılır. Koz Kimde'de chipler sunucuda tutulduğu için Firestore hediyeleri yok.
- **Yayın:** sunucu değişti, kendi terminalinde çalıştır:
  1. `npm run server:deploy`
  2. `node tools/online-smoke.mjs https://koz-kimde.alaystudio.workers.dev`
  3. `firebase deploy --only hosting --project koz-kimde --account aaydgoan@gmail.com` (yönetim sayfası ve gizlilik politikası)

  Sonra mağazaya yeni sürüm.

## 6. Yeni bir oyuna eklemek

1. Bir oyunun `cloud.js` dosyasını kopyala. Dosya bütün oyunlarda aynı; değiştirirsen hepsini güncelle.
2. `index.html`'de oyunun koduna (`game.js`) bağlanmadan önce yükle.
3. Oyunda `AlayCloud.start({...})` çağır:
   - `projectId`, `apiKey`;
   - `key` (localStorage anahtarı, ör. `oyun.cloud.v1`);
   - `snapshot` (özete girecek alanlar);
   - `resources` (hediyeyle değişebilecek değerler: `get` / `set`);
   - `onGift` (kaydet, ekranı yenile, mesaj göster).

   Kayıt fonksiyonunun sonunda `AlayCloud.soon()` çağır.
4. Ayarlar'a oyuncu kimliği satırını ekle: `AlayCloud.pid` göster, dokununca `AlayCloud.copyPid(...)`.
5. Repoya `firestore.rules` ekle. Shoova'daki dosya hazır şablon. `firebase.json`'a `"firestore": { "rules": "firestore.rules" }` ekle.
6. Bölüm 2'deki Firebase adımlarını yap.
7. Gizlilik politikasına "Oyuncu kimliği ve oyun özeti" bölümünü ekle (diğer oyunlardakiyle aynı metin).
8. `sw.js` → `ASSETS` listesine `cloud.js`'i ekle ve `CACHE`'i artır.

## 7. Drift Garden'ı açmak

Drift Garden'da kod hazır ama kapalı. `config.js` boşken hiçbir istek gitmez ve Ayarlar'da kimlik satırı görünmez.

1. Firebase'de yeni proje kur (ör. `drift-garden-game`).
2. Firestore'u oluştur (`eur3`) ve Anonymous girişi aç.
3. Web uygulaması ekle.
4. `projectId` ve `apiKey`'i bana gönder. `config.js`'e yazar, kuralları ve vitrindeki gizlilik sayfasını
   (`drift-garden/privacy.html`, şu an "ağ bağlantısı yok" diyor) birlikte güncellerim.

## 8. Sorun giderme

| Belirti | Neden / çözüm |
|---|---|
| `players` koleksiyonu boş | Anonymous kapalı, kurallar yayınlanmadı ya da oyuncular eski mağaza sürümünde. Web'den gelen oyuncular özet yazmaz |
| Hediye gelmedi | Belge kimliği yanlış (büyük harf, 8 hane), alan tipi string kalmış, oyuncu oyunu açmadı ya da internet yok |
| Hediye iki kez geldi | Belge iki kez kaydedildi; her kayıt ayrı hediye sayılır |
| `gifts/all` yeni oyuncuya gitmedi | Normal: sadece kayıttan önce kuranlara gider |
| Koz Kimde istatistikleri yönetimde boş | Sunucu deploy edilmedi ya da oyuncu yeni sürümle henüz oyun bitirmedi |
