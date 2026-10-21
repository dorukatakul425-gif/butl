<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- The game lives on /game behind sign-in (/ is the profile home, /auth username sign-in); isolate Pixi/Spine imports behind dynamic browser loading, so the table remains SSR-safe.
- Load gestures, images, prices and timing from the public manifest; scheduled entries/spending need authenticated sessions. Previews never grant VIP or spend fictitious currency.
- Keep source-derived profile presentation separate from account actions; show unknown statistics and a setup-needed state until verified profile/session data exists, while local music, decor and gift navigation remain available.
- Share serialized, revision-guarded ignore across chat/photos/profiles; keep server chat IDs for deduplication/reporting. Message actions use source long-tap/double-click; never claim unavailable reports were sent. Unknown wallets stay unknown.
- Share gift texture preparation promises but never wait for GPU warm-up to start each click's independent animation, so repeated clicks do not batch.
- Derive the game shell from the visual viewport and safe-area insets, so mobile keyboard/browser controls do not cover the composer.
- Cloud owns accounts/data; use VITE_SUPABASE_URL/PUBLISHABLE_KEY and migrations. Use Cloud realtime, not socket.io: Workers cannot host persistent socket servers.
- Membership/rounds/chat/gifts use RPCs and realtime; no bots. Reconcile every DELETE (RLS redacts fields); a departure trigger normalizes rounds even without remaining clients.
- Item purchases require authenticated server validation against the public source manifest and a service-only atomic wallet/event transaction; clients cannot mint currency, VIP, prices or eligibility.
- Profile photos use private storage with owner-scoped writes and signed reads; room animation samples server start times and turn counts to synchronize late joins.
- Normalize username credentials through one deterministic internal address helper; resolve legacy names and numeric player IDs only on the server and never return account addresses, so existing accounts retain access without exposing emails.
- Complete first-entry profile setup through an owner-scoped RPC before mounting the live room; round RPCs enforce completed opposite-gender participants, so UI hiding cannot bypass eligibility.
- Apply confirmed round RPC responses and room-state events directly to React state; cache signed avatar URLs until expiry, so round controls do not wait on unrelated photo/chat reads.
- Consume transactional table-change membership directly; generation-guard reads/feeds and reset cancellable motion/media to prevent stale-room state.
- Apply sound settings before playback; autoplay recovery must respect mute and explicit pause.
- Share the pure table-layout calculation between Pixi and bottle overlays to anchor the lowest seat to the chat boundary consistently.
- Cache only resolved public purchase catalogues briefly on the server; keep every click's authenticated spending transaction independent and never cache user eligibility or results.
- Keep source Tops presentation isolated from other table dialogs; rank verified account statistics across all readable profiles, and never substitute lifetime scores for unsupported periods or allow cosmetic bottle clicks to bypass paid server transactions.
- Keep Tops help as a browser-safe original InfoDialog presentation using category-specific manifest translations; dismissing help must retain the underlying ranking selection.
- Scope bottle drawer presentation to its own selectors and measure the existing game/chat bounds; this preserves source drawer sizing and close controls without changing other dialogs or purchase rules.
- Achievement levels come from trusted event/wallet counters and source thresholds through an authenticated bridge; source-only conditions and unspecified rewards remain unavailable to prevent fabricated completion or currency.
- Keep achievement/booster presentation browser-safe behind optional session adapters; original booster inventory remains unknown until a verified seasonal-pass/league service exists.
- Attraction inbox uses structured recipient-scoped profile_notifications written atomically by harem_purchase; read/recover under user RLS and acknowledge only through the owner-checked RPC, so first admiration, transfers and releases open source dialogs without inferred rewards or duplicate banners.
- Feature dialogs require verified session state for mutations; kick/save uses atomic authenticated database RPCs, source-derived deadlines and a membership trigger for all room-entry paths. Kick pricing/free cooldown remain unconfigured until verified host values are supplied, never guessed. Participation metadata grants no privilege.
- Scope profile layout resets to the profile layer, restoring original content-box sizing and non-repeating fixed-size SVG icons without changing other source dialogs.
- Keep profile popup positioning absolute inside its fixed layer, using the source safe-area translation; relative offsets combined with flex centering shift the popup offscreen.
- Leagues are scored only by database triggers on trusted kiss/gift events and finalized lazily inside get_league; tunable numbers live in league_config/league_levels so clients never compute scores, moves or rewards.
- Composite manifest-sized original center artwork below the bottle in Pixi so layout and input remain shared.
- Roulette uses original wheel/frame/center and host-fed prizes/winners. Screenshot labels are inert, not payouts; the 2,000-spin preview never changes wallets. Only authenticated host awards persist.

