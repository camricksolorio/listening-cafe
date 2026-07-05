# Vinyl Booth — Scene / UI Layout Spec

Working description of the background scene structure, based on initial napkin sketch. For layout/coordinate reference during build — not final visual design.

---

## Scene Regions

### `speaker-left` / `speaker-right`
- Standalone standing speaker units, one on each far side — **outside** the shelf columns entirely. These own the outermost corners of the scene.
- Each is a single unit containing, top to bottom:
  1. Top woofer (circle)
  2. Middle horn/tweeter (X/square)
  3. Bottom woofer (circle)
- Mirrored pair, purely decorative framing — not part of the shelving/browsing content.

### `shelf-left` / `shelf-right`
- Sit **inside** the speakers, one column in from each edge — mirrored pair, spanning full height between the speakers.
- Each column is a simple stacked shelf with **3 square slots** (uniform, not mixed types).
- Reusable mirrored component.

### `shelf-top`
- Horizontal band connecting the two verticals across the top-center.
- Sits structurally between/behind the tops of `shelf-left` and `shelf-right` — does **not** reach the floor, shorter and narrower than the side columns.
- Wood-grain ledge/lip along its top edge.
- Divided into rows/columns underneath the ledge — its own shelf grid, distinct from the side columns (different slot proportions, since it's a wider-but-shorter band).

### `center-focal`
- Sits in the negative space below `shelf-top`, between `shelf-left` and `shelf-right`, roughly at eye level.
- Hosts the **DJ sprite** — the DJ character stands on a ledge here.
- Doubles as the anchor point for the chat/search interaction (speech bubble originates from this region).

### `dj-controller`
- Bottom-center, the booth counter surface.
- Twin circular jog wheels (left/right) = the two turntables/playback platters.
- Center cluster: vertical fader strips + small square knob/pad elements — playback/transport controls.

### `booth-front`
- Bottom trim, below `dj-controller`.
- Decorative scalloped/valance detail along the front edge of the booth.

---

## Region Map (updated)

| Region | Spans | Role |
|---|---|---|
| `speaker-left` | outermost left edge, full height | standalone standing speaker (woofer/horn/woofer) — decorative framing, not browsable |
| `speaker-right` | outermost right edge, full height | mirror of `speaker-left` |
| `shelf-left` | full height, one column in from `speaker-left` | vertical record browsing column — 3 uniform square slots |
| `shelf-right` | full height, one column in from `speaker-right` | mirror of `shelf-left` |
| `shelf-top` | top band, spanning between `shelf-left` and `shelf-right`, doesn't reach floor | secondary horizontal shelf grid |
| `center-focal` | center, below `shelf-top`, between the two shelf columns | DJ sprite standing on a ledge; chat bubble anchor |
| `dj-controller` | bottom-center | turntables + playback controls |
| `booth-front` | bottom trim | decorative |

**Left-to-right order:** `speaker-left` → `shelf-left` (3 square slots) → `shelf-top` (spans center) → `shelf-right` (3 square slots) → `speaker-right`

---

## Layering Notes (for build)

Rough z-order, back to front:
1. Background plate / room ambience (walls, floor, lighting)
2. `speaker-left`, `speaker-right` (standalone decorative units, outermost)
3. `shelf-left`, `shelf-right`, `shelf-top` (structural wood shelving)
4. Vinyl sleeves (data-driven, positioned into shelf slot coordinates — 3 square slots per side column)
5. `center-focal` ledge + DJ sprite
6. Chat bubble (appears above/beside DJ sprite on interaction)
7. `dj-controller` + `booth-front` (foreground, closest to viewer)

## Open Questions
- DJ sprite: static idle image for MVP, or does it need multiple states (idle / listening / responding)?
- With only 3 square slots per side column (6 total across `shelf-left`/`shelf-right`) plus whatever `shelf-top` holds, is that meant to be a small "featured/curated" set (e.g. DJ's picks, currently-relevant results) rather than a browse-your-whole-library view? Full library browsing will need a different, larger-capacity region or a scroll/paginate mechanic within these slots.
- Chat bubble placement: fixed position near `center-focal`, or does it follow/attach dynamically to the DJ sprite if the layout shifts responsively?
