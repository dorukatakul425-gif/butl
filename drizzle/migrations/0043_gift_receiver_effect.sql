-- 0043_gift_receiver_effect.sql
-- Real game: when a player sends a gift, the RECEIVER's kiss counter grows by
-- the gift's heart price (the sender spends hearts, the receiver gains kisses).
-- The send_gift mechanism (0042) already pays g.kisses to the receiver's table
-- badge and profile total; this migration gives every gift its real payout:
-- kisses = price for every gift that still has the placeholder 0.
update public.gift_prices set kisses = price where kisses = 0;
