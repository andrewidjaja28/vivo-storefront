# Vivo — Design System

Research-grade peptides storefront. Editorial-clinical: warm cream base, a single sage
accent, sharp corners everywhere, serif display headings against mono data labels.
Voice is Research-Use-Only (clinical, restrained, no health claims).

> Source of truth: the `:root` custom properties duplicated in each page's inline
> `<style>`. This document and `design-tokens.json` mirror those values 1:1.

---

## 1. Design principles

1. **Sharp corners, always.** `border-radius: 0` on every element (buttons, cards,
   inputs, chips, media). This is a hard shape-lock — never introduce rounded corners.
2. **One accent.** Sage (`#3D5C36`) is the only brand accent — active states, primary
   hovers, mono labels. Category colors are used *only* to code product research areas.
3. **Warm neutral base.** Cream `#fffef2` page background, warm sand `#EDE4D0` for
   alternating sections. No pure white, no cool greys.
4. **Three type roles.** Serif display (Forum) for headings, sans (SF Pro) for product
   names + UI + body, mono for labels/data/prices/banner.
5. **Aesop button language.** 1px borders, fill-invert on hover, sentence/upper case,
   the `cubic-bezier(.645,.045,.355,1)` easing curve.
6. **Clinical surfacing.** Data shown as spec sheets and mono labels; copy stays
   Research-Use-Only compliant (no personal-use or therapeutic framing).

---

## 2. Color

### Brand & accent
| Token | Hex | Use |
|---|---|---|
| `--sage-deep` | `#3D5C36` | Primary brand accent, active states, primary-button hover, mono labels |
| `--sage-tint` | `#E4E9DE` | Soft green wash, inactive-hover backgrounds, chips |
| `--sand` | `#EDE4D0` | Warm beige alternating-section background |
| `--amber` | `#C4913A` | Kicker/eyebrow accent (also the Skin category) |
| `--champagne` | `#E4BC7A` | Champagne accent text (on clay buttons) |
| `--clay` | `#7B3B34` | Deep red-brown (also the Recovery category) |
| `--clay-deep` | `#5C2A24` | Darker clay, champagne-button fill |
| `--slate` | `#3A5268` | Cool blue-grey (also the Metabolic category) |

### Neutrals
| Token | Value | Use |
|---|---|---|
| `--black` | `#1C1A17` | Primary dark — CTAs, announcement bar, Add-to-cart |
| `--white` | `#fffef2` | Cream page background (the "white") |
| `--ink` | `#2e2c28` | Body + heading text |
| `--muted` | `#6b6760` | Secondary/caption text |
| `--line` | `rgba(28,26,23,.12)` | Hairline borders and dividers |

### Category colors (research areas)
Used only to color-code products (filter lines, card placeholder, vial caps/labels).
| Area | Hex |
|---|---|
| Recovery | `#7B3B34` |
| Skin & Renewal | `#C4913A` |
| Mind & Energy (vitality) | `#3D5C36` |
| Metabolic | `#3A5268` |

---

## 3. Typography

### Families
| Token | Stack | Role |
|---|---|---|
| `--display` | `"Forum","Cormorant Garamond",Georgia,serif` | Editorial serif for headings (h1–h3) |
| `--sans` | `"SF Pro Display","SF Pro Text",-apple-system,…,sans-serif` | Body, UI, **product titles** |
| `--serif` | `"Cormorant Garamond",Georgia,serif` | Italic taglines / accents |
| `--mono` | `ui-monospace,"SF Mono",Menlo,Consolas,monospace` | Labels, spec data, prices, banner |

### Scale & rules
- **Body:** `--sans`, `line-height:1.6`, color `--ink`, on `--white`.
- **Headings (h1–h3 base):** `--display`, weight `400`, `line-height:1.05`,
  `letter-spacing:-1.5px`. The tight `-1.5px` tracking is a signature — apply to all headings.
- **Product title (PDP `h1`):** overrides to `--sans`, weight `500`,
  `clamp(2.5rem,5.6vw,4rem)`. Product names are sans, not serif, on every surface
  (PDP, shop cards, home cards, related).
