# Verified achievement integration

The active source views subscribe through `src/lib/achievement-session.ts`. They never fabricate completed levels. This repository is currently an account-free game snapshot; it does not contain the Cloud account client, auth middleware, wallets or game-event tables used by the verified integration.

The accompanying bridge and server function are the working Cloud implementation, kept outside `src` so this snapshot remains buildable. After restoring the existing authenticated game/account integration: apply the provided migration after migrations 0000–0008; place the bridge under `src/components/table` and function under `src/lib`; mount CloudAchievementBridge once beside SourceAchievementNotifications. Preserve the authenticated bearer middleware in src/start.ts. The bridge requires the existing cloud-account provider, generated Cloud client, auth middleware, server client, and purchase-manifest.server module. Do not replace those with public clients or simulated game events.

Verified gift/gesture/round transactions increment owner-scoped counters. Source-manifest thresholds unlock each level once; the completion window is acknowledged through an owner-only RPC. Tested in the Cloud game by sending five paid coffee gifts: Barista unlocked, popup appeared, acknowledgement persisted, icon restored original colors.

No reward amount is supplied by the source manifest, so no currency reward is invented. Booster presentation includes all five original items and help/details, but no inventory, season-pass or league service exists here; counts remain unknown and activation is unavailable. These require authoritative reward and inventory rules before enabling.