- Root prints the inspector notice once client-side; no DevTools detection or execution/input blocking, to preserve operation.
- VPS hosting lives only in deploy/vps (subdirectories have their own AGENTS.md to read first); never change Lovable's .env/vite config for it, so both targets work.

- Live voice rooms join as listeners and capture microphone only on seating; reuse transceivers, serialize generation-scoped websocket signaling and recover incomplete peers on reconnect so promotion and network changes do not silently lose audio.
- Issue short-lived TURN credentials through an authenticated server function; keep the shared relay secret only in VPS server configuration, so restrictive mobile networks work without exposing permanent relay access.
- Premium live gifts (live_*) are DAT-only via send_premium_gift; their catalogue/media are static repo assets and the table plays the alpha video for every room member from premium_gift_events.
- Live gifts use acknowledged room broadcasts with IDs/start timestamps; only catalogued media is rendered, and VPS media references resolve to the confirmed hosted asset origin.

- Keep browser language/appearance preferences in the versioned app-preferences store; game text uses the source Azerbaijani dictionary and game-language error boundary independently of lobby choices, while game appearance stays isolated.
- Page lifecycle cleanup detaches transports only; authenticated server membership resumes on refresh/visibility/network return, with a bounded live lease and durable last-table preference. Explicit departure clears preference; kicks and occupied seats must never be bypassed or represented by cached players.
- Keep the mobile profile as an authenticated home subview using the existing verified profile and photo-upload callback; wallet navigation must reuse the existing shop without fabricated balances.
- Admin panel lives at /sako; roles are in user_roles via has_role, and every admin server function re-verifies the role before using the service client, so the page itself grants nothing.
- Bans live in user_bans and are enforced in the database (write triggers, session revocation) plus a root BanGuard screen, so a still-valid token cannot keep playing.
- Friends and direct messages live in friendships/direct_messages: requests/answers go through owner-checked RPCs, inserts require are_friends, and delivery uses one per-player Cloud realtime channel in src/lib/social.ts, so UI state cannot fake friendship or read others' chats.
- Profile bio lives on profiles.bio; game popups read it through the same RLS-scoped client independently of stats RPCs, refresh while open, and never reuse another player's bio. Follower/following/view counts come only from get_profile_stats and record_profile_view (unique viewer rows), so clients cannot inflate them.
- DM images/voice notes upload to the private dm-media bucket at sender/recipient/file (friend-checked policies) and the message row is delivered by Cloud realtime; bubbles read signed URLs.
- Unsend is a sender-only soft delete (unsend_message RPC wipes body/media); both sides receive it as a realtime UPDATE. User reports go to user_reports and are read/resolved only through admin server functions.

- Table and own-profile settings share ProfileInfoDialog and the authenticated profile-edit adapter; one atomic locked-row RPC validates prior state and debits information changes, while photo uploads remain separate to preserve source charging semantics.
- The league header uses get_league participation state to gate dialogs; nonparticipants receive the source bottom notice rather than an empty league dialog.
- Profile table actions derive eligibility from current room membership on every render; reject absent recipients before composing/sending, so departures cannot turn private messages into public ones. Birthday-derived zodiac indices are isolated in the browser-safe Telegram profile helper to match the source icon mapping.
- Bottle rendering falls back from original 3D textures to the selected 2D artwork, then an embedded real-bottle image; failed CDN/shader preparation must never display the white outline placeholder.
- Preserve host ranking numbers; guard overlapping reads against newer live state, and merge recovery history without resurrecting deleted bodies or clearing read receipts.
- Resolve departed chat identities through a room-scoped verified-profile cache, never current seating alone; send eligibility still requires current membership.
- Scope kick timers and gift-flight cancellation to their target and room, so seat reuse or room changes cannot inherit delayed effects or audio.

