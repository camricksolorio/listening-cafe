# PRD: Vinyl Booth — A DJ Booth for Your Spotify Library

**Author:** Cam
**Status:** Draft — weekend build
**Target:** MVP live by EOD tomorrow

---

## 1. Problem Statement

Spotify's library UI is a single undifferentiated scroll: playlists and albums mixed together, sorted by recency, with no way to browse by mood or vibe. Finding "the thing I want to listen to right now" requires already remembering its name. There's no browsing experience, no sense of place, and no room for serendipity.

## 2. Vision

Turn your Spotify library into a physical-feeling space: a listening café, viewed head-on from behind the counter. You're facing a DJ booth. Vinyl shelves line the walls — vertical columns on either side, a horizontal row up top. A two-turntable DJ controller sits front-and-center at the bottom for playback. And instead of a search bar, there's a DJ standing at the booth you can just talk to — you tell them the vibe, they pull records for you.

The goal isn't to out-feature Spotify. It's to make opening your own library feel good.

## 3. Goals (MVP)

- Log in with Spotify and see your playlists + saved albums rendered as vinyl records on shelves, not a list.
- Ask the "DJ" (text chat, styled as a speech bubble) for music in natural language — mood, activity, genre, era, "something like X" — and get back a shelf of matching records pulled from **your own library**.
- Click a record to load it onto a turntable and play it via Spotify Connect (requires Premium).
- Basic turntable transport controls: play/pause, skip, scrub.
- Deployed, publicly reachable, cheap hosting.

## 4. Non-Goals (MVP)

- No new-music discovery outside your existing library/catalog search — see §7 for why.
- No collaborative/multi-user features, no social layer.
- No mobile app — responsive web only, desktop-first (the room metaphor needs width).
- No offline playback, no audio you don't already have rights to via Spotify.
- No account system of our own — Spotify OAuth is the only identity.

## 5. Users

Just you, initially. Spotify's Development Mode (see §7) caps this at a small explicit allow-list anyway, which is fine for a personal tool — no need to apply for extended quota approval, which takes weeks and isn't warranted for a single-user weekend project.

## 6. Experience Spec

### 6.1 The Room
- Full-viewport scene, roughly: top third + side columns = vinyl shelves; center = DJ + chat bubble; bottom third = DJ controller/turntables.
- Each "vinyl" is a square sleeve — cover art as the label — slotted into a shelf. Playlists and albums are visually distinct (e.g. playlists get a subtle colored spine/edge treatment; albums look like standard sleeves) so the blending problem from the original complaint is actually solved, not just re-skinned.
- Shelves are scrollable/paginated within the room (horizontal drag per shelf), not one long page scroll.
- Hover/click a sleeve → it "pulls out" slightly (CSS transform), shows title/artist, click again (or a drop target) to load it onto a turntable.

### 6.2 The DJ (search replacement)
- Chat bubble UI anchored near the DJ character/silhouette. Type a query: "something moody for a rainy commute," "upbeat 2016 rap," "that one xx-adjacent stuff I like."
- Behind the scenes this is **not** Spotify's recommendation engine (unavailable — §7). It's an LLM (Claude) doing semantic matching over the metadata of your own playlists, saved albums, and their tracks — names, artists, playlist titles/descriptions, genres where available — plus optionally issuing a few targeted Spotify catalog `search` calls if you want to allow slight discovery beyond your library.
- Response renders as a filtered/highlighted shelf ("the DJ pulled these") rather than a flat list — reinforces the spatial metaphor instead of breaking it.

### 6.3 The Turntable
- Two-deck visual, but MVP only needs one active deck logically (the second can just be cosmetic/idle, or a "next up" preview).
- Playback is controlled via the **Spotify Web Playback SDK** (browser becomes a Spotify Connect device) or by transferring playback to an already-open Spotify client. Either way, this requires **Spotify Premium** on the controlling account.
- Transport controls: play/pause, next/prev, scrub bar mapped onto the spinning record (rotate while playing is enough fidelity for a weekend build).

## 7. Technical Constraints — Read This Before You Build (important)

Spotify's Web API has been significantly locked down for new (non-grandfathered) apps, most recently in the February 2026 changes. This directly shapes what's feasible in a weekend and **changes the design of the mood-search feature from "ask Spotify for recommendations" to "search your own library intelligently."**

**What's gone for new/Development Mode apps** (as of the Nov 2024 restrictions, most still in force, plus Feb 2026 additions):
- `GET /recommendations` — gone.
- `GET /audio-features`, `GET /audio-analysis` — gone (no BPM/energy/valence/danceability data).
- Related Artists, Featured Playlists, New Releases, Artist Top Tracks, batch "Several Albums/Artists" — gone.
- Several response fields removed platform-wide: `popularity`, `followers`, some `external_ids`, and a few user-profile fields (`country`, `email`, `product`, `explicit_content`).
- `Search` pagination capped at a max `limit` of 10 per page (paginate if you need more).
- Playlist track endpoints renamed `/tracks` → `/items`.
- Save/follow/unfollow/contains endpoints consolidated into generic `PUT/DELETE/GET /me/library` (accepts URIs, not just IDs).

