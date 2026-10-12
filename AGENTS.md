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

- Keep the GitHub game on the index route and isolate Pixi/Spine imports behind dynamic browser loading, so the table remains SSR-safe.
- Load gesture order, images, prices and skeleton timing through the existing public asset manifest; scheduled entries and spending require an authenticated game-session adapter, so previews never grant VIP or spend fictitious currency.
- Keep source-derived profile presentation separate from account actions; show unknown statistics and a setup-needed state until verified profile/session data exists, while local music, decor and gift navigation remain available.
- Route chat reads, sends, translations, moderation and balances through the authenticated game-session adapter; presentation must not invent server results.
- Share gift texture preparation promises but never wait for GPU warm-up to start each click's independent animation, so repeated clicks do not batch.
- Derive the game shell from the visual viewport and safe-area insets, so mobile keyboard/browser controls do not cover the composer.
- Cloud Auth owns accounts; keep one root identity subscriber, profile presentation in a provider, and named protected home under the managed client-only gate while the public index remains the game with inline sign-in.
- Shared room membership and rounds are transactional database RPCs; subscribe and reconcile stored room/chat/event state, never simulate other players or decisions.
- Item purchases require authenticated server validation against the public source manifest and a service-only atomic wallet/event transaction; clients cannot mint currency, VIP, prices or eligibility.
- Profile photos use private storage with owner-scoped writes and signed reads; room animation samples server start times and turn counts to synchronize late joins.
