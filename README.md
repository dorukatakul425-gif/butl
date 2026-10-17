# Butl — Şişe Oyunu

TanStack Start / React oyun istemcisi ve Lovable Cloud oyun kuralları.
Masalar, sohbet, hediyeler, jestler ve engelleme Cloud Realtime'ın WebSocket bağlantısıyla güncellenir; Socket.IO sunucusu gerekmez.

## Başka bir Lovable hesabında kurulum

GitHub dosyaları tek başına çalışan bir Cloud hesabı oluşturmaz. Lovable mevcut GitHub reposunu doğrudan içe aktarmayı desteklemeyebilir: yeni bir TanStack Start projesi oluşturup kaynakları aktarın ve **o projenin Lovable Cloud bağlantısını açın**.

1. Yeni projenin oluşturduğu Cloud istemci/ortam dosyalarını koruyun. `.env`, `supabase/config.toml`, `.lovable/project.json` ve eski projenin anahtarlarını kopyalamayın. `VITE_SUPABASE_URL` ve `VITE_SUPABASE_PUBLISHABLE_KEY` yeni Cloud tarafından sağlanır.
2. Cloud'da **avatars** adlı özel (public=false) fotoğraf alanı oluşturun.
3. **Boş veritabanında**, `supabase/migrations/20261015073400_cloud_bootstrap.sql` dosyasını Lovable'a uygulatın. Bu normal SQL'dir; tüm uygulama tablolarını, güvenli işlem fonksiyonlarını, erişim kurallarını, fiyat listelerini ve canlı yayın ayarlarını içerir. Mevcut oyun veritabanında çalıştırmayın.
4. Bu birleşik kurulumu uyguladıysanız `drizzle/migrations` dosyalarını ayrıca tekrar uygulamayın. Bu dizin sürüm geçmişidir; birleşik dosya `python3 scripts/create-cloud-bootstrap.py` ile yeniden üretilir.
5. Mevcut kullanıcı adı/şifre girişi için Cloud e-posta/şifre girişini açın. Oyun kullanıcı adını dahili bir adrese çevirir; bu giriş akışında e-posta doğrulamasını kapatma kararı yeni proje sahibine aittir. Bu ayar SQL ile taşınmaz. Doğrulama açık kalırsa mevcut kullanıcı adı akışından hemen giriş yapılamaz.
6. İki yeni oyuncuyla giriş/çıkış, masa değiştirme, engelleme/engeli kaldırma, sohbet, kalp/jeton/VIP/Premium satın alma ve süre kontrolünü önizlemede test edin; ardından yayınlayın.

### Kurulum sırasında doğrulanan ayrıntılar

- Birleşik kurulumu uygulatmadan önce `drizzle/migrations` ve `drizzle.config.ts` dosyalarını projeden kaldırın (ör. `drizzle_history` klasörüne taşıyın). Lovable'ın migration aracı bu Drizzle geçmişiyle çakışır ve aksi halde SQL'i hiç çalıştırmadan durur.
- **statuses** fotoğraf alanı SQL içindeki `INSERT INTO storage.buckets` satırıyla oluşturulamaz; araç bu yazımı reddeder. Alanı arayüzden **statuses** adıyla, özel (public=false) ve 50 MB sınırında ayrıca oluşturun.
- Statü temizleme zamanlaması `create extension if not exists pg_cron;` satırıyla birlikte uygulanır; `cron` şeması yoksa zamanlama tek başına reddedilir. Zamanlama yalnızca süresi geçmiş statüleri siler; görünürlüğü zaten erişim kuralları sınırlar.
- Birleşik kurulumdan sonra aynı dizindeki `20261017001000_leagues.sql` ve `20261017120000_profile_league_cup.sql` dosyalarını bu sırayla uygulayın; lig kademe/ödül kuralları ve profil kupa alanı bu dosyalardadır.
- E-posta doğrulaması varsayılan olarak açıktır. Oyunu uçtan uca test etmek için geçici kapatılıyorsa test sonrası tekrar açın.
- `src/lib/voice-rtc.ts` içindeki oturum bildirimleri `localDescription` artık dolu varsayarak okunur; bu olmadan tip denetimi hata verir. `bunx vitest run src/test/voice-rtc.test.ts` ses odası kurallarını doğrular.

Yeni hesaplar 10.000 kalp, 10.000 test DAT ve 50 jest jetonuyla başlar. Kullanıcılar, parolalar, eski bakiyeler, mesajlar ve fotoğraflar **aktarılmaz**. Fiyat listeleri ve oyun kuralları aktarılır.

## Sınırlar

- Orijinal görsel/ses kaynakları ve müzik/video katalogları dış hizmetlerden gelir; bu hizmetlerin erişilebilirliği ve tarayıcının ses izni gerekir.
- Lig, sezon ödülleri ve bazı kaynakta bulunan puan/booster alanları için doğrulanmış hizmet yoktur; kurulum bunları uydurmaz.
- Telefon performansı ve orijinal sohbet saklama süresi henüz tamamen doğrulanmamıştır.
- Bu repo kopyası yeni Lovable hesabını veya workspace bağlantılarını otomatik eşitlemez.
- Eski export kaldırıldı: oyuncu kayıtları ve imzalı fotoğraf bağlantıları kaynak reposunda bulunmamalıdır. Önceki Git geçmişinde kalan kişisel veriler ayrıca değerlendirilmelidir; bu aktarım geçmişi yeniden yazmaz.

## VPS (kendi sunucunuz)

Aynı kod kendi sunucunuzda da çalışır: `sudo bash deploy/vps/install.sh <domain> <eposta>`. Ayrıntılı adımlar: [deploy/vps/KURULUM.md](deploy/vps/KURULUM.md). Lovable çalışması bundan etkilenmez.

## Yerel geliştirme

```sh
bun install
bun run dev
bunx vitest run
```

Cloud bağlantısı olmayan bir önizleme gerçek oyun işlemlerini yapamaz; proje sırlarını kaynak koduna eklemeyin.
