-- 20261025120000_gift_points_not_kisses.sql (mirror of drizzle 0044)
-- Kiss counter grows only on kisses; gifts pay points/hearts (gold) instead.
update public.gift_prices set kisses = 0 where kisses > 0;
update public.gift_prices set hearts = price where hearts = 0;
