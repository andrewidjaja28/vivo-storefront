# Vivo — Frontend → Medusa Integration Brief

**Goal:** Connect this existing static storefront to a [Medusa](https://medusajs.com) backend so that catalog, cart, checkout, and customer accounts are real and server-driven. Keep the existing visual design — only the *data layer* and *checkout/auth logic* change.

---

## 1. What this project is

A hand-built, **static multi-page storefront** for Vivo (research-grade peptides). No framework, no build step — each page is a single `.html` file with inline `<style>` and `<script>`.

| Page | File | Role |
|---|---|---|
| Home | `index.html` | Hero, value props, shop-by-benefit, product range |
| All products | `shop.html` | Catalog grid + benefit filters + sort |
| Product detail (PDP) | `product.html` | Reads `?id=` param, renders one product, dosage-size selector, qty stepper, add-to-cart |
| Checkout | `checkout.html` | Order summary + (demo) place-order |
| Certificate of Analysis | `coa.html` | Static content + cart drawer |
| Contact | `contact.html` | Contact form (not wired) + cart drawer |

Brand assets: `logo_*.png`, `hero_waves.mp4`, `clearliquid_card.mp4`, `madeincali.jpg`, `peptideliquid.jpg`, product vial images in `Products/Vials/`. Brand guide: `Vivo_Brand_Identity.pdf`.

Design system (CSS custom properties, defined per-page in `:root`): fonts `--sans` (SF Pro Display), `--serif` (Cormorant Garamond), `--display` (Forum); color tokens; `--maxw:1600px`; `--gutter:clamp(18px,4.5vw,80px)`. **Preserve these.**

---

## 2. Current data model (what you're replacing)

### Products — hardcoded JS array, duplicated in two files
- `shop.html:533` — `const PRODUCTS = [ ... ]`
- `product.html:331` — `const products = [ ... ]` (same 7 items, plus per-product copy blocks)

7 products today: `glow, bpc157, selank, nad, glutathione, glp3, aod9604`. Each: `{ id, name, cat, benefit, ph (placeholder color), dose, price, img }`. See `catalog.json` in this folder for the full export, **already shaped as products + variants**.

### Variants (dosage sizes) — currently *derived in JS*, not real data
`product.html:405` generates 3 sizes per product from the base: base dose/price, 2× dose @ `round5(price*1.8)`, 3× dose @ `round5(price*2.5)`. **In Medusa these become real product variants** with their own SKUs/prices/inventory. `catalog.json` lists them explicitly so you can seed them.

### Cart key scheme — already variant-aware
Cart line keys are composite strings: `` `${id}::${dose}::${price}` `` (e.g. `glow::10 mg::215`). Decoded by the `cartLine(key)` helper:
- `product.html:383`, `shop.html:554` (and copied into the other cart pages)

When you move to Medusa, replace this string key with the **Medusa variant id** as the line-item identifier.

### Cart storage — localStorage, copy-pasted into all 6 pages
- Key: `'vivo_cart'`. Boot: `index.html:730`. Save: `index.html:745`. Same block in `shop.html`, `product.html`, `checkout.html`, `coa.html`, `contact.html`.
- Shape today: `{ "<composite-key>": quantity }`.
- **Replace with:** a Medusa cart. Persist only the **cart id** in localStorage; fetch the cart (line items, totals) from Medusa on each page load.

### Add-to-cart / qty
- PDP add button: `product.html:441` carries `data-id="<composite-key>"`; size selection rewrites it at `product.html:574`.
- Qty stepper drives `pdpQty`; `addToCart(id, n)` at `product.html:636`; quick-add on grids uses base ids.

---

## 3. Scope of work

### A. Stand up Medusa backend
1. `create-medusa-app` → Medusa server + Admin + Postgres (+ Redis for prod).
2. Seed catalog from `catalog.json`: 7 products, 3 variants each (21 variants). Map `benefit`/`cat` to collections/categories or product metadata; carry `ph` color + `img` path into variant/product metadata so the frontend keeps its placeholder colors and imagery.
3. Configure: regions/currency (USD), shipping options, tax, order-confirmation email.
4. **Payments:** integrate the client's chosen payment provider (⚠️ see §6 — this is a high-risk product category; do **not** assume Stripe standard will be approved). Wire the corresponding Medusa payment plugin.
5. Customer accounts/auth via Medusa's built-in customer module (this is "signup works").

### B. Convert the frontend from static-data to API-driven
Use the **Medusa JS SDK / Store API**. Per page:
- **`shop.html`** — fetch product list + variants instead of `PRODUCTS` array; keep grid markup, filters, sort. Derive "From $X" from lowest variant price.
- **`product.html`** — fetch single product by `?id=` (map to Medusa product handle/id); render real variants in the dosage selector; add-to-cart sends `{ variant_id, quantity }` to the Medusa cart.
- **Cart drawer (all pages)** — replace localStorage cart logic with Medusa cart calls (create cart, add/update/remove line item, read totals). Persist cart id only. Replace `cartLine()` decoding with line-item data from the API.
- **`checkout.html`** — real checkout: customer/email → shipping address → shipping method → payment session → complete order. Render Medusa cart totals (subtotal/shipping/tax/total), not client-side math.
- **`contact.html`** — wire the form to email/CRM (out of Medusa scope; confirm destination).

> Note: once pages call an API, you'll likely want a small bundler or a shared `js/` module instead of 6 copies of inline script. Consolidating the duplicated cart block into one shared file is part of this work. Re-skinning Medusa's Next.js starter storefront with this CSS is an acceptable alternative approach if you prefer a cleaner foundation — flag your recommendation.

### C. Deploy
- Backend: Railway / Render / a VPS / Medusa Cloud (+ managed Postgres, Redis).
- Frontend: Netlify / Vercel. Wire `MEDUSA_BACKEND_URL` + publishable API key via env.

---

## 4. What to send the developer (handoff package)

1. **This repo / zip** — all `.html`, assets, `Products/Vials/`, `catalog.json`, this brief.
2. **`catalog.json`** — seed-ready catalog (products + variants + prices + benefit/category + image paths). Prices are placeholders; confirm final.
3. **Brand assets & guide** — `Vivo_Brand_Identity.pdf`, logos, videos, images (already in repo).
4. **Payment processor details** — account + API credentials for the approved high-risk gateway (see §6). *Blocker — provide before checkout work starts.*
5. **Hosting decision/access** — self-host vs Medusa Cloud; DNS/domain access for go-live.
6. **Business/compliance copy** — Research-Use-Only disclaimers, age gate, shipping/refund/privacy policy text, supported regions, tax registration.
7. **Email/CRM destination** — for order confirmations, contact form, newsletter.

---

## 5. Acceptance criteria ("done")

- [ ] Catalog (7 products × 3 variants) loads from Medusa on `shop.html` and `product.html`; no hardcoded `PRODUCTS` array remains.
- [ ] PDP dosage selector reflects real Medusa variants/prices; add-to-cart adds the correct **variant** to a server cart.
- [ ] Cart drawer reads totals/line items from Medusa across all pages; survives refresh via cart id; quantities update server-side.
- [ ] Checkout completes a real order (address → shipping → payment → confirmation) visible in Medusa Admin, with correct subtotal/shipping/tax/total.
- [ ] Customer can sign up, log in, and view order history.
- [ ] Existing visual design preserved (fonts, colors, layout, gutter, max-width).
- [ ] Deployed: frontend + backend live on the client's domain with env-based config.

---

## 6. ⚠️ Critical: payments & compliance (gating item)

Research peptides are a **high-risk / restricted category**. Stripe standard, Shopify Payments, PayPal, and Square frequently **prohibit or freeze** these merchants. **The payment processor must be selected and approved before checkout development begins** — Medusa is processor-agnostic, but it cannot conjure an approving acquirer. Expect to need a **high-risk merchant account** (e.g. NMI / Authorize.net via a high-risk acquirer, or a specialist provider) and proper "Research Use Only / not for human consumption" disclaimers, age gating, and no medical claims. Treat this as the schedule's long pole.

---

## 7. Collaboration & ownership (Git workflow)

The frontend owner (client, working in the static HTML) and the backend developer share **one Git repo** (GitHub) and must not overwrite each other's work. Rules:

**Hosting**
- Frontend deploys via **Netlify connected to the repo** (auto-deploy on push to `main`, deploy previews on every PR). Do **not** break this by introducing a build step that Netlify isn't configured for without updating the Netlify build settings.
- Backend (Medusa + Postgres + Redis) is hosted separately (Railway / Render / Medusa Cloud). Never commit secrets — use `.env` (already gitignored) and platform env vars.

**Branching**
- `main` is always deployable. No direct commits that break the live site.
- Work on branches → open a **Pull Request** → review the Netlify deploy preview → merge. This lets both people work in parallel without collisions.

**Ownership boundaries**
- **Frontend owner owns:** content, copy, layout, CSS, design tokens (`--sans/--serif/--display`, colors, `--maxw`, `--gutter`), marketing pages, new sections.
- **Backend dev owns:** the data layer — anything touching products, variants, cart, checkout, payments, customer auth, and the API client code.
- **Backend dev must preserve** the existing visual design and CSS tokens, and keep content/markup approachable so the frontend owner can continue editing copy and layout after integration.
- When extracting inline `<script>` into modules, **do not** restyle or restructure the markup beyond what the API integration requires. Flag any change that affects how the frontend owner edits pages.

**Recommendation requested:** if you move the frontend onto Medusa's Next.js starter, propose how the client continues to make content/design edits (e.g. keep CSS editable, or wire a lightweight CMS) so the two workstreams stay independent.