- **Section tagline (`.details h2`):** `--display`, `clamp(2rem,3.6vw,3rem)`, `line-height:1.1`, `max-width:17ch`.
- **Italic tagline (`.tagline`):** `--serif` italic, `clamp(1.3rem,2.4vw,1.7rem)`.
- **Small labels / kickers / spec labels / dosage label:** `--mono`, weight `600`,
  `~.7rem`, `letter-spacing:.14em`, `text-transform:uppercase`. Color is `--sage-deep`
  for spec-sheet labels, `--ink` for the dosage label, `--amber` for kickers.
- **Announcement banner:** `--mono`, uppercase, weight `600`, `letter-spacing:.14em`,
  `clamp(.5rem,2.1vw,.64rem)`.

---

## 4. Layout & spacing

| Token | Value | Use |
|---|---|---|
| `--maxw` | `1600px` | Max content width |
| `--gutter` | `clamp(18px, 4.5vw, 80px)` | Page side padding |
| `--bar-h` | `34px` | Fixed announcement-bar height |

- **Section vertical padding:** `clamp(64px, 9vw, 110–120px)` (tighter sections use `clamp(44px,5.5vw,80px)`).
- **Split layouts:** the recurring pattern is an asymmetric/50-50 two-column split
  (text + media). Details section = text column + floating-vial video. Quality section
  uses a `2fr / 1fr` asymmetric grid.
- **Grid over flex math** for multi-column. Single page container centered with `--maxw`.

---

## 5. Motion

| Token / use | Curve | Duration |
|---|---|---|
| `--ease-out` | `cubic-bezier(0.23, 1, 0.32, 1)` | reveals, parallax |
| `--ease-drawer` | `cubic-bezier(0.32, 0.72, 0, 1)` | cart drawer |
| Buttons (Aesop curve) | `cubic-bezier(.645,.045,.355,1)` | `.25s` |
| Segmented control | `cubic-bezier(.645,.045,.355,1)` | `.22s` |
| Accordion open | `cubic-bezier(.16,1,.3,1)` | `.44s` |
| Accordion close | `cubic-bezier(.7,0,.84,0)` | `.30s` |

All motion respects `prefers-reduced-motion: reduce`.

---

## 6. Components

### Button (`.btn`)
Base: `inline-flex`, weight `500`, `.82rem`, `letter-spacing:.02em`,
`padding:1.15em 2em`, `min-height:54px`, `border-radius:0`, `1px solid` border,
transition `.25s` on the Aesop curve. **All variants invert fill on hover.**

| Variant | Rest | Hover |
|---|---|---|
| `.btn-primary` | black fill, white text | sage fill |
| `.btn-dark` | transparent, black text + border | black fill, white text |
| `.btn-champ` | clay-deep fill, champagne text | champagne fill, clay text |
| `.btn-ghost` | white fill, ink text | transparent, white text, faint border |
| `.btn-light` | transparent, white text + border | (fill-invert) |

PDP **Add to cart** is a solid-black exception (`.pdp .add`): black fill / white text,
hover lightens to `#36312a`. Added state goes sage.

### Dosage selector (segmented control)
One connected control, `1px solid --ink` border, equal segments joined by hairline
dividers (no gaps), sharp corners. Each segment stacks dose over price (mono). Active
segment = `--sage-deep` fill, white text; inactive hover = `--sage-tint` wash.

### Spec sheet (`.dspec` / `.drow`)
Definition-list data table. Two columns: mono uppercase `--sage-deep` label (fixed
width) + value, separated by a vertical `--line` rule, with hairline rows top & bottom.
Used for the details section (Mechanism / Studied for / Composition).

### Card (`.card`)
Sharp, borderless; per-product placeholder color via `--ph`. Product name in `--sans`
weight `500`, `-1px` tracking, hovers to `--sage-deep`. Media on top, body below.

### Accordion (FAQ)
Native `<details>/<summary>`, list-style none, `+ / −` marker, hairline top/bottom.
Animated reveal on open and collapse on close (see Motion).

### Announcement bar (`.announce`)
Fixed top, full-width, `--black` background, mono uppercase text at `--bar-h` height.

### Filter (shop)
Category links with a color-coded top line (`border-top` in the category color), the
active one thicker; no dot. Label tints to the category color on hover/active.

---

## 7. Voice & compliance
- Research-Use-Only throughout. No personal-use ("your body"), administration
  ("given back"), or structure/function ("supports X") framing. Use "studied for",
  "researched for", "prepared to research grade".
- No em-dashes (use periods/commas).
- Section titles carry no trailing periods.
- 21+ age gate + footer RUO disclaimer are required furniture.
