"""Assemble a fresh-project setup from application migrations, never user data."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent.parent
parts = ["-- Fresh Lovable Cloud project ONLY. Do not apply to an existing game database.\n"
         "-- Application schema/catalogues only: no users, wallets, chat or signed URLs.\n"
         "-- Create the private avatars bucket through Lovable Cloud before applying.\n"]
for migration in sorted((ROOT / "drizzle/migrations").glob("*.sql")):
    sql = migration.read_text()
    # Ensure each created public table has its grants directly after its declaration.
    def grant_table(match):
        statement, table = match.group(0), match.group(1)
        public_catalogue = table.endswith("_prices") or table.endswith("_packages")
        grants = f"\nGRANT SELECT ON public.{table} TO authenticated;\nGRANT ALL ON public.{table} TO service_role;"
        if public_catalogue or table == "profiles":
            grants += f"\nGRANT SELECT ON public.{table} TO anon;"
        return statement + grants
    sql = re.sub(r"create table(?: if not exists)? public\.(\w+)\s*\([^;]+\);", grant_table, sql, flags=re.I)
    parts.append(f"\n-- Source: {migration.name}\n{sql}\n")

parts.append("""
-- Catalogue entries installed outside historical DDL, required on fresh projects.
INSERT INTO public.premium_packages(id, price, days) VALUES ('pass30',499,30)
ON CONFLICT (id) DO UPDATE SET price=excluded.price, days=excluded.days;
INSERT INTO public.bottle_prices(bottle, price, vip_only) VALUES
('autumn',5,false),('baby',5,false),('champagnebot',5,false),('cognac',5,false),
('cola',5,false),('jackdaniels',5,false),('ketchup',5,false),('lemonade',5,false),
('martinibot',5,false),('milkbot',5,false),('nybottle',3,false),('pirate',5,false),
('ship',5,false),('skeleton',5,false),('skewer',5,false),('spring',5,false),
('sprite',5,false),('standart',5,false),('summer',5,false),('vipbottle',5,true)
ON CONFLICT (bottle) DO UPDATE SET price=excluded.price, vip_only=excluded.vip_only;

-- PostgreSQL grants EXECUTE to PUBLIC by default. Close that implicit access.
REVOKE EXECUTE ON ALL FUNCTIONS IN SCHEMA public FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.join_room(), public.leave_room(), public.heartbeat(),
public.room_tick(bigint), public.spin_bottle(), public.decide(boolean),
public.send_chat(text,uuid), public.send_gift(text,uuid[],integer), public.send_gesture(text),
public.my_room(), public.server_now(), public.list_tables(), public.change_table(bigint),
public.buy_bottle(text), public.buy_decor(text), public.set_decor(text,text),
public.play_music(text,jsonb), public.buy_tokens(integer), public.claim_daily_bonus(),
public.buy_gold(integer), public.buy_vip(text), public.buy_premium(text),
public.top_players(text,text), public.my_achievements(), public.ack_achievement(text,integer),
public.user_achievements(uuid), public.user_profile_stats(uuid),
public.block_user(uuid,boolean), public.harem_purchase(uuid) TO authenticated;
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;
""")
destination = ROOT / "supabase/migrations/20261015073400_cloud_bootstrap.sql"
destination.write_text("\n".join(parts))
print(f"Created {destination.relative_to(ROOT)} from {len(parts)-2} application migrations.")