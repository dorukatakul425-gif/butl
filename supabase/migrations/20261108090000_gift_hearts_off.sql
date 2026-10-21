-- Kullanıcı isteği: hediye atınca alıcıya kalp verilmez (0066 geri alındı).
update public.gift_prices set hearts = 0 where hearts > 0;
