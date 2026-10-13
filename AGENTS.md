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
- Load gesture order, images, prices and skeleton timing through the existing public asset manifest; scheduled entries and spending require an authenticated game-session adapter, so previews never grant VIP or spend fictitious currency.
- Keep source-derived profile presentation separate from account actions; show unknown statistics and a setup-needed state until verified profile/session data exists, while local music, decor and gift navigation remain available.
- Route chat reads, sends, translations, moderation and balances through the authenticated game-session adapter; presentation must not invent server results.
- Share gift texture preparation promises but never wait for GPU warm-up to start each click's independent animation, so repeated clicks do not batch.
- Derive the game shell from the visual viewport and safe-area insets, so mobile keyboard/browser controls do not cover the composer.
- The user's own Supabase project owns accounts and data (browser client from VITE_SUPABASE_URL/ANON_KEY, schema in supabase/schema.sql); no server functions are required so the site deploys to Vercel as-is.
- Room membership, rounds, chat and gifts are security-definer RPCs with realtime feeds; there are no bots, empty seats stay empty, and clients only render server state and nudge expired phases via room_tick.
- Item purchases require authenticated server validation against the public source manifest and a service-only atomic wallet/event transaction; clients cannot mint currency, VIP, prices or eligibility.
- Profile photos use private storage with owner-scoped writes and signed reads; room animation samples server start times and turn counts to synchronize late joins.
- Normalize username credentials through one deterministic internal address helper; resolve legacy names and numeric player IDs only on the server and never return account addresses, so existing accounts retain access without exposing emails.
- Complete first-entry profile setup through an owner-scoped RPC before mounting the live room; round RPCs enforce completed opposite-gender participants, so UI hiding cannot bypass eligibility.
- Apply confirmed round RPC responses and room-state events directly to React state; cache signed avatar URLs until expiry, so round controls do not wait on unrelated photo/chat reads.
- Change tables through an authenticated transactional RPC and restart the room subscription after confirmation; never navigate icons to their image assets.
- Share the pure table-layout calculation between Pixi and bottle overlays to anchor the lowest seat to the chat boundary consistently.
- Cache only resolved public purchase catalogues briefly on the server; keep every click's authenticated spending transaction independent and never cache user eligibility or results.
- Keep source Tops presentation isolated from other table dialogs; rank verified account statistics across all readable profiles, and never substitute lifetime scores for unsupported periods or allow cosmetic bottle clicks to bypass paid server transactions.
- Keep Tops help as a browser-safe original InfoDialog presentation using category-specific manifest translations; dismissing help must retain the underlying ranking selection.
- Scope bottle drawer presentation to its own selectors and measure the existing game/chat bounds; this preserves source drawer sizing and close controls without changing other dialogs or purchase rules.
- Achievement levels come from trusted event/wallet counters and source thresholds through an authenticated bridge; source-only conditions and unspecified rewards remain unavailable to prevent fabricated completion or currency.
- Keep achievement/booster presentation browser-safe behind optional session adapters; original booster inventory remains unknown until a verified seasonal-pass/league service exists.
- Present connection state and deduplicated heart awards through optional authenticated session subscriptions; animation never grants currency or guesses lucky-award probabilities.
- Keep change-table/settings/league/roulette/pass presentation behind a browser-safe optional feature-session boundary; only confirmed host responses may change membership, inventory or show earned rewards, so adding views never installs a backend or invents player state.
- Render roulette using the original separate wheel, frame and center artwork; keep operational prize sectors and winner records host-fed; screenshot-derived fallback labels are non-interactive artwork only, never a payout catalogue.
- Keep the 2,000-spin roulette preview isolated from wallets and inventory; it may exercise source animation, sounds and reward presentation, but only authenticated host results may persist awards.
