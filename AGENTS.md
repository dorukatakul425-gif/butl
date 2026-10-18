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
- Use authenticated subscriptions for connection, heart awards and harem inbox; deduplicate events, acknowledge confirmed notices, and never infer rewards or prices.
- Feature dialogs require verified session state for mutations; kick/save uses atomic authenticated database RPCs, source-derived deadlines and a membership trigger for all room-entry paths. Kick pricing/free cooldown remain unconfigured until verified host values are supplied, never guessed. Participation metadata grants no privilege.
- Scope profile layout resets to the profile layer, restoring original content-box sizing and non-repeating fixed-size SVG icons without changing other source dialogs.
- Keep profile popup positioning absolute inside its fixed layer, using the source safe-area translation; relative offsets combined with flex centering shift the popup offscreen.
- Leagues are scored only by database triggers on trusted kiss/gift events and finalized lazily inside get_league; tunable numbers live in league_config/league_levels so clients never compute scores, moves or rewards.
- Composite manifest-sized original center artwork below the bottle in Pixi so layout and input remain shared.
- Roulette uses original wheel/frame/center and host-fed prizes/winners. Screenshot labels are inert, not payouts; the 2,000-spin preview never changes wallets. Only authenticated host awards persist.

- Root prints the inspector notice once client-side; no DevTools detection or execution/input blocking, to preserve operation.
- VPS hosting lives only in deploy/vps (subdirectories have their own AGENTS.md to read first); never change Lovable's .env/vite config for it, so both targets work.

- Live voice rooms join with presence only; acquire microphone on seating and camera on explicit seated action, reusing sendrecv transceivers so listener promotion requires no schema change.
- Live gifts use acknowledged room broadcasts with IDs/start timestamps; only catalogued media is rendered, and VPS media references resolve to the confirmed hosted asset origin.

- Keep browser language/appearance preferences in the versioned app-preferences store, with SSR-safe Azerbaijani/light defaults and storage-event synchronization; exclude /game from appearance and translations to preserve the existing game.
- Keep the mobile profile as an authenticated home subview using the existing verified profile and photo-upload callback; wallet navigation must reuse the existing shop without fabricated balances.
- Admin panel lives at /sako; roles are in user_roles via has_role, and every admin server function re-verifies the role before using the service client, so the page itself grants nothing.
- Bans live in user_bans and are enforced in the database (write triggers, session revocation) plus a root BanGuard screen, so a still-valid token cannot keep playing.
- Friends and direct messages live in friendships/direct_messages: requests/answers go through owner-checked RPCs, inserts require are_friends, and delivery uses one per-player Cloud realtime channel in src/lib/social.ts, so UI state cannot fake friendship or read others' chats.
- Profile bio lives on profiles.bio; game popups read it through the same RLS-scoped client independently of stats RPCs, refresh while open, and never reuse another player's bio. Follower/following/view counts come only from get_profile_stats and record_profile_view (unique viewer rows), so clients cannot inflate them.
- DM images/voice notes upload to the private dm-media bucket at sender/recipient/file (friend-checked policies) and the message row is delivered by Cloud realtime; bubbles read signed URLs.
- Unsend is a sender-only soft delete (unsend_message RPC wipes body/media); both sides receive it as a realtime UPDATE. User reports go to user_reports and are read/resolved only through admin server functions.

- Table and own-profile settings share ProfileInfoDialog and the authenticated profile-edit adapter; one atomic locked-row RPC validates prior state and debits information changes, while photo uploads remain separate to preserve source charging semantics.
- League competition has no visible game entry points (table header, settings, profile cup); retain historical league data/services without exposing them or deleting earned records.
