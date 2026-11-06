# Servis Saatleri: yönetici ve şoför uygulaması

Bu paket Cloudflare üzerinde çalışır. Tek adres, iki uygulama:

- `https://ADRESINIZ.workers.dev/admin.html`: yönetici (bilgisayar)
- `https://ADRESINIZ.workers.dev/driver.html`: şoförler (telefon/tablet, iPhone ve Android)

Veri Cloudflare'de kalıcı saklanır. Yönetici sayfasındaki yedek özelliği ve `tools/backup.mjs` bunu bilgisayarınızdaki klasöre de yazar.

## 0. En kolay yol (Windows)

Klasördeki **KUR.bat** dosyasına çift tıklayın ve ekrandaki yönergeleri izleyin. Aşağıdaki adımları sizin yerinize yapar.

## 1. Kurulum (elle yapmak isterseniz)

1. Bilgisayara Node.js kurun (nodejs.org, "LTS" sürümü).
2. Bu klasörü açın, içinde bir terminal/komut istemi başlatın ve sırayla çalıştırın:

```
npm install
npx wrangler login
npx wrangler deploy
```

   `wrangler login` tarayıcıda dash.cloudflare.com girişini açar, "Allow" deyin.
   `wrangler deploy` bittiğinde ekranda `https://servis-saatleri.KULLANICI.workers.dev` gibi adresiniz yazar.

3. Yönetici şifresini belirleyin (adresi ilk açmadan önce):

```
npx wrangler secret put ADMIN_PASSWORD
```

   İstenince şifreyi yazın (en az 6 karakter). Kullanıcı adı `admin` olur.
   Şifreyi belirlemeden adresi açtıysanız şifre `admin123` olarak oluşur. Hemen giriş yapıp Şoförler sekmesinde "Yönetici hesapları" bölümünden değiştirin.

4. `https://ADRESİNİZ.workers.dev/admin.html` adresini açın, `admin` ve şifrenizle girin.

Not: Cloudflare ücretsiz planı bu kullanım için yeterlidir (Durable Objects SQLite ücretsiz planda vardır). Kendi alan adınızı Cloudflare panelinde Workers > Settings > Domains bölümünden bağlayabilirsiniz.

## 2. İlk kullanım

1. Yönetici sayfasında **Program**, **Belge**, **Görünüm** sekmelerinde çizelgeyi hazırlayın. Çizelge her değişiklikte otomatik olarak sunucuya gider.
2. **Ayarlar**: iki şirketin adını ve logosunu, uygulama logosunu ve başlığı girin. Şoför uygulamasında da görünür.
3. **Şoförler**: ad, soyad, telefon, fotoğraf ve 4-6 haneli PIN ile şoför ekleyin. PIN boş bırakılırsa otomatik verilir.
4. **Vardiya**: her servis saatine şoför atayın. "Bu günü kopyala" ile sonraki günlere çoğaltın.
5. Şoförlere şu adresi gönderin: `https://ADRESİNİZ.workers.dev/driver.html`. Telefon numarası ve PIN ile girerler.

## 3. Şoförün telefonda yapacağı

- **iPhone**: Safari'de adresi açın, Paylaş düğmesi, "Ana Ekrana Ekle". Uygulamayı oradan açın.
- **Android**: Chrome'da adresi açın, menüden "Ana ekrana ekle" veya "Uygulamayı yükle".
- Giriş yaptıktan sonra Sayım sekmesinden "Bildirimleri aç" ve "Ekranı açık tut" düğmelerine basın.
- Servis saati geldiğinde **Bugün** sekmesinde "Seferi yaptım" düğmesine basar. Yönetici ekranında 2-3 saniye içinde görünür.
- Yanlış basarsa 10 dakika içinde "Geri al" der. Daha sonrası için yönetici düzeltir.

## 4. Nasıl çalışır

- Atanan şoför seferi bildirmezse Canlı sekmesinde "Yapılmadı", toleranstan (varsayılan 10 dk) geç bildirirse "Geç" görünür. Tolerans ve hatırlatma süresi Ayarlar sekmesindedir.
- Servis saatinden 5 dakika önce şoförün telefonunda uyarı çıkar (ses, titreşim ve ekranda kırmızı şerit). Uygulama açıkken çalışır; sunucu tarafında telefon bildirimi (push) yoktur. Telefon kilitliyken veya uygulama kapalıyken uyarı garanti değildir. "Ekranı açık tut" bunu azaltır.
- Rapor sekmesi günlük, haftalık ve aylık sefer sayısını (otelden tesise, tesisten otele), geç ve yapılmayan seferleri gösterir. CSV indirilebilir.
- Sohbet: yönetici ile tüm şoförlerin ortak grubu. Yönetici mesaj silebilir.
- Şoför, yönetici ve sefer kayıtlarını yönetici sayfasından ekleyip düzeltebilir, silebilirsiniz. Şoförü "Aktif" kutusundan kapatabilir veya silebilirsiniz; kapatılan şoförün oturumu hemen sonlanır. Birden fazla yönetici hesabı açılabilir.
- 6 yanlış denemeden sonra giriş 10 dakika kilitlenir.

## 5. Yedek

- **Ayarlar > Yedek > "Yedek klasörü seç"**: Chrome veya Edge'de bilgisayarınızda bir klasör seçin. Yönetici sayfası açık kaldığı sürece her 5 dakikada `servis-yedek-son.json` ve günlük dosya yazılır.
- **"Yedeği indir"**: anlık dosya indirir.
- **"Yedekten geri yükle"**: yedek dosyasını seçer. Mevcut tüm veri yedekle değişir.
- Sayfa kapalıyken de yedek almak için `tools/backup.mjs` komutunu Windows Görev Zamanlayıcı ile günde bir çalıştırın (komutun başındaki yorum satırlarına bakın).

## 6. Güncelleme

Dosyalarda değişiklik yaptıktan sonra `npx wrangler deploy` çalıştırmanız yeterlidir. Veriler silinmez.

## Dosyalar

- `src/worker.js`: sunucu (giriş, veri, anlık yayın)
- `public/admin.html`, `public/live.js`: yönetici.)
- `public/driver.html`: şoför uygulaması
- `public/shared.js`: ortak hesaplar
- `wrangler.toml`: Cloudflare ayarı
- `tools/backup.mjs`: bilgisayara yedek komutu
