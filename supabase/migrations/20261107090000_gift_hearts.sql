-- 20261107090000_gift_hearts.sql
-- ureyimsen birebir: hediye (kokteyl dahil) yapışınca alıcıya fiyatı kadar kalp
-- ödenir; kalp animasyonu bardağın/hediyenin noktasından alıcının sayacına uçar.
-- 0047_air_kiss_only bunu kapatmıştı; gerçek oyunda hediye kalbi geri açılıyor.
update public.gift_prices set hearts = price where hearts = 0;
