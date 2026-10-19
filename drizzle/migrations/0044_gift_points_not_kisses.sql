-- 0044_gift_points_not_kisses.sql
-- Real game: the kiss counter on the table profile grows ONLY when someone
-- kisses you. Sending a gift must NOT raise the receiver's kiss counter —
-- instead the gift pays its value as points/hearts (gold), which show in the
-- points and in the profile popup. This reverses the 0043 placeholder payout:
-- every gift's kiss payout goes back to 0 and its heart payout becomes its price.
update public.gift_prices set kisses = 0 where kisses > 0;
update public.gift_prices set hearts = price where hearts = 0;
