- [x] Add detailed profile view using existing account fields and upload action.
- [x] Add persistent AZ/TR/RU/EN languages and appearance control; preserve game.
- [x] Compact and reorder header controls.
- [x] Translate the existing Messages tab unavailable notice in all four languages.
- [ ] Verify signed-in profile, upload, and live flows on repository host (needs existing host session).
- [x] App-style profile: no kisses/gold/DAT; followers, following, views; bio/status editing; SVG icons.
- [x] Tap other players to open their profile (counts a view).
- [x] Image and voice messages in chat over realtime.
- [ ] Apply migration 0024 on the hosting database.
- [x] Unsend DMs, detailed report popup to admin, app-style live rooms list.
- [ ] Apply migration 0025 on the hosting database.
- [x] Connect saved home-profile bio to game popups independently of the stats migration; test save/read/update/clear.
- [ ] Verify bio save-to-popup on the repository host (blocked by unavailable host session).
- [x] Match Telegram profile popup sizing and icon layout; verify mobile/desktop (isolated real component, 320/390/844/1280px).
- [x] Implement authenticated source-derived kick/save behavior and rule tests (11 database tests; 23 total passing).
- [ ] Apply migration 0028 on hosting database and set verified kick price/free cooldown (archive contains no values; host access unavailable).
- [ ] Verify live two-player kick/save after hosting migration/configuration (host session unavailable).
- [x] Commit requested popup and kick/save changes directly to main (6edc78b).
- [x] Fix mobile profile popup right-shift; full production CSS centered at 320/390/430/844/1280px before and after stats expansion.
- [x] Recheck Telegram archive and IMG_4146/4147: source timing/VIP rules confirmed; numeric price/base cooldown absent.
- [x] Correct fresh VPS migration tracking to apply post-bootstrap features including kick/save; 18 focused tests passed.
- [ ] Apply verified heart price/base cooldown and verify two-player live operation (blocked by missing numeric Telegram settings and VPS host access/address).

- [x] Match table settings and shared profile-settings flow to original Telegram source; remove league header/settings/profile-cup entries.
- [x] Implement source-verified first free / subsequent 20-heart information changes and free photo-only edits; 41 focused tests passed; phone/desktop dialog controls checked.
- [ ] Apply migration 0029 on VPS and verify signed-in save/photo/wallet on repository host (blocked by unavailable host access/session).
- [x] Deliver settings changes directly to main.
- [x] Fix active-VIP bottle eligibility without changing purchase validation.
- [x] Match Telegram avatar proportions, off-table profile actions/notices, name badges and zodiac.
- [x] Show message report icon only on selection; remove season pass and center remaining header icons.
- [x] Run all 231 tests; verify off-table gift/message/kick notices and centered popup in isolated real-component browser checks at 393×596 and 1280×1800.
- [x] Deliver profile/VIP changes to butl (f254a3d).
- [ ] Verify these changes with the user's VIP account on live VPS (blocked by unavailable authorized host access/session).
- [x] Replace outline bottle fallback with selected real artwork and an offline real-bottle fallback; 236 tests passed and six real bottle types plus offline fallback visibly checked.
- [x] Deliver bottle fix to butl main (6a53c78); downloaded committed offline artwork matches tested bytes.
- [x] Compare available Telegram frontend with current table/music/gifts and profile/chat/realtime; fix verified ranking, departed-chat, recovery, stale-auth, gift-flight and kick-sound defects without restoring removed league/pass features.
- [x] Run 258 regression tests; visibly check the actual Pixi bottle and MusicView controls at 393×596 and 1280×1800 with no page errors.
- [x] Deliver verified parity fixes to butl main (8837503).
- [ ] Verify full signed-in multiplayer parity on the live host (blocked by unavailable authorized VPS access and original-game authenticated session).
- [done] Change-table kickout info (black popup) + roulette original layout pushed to repo (d9ad3c2); VPS deploy pending user

## Current Telegram parity request
- [x] Announce newcomer once per account.
- [x] Keep birthday selector open and match birthday chat announcement.
- [x] Add gift-screen real audio/video music shortcuts.
- [x] Persist music chat notices with message retention.
- [x] Match bottom black table cooldown notice with finite seconds.
- [x] Gate league popup by actual participation; show 100-kiss notice otherwise.
- [x] Run regression tests, deliver to repo, deploy and verify available live flows.

- [ ] Verify signed-in live multiplayer music purchase/reload and birthday gift flow (blocked: no authorized player session; deployment and 272 regression tests verified).

- [x] Chat reply arrow (Ciliz parity): green arrow on viewer-addressed messages, tap addresses sender; translate option fixed in message actions (deployed)
- [x] Performance parity with Ciliz: dirty-frame Pixi rendering (no GPU draw when scene idle), antialias off + DPR cap 2 on mobile, canvas resize guard, chat capped at 100 lines, expiry scan 1s→15s, block list republish only on change (deployed)

## Live voice reliability
- [ ] Fix websocket negotiation recovery and mobile audio playback; provision authenticated TURN relay on VPS.
- [ ] Verify audio transmission using real browser peers and deployed relay.