- Music/entry notices use chat_messages with typed payloads and server triggers; current rooms.music controls playback only, so reload, deduplication, deletion and 24-hour history expiry are shared with chat. Newcomer eligibility is claimed once under a locked profile row.
- Popup focus trapping depends on visibility, not callback identity; keep close callbacks in a ref so profile refreshes never steal focus from a native birthday picker.
- Every DB migration must exist in BOTH supabase/migrations/ (dated name) and drizzle/migrations/ (NNNN_name.sql); the VPS deploy only applies drizzle/migrations, so a supabase-only migration never reaches the live database.

- Telegram notifications use the configured direct bot token only after per-call admin authorization; bounded keyset batches return actual Bot API successes and failures, while media uploads require the admin’s own Telegram chat.
- Profile ribbons prefer authenticated current league promotion-band status over active VIP; original source lacks a server TOP definition, so do not claim the local rule is exact source parity.
- On each verified Telegram login, refresh display identity and accessible private-chat bio through server-only Bot API calls; distinguish confirmed removal from API failure and publish unique signed avatar paths on the browser-visible storage origin so phones never receive loopback URLs.
- Bot login, notifications and the standalone polling bot share one server-only encrypted token row; verify admin role and getMe before replacement, deny all browser DB grants and never return credentials so rotation cannot expose tokens or diverge across services.
- Insufficient-DAT contact requires both a Telegram-linked account and current Mini App initData; open a targeted draft using the selected DAT price, never send as the player or change website purchase handling.
- Gift coming-soon countdowns use one fixed campaign deadline shared by website and Telegram, never a per-visit or storage-derived start; expiry remains zero and never enables unimplemented purchases.
- Telegram-only Puanlar sections (level, activity) use top_players_extra and server-counted activity_ping minutes; level is derived client-side from gift-heart points so the threshold lives in one helper.
- Extend ordinary gift-store membership from the captured source catalog while preserving live vendor media definitions and existing authoritative prices; SQL additions must mirror client additions so every displayed gift can be purchased.
- Entrance particles are derived from server gift levels and gender, never selected frames; cancel delayed and active effects when their room, renderer or occupant changes to prevent seat-reuse leakage.
- Table backgrounds (Masa fonu) are room state on rooms.table_bg, bought only through the set_table_bg RPC that validates the fixed list and charges DAT atomically; clients render the bundled /room-assets/table-bg images and header skins from that state, so nobody can set a background for free.
- Seasonal pass (Mövsümi icazənamə) mirrors ureyimsen BottlePass: levels/rewards/config live in pass_levels/pass_config, points come only from kiss/gift triggers, and pass_info/pass_claim/pass_buy_premium/pass_claim_chest validate every claim server-side; the dialog keeps the original CSS in its lazily loaded module.

- Keep authenticated liveness in isolated room_presence, throttling legacy membership timestamps with nonblocking locks; prune only stale unlocked members after rechecking presence, so gift rewards cannot evict active seats. Room allocation waits for the selected available table instead of treating a busy lock as fullness.
- Bound visual-only gift flights and generation-cancel video callbacks; keep every acknowledged payment/event independent, so rendering bursts cannot stall membership recovery. Serialize periodic liveness checks to avoid accumulating slow RPCs.

- Keep clip zoom browser-local with the source three-state cycle and the existing iframe mounted; apply bounded portrait widths so zoom never restarts playback. Incoming addressed-chat/direct-message sound uses the source personal_message through shared SFX, once per live event, never history; the table owns a narrow DM audio subscription because the home inbox unmounts there.
- Table dialog backdrops close only their owning layer and stop portal propagation; unshaded drawers have input-catching empty-area surfaces behind their interactive contents. Local sending restores end-following before realtime echo, and follow effects depend on latest line identity rather than capped history length.
