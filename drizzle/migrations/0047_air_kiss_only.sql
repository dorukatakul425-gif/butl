-- 0047_air_kiss_only.sql
-- Real game parity (verified against the original live assets config, 567 gifts):
-- only the air_kiss gift carries kiss: 1 — it is the single gift that raises the
-- receiver's kiss counter (the number shown in the profile popup). No gift pays
-- gold/hearts to the receiver: the top-left heart balance never grows from gifts.
update public.gift_prices set hearts = 0 where hearts > 0;
update public.gift_prices set kisses = 0 where kisses > 0;
update public.gift_prices set kisses = 1 where gift_type = 'air_kiss';