**What still works and is enough for this MVP:**
- Authorization Code + PKCE OAuth login.
- `GET /me` (minus the removed fields above).
- `GET /me/playlists`, `GET /playlists/{id}`, `GET /playlists/{id}/items`, `POST /me/playlists` (current user only).
- `GET /me/library` (saved albums/tracks), `PUT/DELETE /me/library`.
- `GET /search` (10 results/page — paginate).
- `GET /me/top/tracks`, `GET /me/top/artists`, `GET /me/player/recently-played`.
- Playback: Web Playback SDK + `/me/player/*` endpoints (play, pause, seek, transfer, queue) — **requires the account to have Premium**.

**Development Mode constraints:**
- The app owner's Spotify account **must have an active Premium subscription**, or the whole app stops working.
- New Development Mode apps have a small explicit user allow-list (historically 25 users) — irrelevant for a single-user tool, just don't plan on this being public day one.

**Net effect on the design:** the "DJ finds music by mood" feature can't be built on Spotify's own recommendation/audio-feature stack. It has to be built as an LLM-driven semantic search over metadata you already have (your playlist/track/artist names, playlist descriptions, genres from artist objects where still queryable one-at-a-time). This is arguably a *better* fit for the original complaint anyway — the problem was "I can't find things in my own library," not "Spotify doesn't recommend well."

## 8. Architecture (MVP)

- **Framework:** Next.js (App Router), deployed as a single app — API routes double as your backend, no separate service needed for a weekend build.
- **Auth:** Spotify OAuth 2.0, Authorization Code + PKCE flow, token exchange in a Next.js API route, refresh token stored in an httpOnly cookie (or a minimal server-side session — even SQLite is overkill for one user, but a single JSON/SQLite file works fine if you want persistence across restarts).
- **Data fetching:** Client calls your Next.js API routes; those routes call Spotify with the server-held access token. Keep client secret server-side only.
- **Mood search:** Next.js API route takes the chat query + a cached snapshot of the user's library metadata (refresh periodically, not on every request — avoid rate limits), sends both to Claude via the Anthropic API, gets back a ranked list of playlist/album/track IDs + a short "why," renders that as the pulled shelf.
- **Playback:** Spotify Web Playback SDK loaded client-side; a small `/api/player/*` set of routes proxy transport commands if you want to keep the SDK token exchange server-mediated.
- **Rendering:** the room scene can be plain CSS/SVG positioning to start — you don't need a canvas/WebGL engine for static shelves and a couple of rotating divs. Save that for a v2 if you want more spectacle.

## 9. Hosting (cheap, fast to stand up)

Since it's Next.js with API routes and no heavy background jobs, the two low-effort options:
- **Vercel free/hobby tier** — zero-config Next.js deploys, environment variables for your Spotify client ID/secret and Anthropic key, done in minutes. Simplest path to "deployed by tomorrow."
- **A $4–6/mo VPS** (Hetzner, DigitalOcean droplet) running the app under `pm2` or Docker behind Caddy/nginx for TLS, if you'd rather not touch Vercel. More setup time, more control.

For a one-day deadline, Vercel is the pragmatic call — you can always move to a VPS later once the app is real.

One thing to set correctly regardless of host: your Spotify app's **Redirect URI** in the Spotify Developer Dashboard must exactly match your deployed URL's callback route (including protocol and trailing slash behavior), or OAuth will fail — worth confirming before you start debugging anything else.

## 10. MVP Cut List (what to skip to hit "EOD tomorrow")

Build, in order:
1. OAuth login + fetch/render playlists & albums as static shelves (no interactivity yet).
2. Click-to-load onto one turntable + play/pause via Web Playback SDK.
3. Chat bubble → Claude-backed mood search over cached library metadata → re-render shelf as filtered results.

Cut without guilt if time runs short:
- Second turntable (make it cosmetic only).
- Scrub/seek (play/pause/skip is enough).
- Any account persistence — reauth on every session is fine for a personal tool.
- Catalog-search-based discovery beyond your library (library-only search is a complete, shippable feature on its own).

## 11. Success Criteria

- You can log in, see your real library rendered as a room, type a mood, and get back a shelf of your own music that actually fits — in under a few seconds.
- You can click something and hear it play.
- It's deployed at a URL you can open on your phone browser and show someone.

## 12. Open Questions

- Do you want the DJ's replies to have any personality/voice, or purely functional ("here's what I found")?
- Library metadata caching: refresh on login only, or on a timer/manual "reshelve" button?
- Is genre data worth fetching per-artist (one call each) given it's no longer batchable, or skip genre entirely and lean on track/artist/playlist names for the LLM matching?
