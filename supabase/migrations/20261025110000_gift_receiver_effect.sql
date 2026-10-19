-- Real game: the gift receiver's kiss counter grows by the gift's heart price.
update public.gift_prices set kisses = price where kisses = 0;
