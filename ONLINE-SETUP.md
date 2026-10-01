# Heart of Hearts — online setup

This ZIP contains the game **and** its Node.js multiplayer server. Extract it before uploading. Uploading only the ZIP or HTML to a static game host will not run multiplayer.

## Play locally

1. Install Node.js 22 or newer from https://nodejs.org if you do not already have it.
2. Open a terminal inside this extracted folder, alongside `package.json`.
3. Run `npm start`. No external packages or keys are required.
4. Open http://localhost:8766. Click Continue, Play, then Private or Public.

Private creates a new room and generates a ten-character code automatically. Invite friends copies an invite link. Friends can also enter the code on `/online.html`. Anyone joining needs to click Ready. Only the host starts the match or fills/removes bots. Public finds an existing open public room or creates one.

Other devices on your home network can use your computer's LAN address on port 8766 while the server is running and your firewall permits it. A localhost link works only on the same computer. Render gives you a public HTTPS link instead.

## Free hosting on Render

1. Put this folder's **contents** in a GitHub repository. Keep `package.json`, `server.js` and `render.yaml` at its root. A private repository is fine when Render has access.
2. Upload the complete extracted folder using GitHub's website, GitHub Desktop, or Git. Audio is supplied as MP3, and every file is below the website's 25 MiB per-file limit.
3. Sign into Render and select **New → Web Service**. Connect the repository.
4. Choose **Node**, build command `npm install --omit=dev`, start command `npm start`, and the **Free** instance. Health check: `/api/health`. Leave root directory empty when the contents are at repository root.
5. Deploy. Render supplies an HTTPS `onrender.com` address. Share that address with friends. The server automatically uses Render's `PORT`.

Alternatively, Render can read the included `render.yaml` as a Blueprint. It specifies one free web service and no paid database.

Render's free service sleeps after 15 minutes without traffic. Its next visitor can wait about a minute for wake-up. Active rooms are stored in server memory and disappear when the process sleeps, restarts or redeploys. Refreshing/rejoining works while that process is alive. A future persistent storage system would be needed to recover across server restarts.

Official guides: https://render.com/docs/deploy-node-express-app and https://render.com/docs/free
GitHub file limits: https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository

## Included features and limits

- Server runs the existing rules, deck shuffle, turn validation, card choices, reactions, effects and match results.
- Four seats, host controls, ready states, private invites, public open-room matching, bots and same-browser reconnect.
- Server sends only your hand and legitimately visible information. Private choices go only to their controlling player. Other players cannot submit your choices or moves.
- Eight Instants are active, including Exposed Heart. Heart Collector and Death's Door remain guaranteed. Blood Pact and Torment stay disabled, with their data and assets preserved.
- Idle turns automatically draw/end after 90 seconds. Ordinary choices default after 30 seconds; reaction windows expire without a response.
- Guest names and room sessions only. **No friends list, player login, ranked matchmaking, permanent online inventory or real payments.** Existing tickets/collections remain browser-local previews.
- Match presentation uses the existing card artwork in a separate online table. Some of the offline table's longer animations are not carried over to this first multiplayer version.
- The main menu's prepared future visual features remain disabled.
- Rooms expire after two hours without activity. This is a single-server prototype, intended for testing with friends, rather than a large public service.

Run `npm test` to check room membership, host permissions, private hands, forged requests, card choices, bots, public matching and complete matches.


Online interface update: the original artwork and table arrangement are used, your temporary character is visible, and public actions remain on screen. Play includes Join with room code. The server grants 15 seconds per next move, resets after resolution, and automatically draws/ends the turn on timeout. Response windows have their own timers. Other hands are filtered on the server, except explicit reveal/control rules and match-end results.

Guest entry screen is disabled. The existing loading screen and main menu remain active. Names are saved on this browser and editable in the menu; these are not authenticated accounts. Room chat is available through the top-left toggle in the lobby and match, with unread counts. Messages are room-only and server-filtered for the requested racial slur and common obfuscations; other profanity is permitted. Chat history is temporary, with 80 messages retained per room and no persistence after server restart.

Alyazia is freely available in Characters and Customise → Character. The current artwork is temporary; equipping her is cosmetic only. The menu player-name button saves a guest display name in this browser for future rooms/chat.

Room codes use six characters and are displayed in bold in the lobby. Alyazia artwork is included as alyazia.png at the game root and is used for lobby, table, packs, character pages and chat portraits. Chat closes when clicking outside its panel.

Version 1.2.0: mobile portrait/landscape layouts adapt on rotation. Settings are accessible during gameplay. Opening shuffle and first-player animation run before moves begin; bots pause approximately 2.8 seconds before moves. The move timer sits below the centre piles. Face-up effect cards use a compact presentation. Audio files are also supplied at the game root, with online public sound cues that do not disclose hidden draw identities.
