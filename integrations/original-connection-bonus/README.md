# Original connection and heart effects

The public index mounts the original green disconnection screen and original disconnect SVG. Browser offline/online events work without account setup; authenticated transport failures and recovery are supplied through the optional session adapter in src/lib/game-session.ts. A connection becomes healthy only after the transport confirms it.

SourceHeartBonus listens only to current-player verified server awards, never grants currency, never chooses random rewards, and deduplicates award IDs. Mount the session adapter once after authentication and remove it on sign-out. Feed authoritative game_lucky_gold awards as lucky:true; ordinary server-confirmed kiss awards as lucky:false. The source flight is 2 seconds, followed by a .3 second fade; the original lucky banner grows .75→1 for 1 second and fades for .3 seconds. Sound is drop from the existing public source sfx manifest. Wallet amounts remain server-owned.

The current GitHub snapshot has no authenticated room/account backend. Therefore no fabricated bonus is generated on entry or spin. The original source contains server award messages but not the server's random probabilities, eligibility, or award amounts. Exact random bonuses cannot be enabled until that authoritative service/rules are supplied. The Cloud implementation's normal mutual kiss rewards are separate and do not display the lucky banner.

Checked: offline icon load, centered popup, Escape retains connection error, online recovery on phone and desktop; independent flight/banner timing and duplicate filtering in tests and a browser effects fixture. Live authenticated bonus earning remains unverified because a testing account session was unavailable.
