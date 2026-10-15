# Butl — VPS Kurulum Talimatı

Bu oyun **iki yerde aynı kodla** çalışır:

| | Lovable | VPS |
|---|---|---|
| Sayfa sunucusu | Lovable (Cloudflare) | Node.js (`.output/server/index.mjs`, systemd `butl`) |
| Veritabanı (SQL) | Lovable Cloud | Docker'da Postgres (self-hosted Supabase) |
| Giriş / hesaplar | Lovable Cloud Auth | Docker'da Auth (GoTrue) |
| Canlı bağlantı (WebSocket) | Lovable Cloud Realtime | Docker'da Realtime (`wss://DOMAIN/realtime/v1`) |
| Profil fotoğrafları | Lovable Cloud Storage | Docker'da Storage (`avatars`, özel) |
| HTTPS | Lovable | Caddy (Let's Encrypt otomatik) |

> **Socket.IO neden yok?** Oyunun bütün canlı işleri (masa, sohbet, hediye, jest, engelleme) Realtime
> WebSocket'iyle çalışır. Aynı servis VPS'te de kurulduğu için ayrı bir Socket.IO sunucusu gerekmez;
> eklemek iki ayrı canlı sistem demek olur ve Lovable tarafını bozar.

VPS dosyaları yalnız `deploy/vps/` altındadır. Lovable'ın `.env`, `vite.config.ts` ve kaynak kodu
değişmez; bu yüzden Lovable çalışmaya devam eder.

---

## 1. Gerekenler

- Ubuntu **22.04 veya 24.04** VPS, en az **2 vCPU, 4 GB RAM, 30 GB disk** (Supabase ~10 konteyner çalıştırır).
- Bir domain (örnek: `oyun.example.com`).
- Root (sudo) erişimi ve SSH.
- 80 ve 443 portları başka bir programda (nginx/apache) kullanılmıyor olmalı.

## 2. Domaini sunucuya yönlendirin

Domain sağlayıcınızın DNS panelinde:

| Tür | Ad | Değer |
|---|---|---|
| A | `oyun` (veya kök için `@`) | VPS IPv4 adresi |
| AAAA (varsa) | `oyun` | VPS IPv6 adresi |

Kontrol: `ping oyun.example.com` VPS IP'sini göstermeli. DNS yayılmadan kurulursa HTTPS
sertifikası alınamaz (Caddy sonra kendiliğinden tekrar dener).
Cloudflare kullanıyorsanız ilk kurulumda bulutu **gri (DNS only)** yapın.

## 3. Kodu sunucuya indirin

```bash
ssh root@VPS_IP
apt-get update && apt-get install -y git
git clone https://github.com/dorukatakul425-gif/butl.git /opt/butl
cd /opt/butl
```
Repo özelse: GitHub → Settings → Developer settings → Personal access token (repo okuma) oluşturun ve
`git clone https://KULLANICI:TOKEN@github.com/dorukatakul425-gif/butl.git /opt/butl` kullanın.

## 4. Tek komutla kurulum

```bash
sudo bash deploy/vps/install.sh oyun.example.com siz@eposta.com
```

Script sırasıyla şunları yapar (10–15 dk):

1. Docker, Node.js 22, Bun, Caddy ve ufw kurar.
2. Gizli anahtarları üretir → `/etc/butl/butl.env` (JWT secret, anon/service anahtarları, DB şifresi). **Yedekleyin.**
3. Supabase'i `/opt/butl-supabase` içine kurar; tüm portları yalnız `127.0.0.1`'e bağlar.
   Ayarlar: site adresi `https://DOMAIN`, kayıt açık, e-posta onayı kapalı (kullanıcı adı girişi dahili adres kullanır), anonim giriş kapalı.
4. Veritabanı hazır olunca: özel `avatars` alanını oluşturur, `supabase/migrations/20261015073400_cloud_bootstrap.sql`
   dosyasını uygular (tüm tablolar, oyun fonksiyonları, erişim kuralları, fiyat listeleri, canlı yayın tabloları) ve
   `drizzle/migrations` dosyalarını "uygulandı" diye kaydeder.
5. Oyunu VPS adresleriyle Node sunucusu olarak derler (`deploy/vps/build.sh`) ve `butl` systemd servisini başlatır (port 3000, yalnız localhost).
6. Caddy'yi ayarlar: `https://DOMAIN/auth/v1, /rest/v1, /realtime/v1 (WebSocket), /storage/v1` → Supabase; geri kalan her şey → oyun.
7. Güvenlik duvarında yalnız 22, 80, 443'ü açar ve servisleri test eder.

Sonunda `Oyun sunucusu: 200`, `Auth servisi: 200`, `Veri servisi: 200` görmelisiniz.
Tarayıcıda `https://oyun.example.com` → **/auth** sayfasında kullanıcı adıyla kayıt olun.

Script tekrar çalıştırılabilir: anahtarlar ve veritabanı korunur, yalnız eksikler tamamlanır.

## 5. Kontrol listesi

- [ ] İki farklı tarayıcıda (biri gizli pencere) bir kadın, bir erkek hesap açın.
- [ ] İkisi de `/game` masasına girsin: şişe dönüyor, öpüş/ret görünüyor.
- [ ] Sohbet mesajı diğer ekranda anında görünüyor (WebSocket çalışıyor).
- [ ] Hediye, jest, masa değiştirme, engelleme çalışıyor.
- [ ] Profil fotoğrafı yüklenip görünüyor (Storage çalışıyor).

## 6. Güncelleme (GitHub'daki yeni kodu almak)

```bash
cd /opt/butl && sudo bash deploy/vps/update.sh
```
`git pull` yapar, `drizzle/migrations` içindeki **yeni** SQL dosyalarını bir kez uygular, oyunu yeniden derler, servisi yeniden başlatır ve resim/CSS/JS dosyalarını `/var/www/butl` içine kopyalayıp Caddy'yi yeniler (`deploy/vps/caddy.sh`).

## 7. Faydalı komutlar

| İş | Komut |
|---|---|
| Oyun logları | `journalctl -u butl -f` |
| Oyunu yeniden başlat | `systemctl restart butl` |
| Supabase durumu | `cd /opt/butl-supabase && docker compose ps` |
| Supabase logları | `cd /opt/butl-supabase && docker compose logs -f realtime auth rest` |
| HTTPS logları | `journalctl -u caddy -f` |
| SQL konsolu | `cd /opt/butl-supabase && docker compose exec db psql -U supabase_admin -d postgres` |
| Yönetim paneli | `ssh -L 8000:127.0.0.1:8000 root@VPS_IP` → `http://localhost:8000` (admin / `DASHBOARD_PASSWORD` in `/etc/butl/butl.env`) |

## 8. Yedekleme

```bash
cd /opt/butl-supabase
docker compose exec -T db pg_dump -U supabase_admin -d postgres -Fc > /root/butl-$(date +%F).dump
tar czf /root/butl-storage-$(date +%F).tgz volumes/storage /etc/butl
```
Geri yükleme: `docker compose exec -T db pg_restore -U supabase_admin -d postgres --clean < dosya.dump`.

## 9. Sorun giderme

| Belirti | Çözüm |
|---|---|
| HTTPS açılmıyor | DNS VPS IP'sini göstermiyor ya da 80/443 kapalı. `journalctl -u caddy -n 50` |
| Giriş "Email not confirmed" | `/opt/butl-supabase/.env` içinde `ENABLE_EMAIL_AUTOCONFIRM=true` → `docker compose up -d` |
| Mesajlar canlı gelmiyor | `docker compose logs realtime`; tarayıcıda `wss://DOMAIN/realtime/v1/websocket` 101 dönmeli |
| `permission denied for table` | Bootstrap tamamlanmadı: `docker compose exec db psql ...` ile hatayı görün, boş DB'de install.sh'ı tekrar çalıştırın |
| Resimler/CSS açılmıyor (soru işaretli kutular, düz beyaz sayfa) | `cd /opt/butl && sudo bash deploy/vps/update.sh` — derlenen dosyalar `/var/www/butl` içine kopyalanır ve Caddy onları doğrudan sunar. Yalnız bu adım için: `sudo bash deploy/vps/caddy.sh` |
| 502 Bad Gateway | `systemctl status butl` ve `docker compose ps` — biri durmuş olabilir |
| RAM yetmiyor | Kullanılmayan `analytics`, `vector`, `functions`, `imgproxy` servislerini durdurabilirsiniz; oyun bunları kullanmaz |

## 10. Notlar / sınırlar

- VPS ve Lovable **ayrı veritabanlarıdır**: hesaplar, bakiyeler, mesajlar ve fotoğraflar arasında otomatik aktarılmaz. Fiyat listeleri ve oyun kuralları her ikisinde aynıdır.
- Orijinal görseller, sesler ve müzik/video katalogları dış hizmetlerden yüklenir; VPS'in internete çıkışı olmalıdır.
- Lovable'da çalışmak için hiçbir şey değiştirmeyin: Lovable kendi `.env` ve Cloudflare derlemesini kullanır; `.env.production.local` ve `.output/` yalnız VPS'te oluşur ve git'e eklenmez.
