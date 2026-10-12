# Kendi Supabase + Vercel ile Kurulum (Adım Adım)

Bu rehber oyunu Lovable olmadan, kendi **Supabase** hesabın ve **Vercel** ile yayınlaman içindir.

---

## 1) Supabase projesi aç
1. https://supabase.com → **New project**. Bölge: sana yakın (örn. Frankfurt).
2. Veritabanı şifresini bir yere kaydet.
3. **Project Settings → API** sayfasından şunları kopyala:
   - `Project URL` → `SUPABASE_URL`
   - `anon / publishable key` → `SUPABASE_PUBLISHABLE_KEY`
   - `service_role / secret key` → `SUPABASE_SERVICE_ROLE_KEY` (**GİZLİ**, asla tarayıcıya koyma)
   - Project ref (URL'deki `xxxx.supabase.co` kısmı) → `SUPABASE_PROJECT_ID`

## 2) Tabloları ve fonksiyonları kur
Supabase → **SQL Editor** → aşağıdaki dosyaları **sırayla** aç, içeriğini yapıştır, **Run**:

```
drizzle/migrations/0000_real_multiplayer_accounts.sql
drizzle/migrations/0001_validate_player_signup.sql
drizzle/migrations/0002_restrict_game_rpc_anonymous_access.sql
drizzle/migrations/0003_recover_room_turns_and_secure_avatars.sql
drizzle/migrations/0004_synchronize_round_timing_and_blocked_chat.sql
drizzle/migrations/0005_player_onboarding_and_mixed_gender_rounds.sql
drizzle/migrations/0006_initial_heart_balance.sql
drizzle/migrations/0007_change_room_transaction.sql
```
Biri hata verirse dur, hatayı kaydet; sıradakine geçme.

Alternatif (terminal): `psql "<Supabase connection string>" -f <dosya>` her dosya için sırayla.

## 3) Profil fotoğrafı deposu
Supabase → **Storage → New bucket**
- Ad: `avatars`
- **Public: KAPALI** (özel). Erişim kuralları 0003 dosyasında zaten var.

## 4) Giriş ayarları (e-postasız kullanıcı adı girişi)
Supabase → **Authentication → Sign In / Providers → Email**
- **Email** sağlayıcısı: AÇIK
- **Confirm email: KAPALI** (oyun kullanıcı adını iç adrese çeviriyor, onay e-postası gitmez)
- Anonymous sign-ins: KAPALI

**Authentication → URL Configuration**
- Site URL: `https://senin-projen.vercel.app`
- Redirect URLs: `https://senin-projen.vercel.app/**` ve `http://localhost:8080/**`

## 5) Canlı (realtime) güncellemeler
Supabase → **Database → Publications → supabase_realtime**: oyun tablolarını (odalar, sohbet, olaylar) işaretli tut. Migration'lar bunu ekliyorsa zaten açıktır; kontrol et.

## 6) Kodu Vercel'e bağla
1. https://vercel.com → **Add New → Project** → GitHub'dan `butl` reposunu seç.
2. Framework: **Other** (Vite). Build Command: `npm run build` — Install: `npm install`.
3. **Environment Variables** (Production + Preview + Development):

| Ad | Değer | Nerede kullanılır |
|---|---|---|
| `VITE_SUPABASE_URL` | Project URL | Tarayıcı |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | anon/publishable key | Tarayıcı |
| `VITE_SUPABASE_PROJECT_ID` | project ref | Tarayıcı |
| `SUPABASE_URL` | Project URL | Sunucu |
| `SUPABASE_PUBLISHABLE_KEY` | anon/publishable key | Sunucu |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role key | Sunucu (hediye/bakiye/kullanıcı adı girişi) |

> Vercel derlemesi otomatik algılanır (`vite.config.ts`); `NITRO_PRESET` girmene gerek yok. Girdiysen sil.

4. **Deploy**.

## 7) Yerelde çalıştırma
Proje köküne `.env` oluştur, yukarıdaki değişkenleri yaz (service_role dahil), sonra:
```
npm install
npm run dev
```

## 8) Kontrol listesi
- [ ] Kayıt ol → yeşil ekranda cinsiyet/yaş penceresi çıkıyor
- [ ] Çıkış / tekrar giriş kullanıcı adı veya ID ile çalışıyor
- [ ] İki farklı tarayıcıda (1 kız 1 erkek) aynı masa, sohbet anlık görünüyor
- [ ] Şişe çevirme sadece sıra sende ve 1 kız + 1 erkek varken çıkıyor
- [ ] Hediye gönderince bakiye düşüyor (service_role yoksa bu adım hata verir)
- [ ] Profil fotoğrafı yükleniyor

## Sık hatalar
- **"Invalid API key" / "Expected 3 parts in JWT"**: anahtar yanlış kopyalanmış veya sunucu/tarayıcı değişkenleri karışmış.
- **Hediye/bakiye çalışmıyor**: `SUPABASE_SERVICE_ROLE_KEY` eksik.
- **Kayıtta "email not confirmed"**: 4. adımda Confirm email kapatılmamış.
- **"Nitro entry is missing! Is \"vercel\n\" preset correct?"**: `NITRO_PRESET` değerinde fazladan satır sonu var; Vercel'den bu değişkeni sil (artık gerekmiyor).
- **Fonksiyon bulunamadı (rpc)**: migration'lardan biri çalışmamış; 2. adımı sırayla tekrar kontrol et.

## Not
Lovable'daki mevcut oyuncu verileri bu yeni Supabase'e otomatik taşınmaz; yeni projede herkes yeniden kayıt olur.
