# Heart of Hearts — handoff

For online play, run `npm start` in this folder and open http://localhost:8766. See ONLINE-SETUP.md for the free Render hosting instructions. Opening index.html alone supports the offline prototype only. Edit this existing project rather than rebuilding it.

Character artwork/selection removed. Characters menu is a placeholder. Main menu uses a simple plum background.

Files: engine.js rules/bots; cards.js definitions; app.js UI; menu.js/menu.css startup; sound-effects.js audio; artwork.js card artwork. See CURRENT-RULES.md.

Active Jokers: Mimic, Wildcard, Nullifier, Whirlwind, Calling Card, Encore. Two per game. Others archived as futureCards. Specials do not count as Legendary. Q Hearts is Heart Unveiled. Heart Collector retains internal Grim Reaper ID.

Eight Instants are active, including Exposed Heart. Pending: Special-card death handling remains provisional (previous return-to-deck behavior). Do not invent pending rules.

Instant reveal sound overlaps the specific motif after two seconds; both stop on resolution. Supplied sound files included.

Next chat should verify menu navigation: earlier section clicks were intermittent in browser testing.

