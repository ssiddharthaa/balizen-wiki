# CLAUDE.md — Balizen Brand Wiki

This repo is the **Balizen Brand Wiki**: the published source of truth for the Balizen brand
(Zen Zen Garden & Home · fair trade lifestyle brand, Bali, since 1992). It is read by the
external branding agency (Sabrina & Sisi), collaborators (Marlon), and future hires.
Owner and editor: **Sid** (brand & marketing lead). Final approver of brand content: **Andrea**
(founder & creative director) and **Pak Nyoman** (co-founder, Director).

## Tech stack

- **Astro Starlight** static docs site, deployed on **Vercel** (auto-deploy from `main`).
- Content lives in `src/content/docs/` as markdown/MDX. One page = one file.
- Fonts: **Scotch Display Light** (H1) and **Area Inktrap** (body) via **Adobe Fonts Web Project
  embed** (Sid supplies the embed line — leave a clearly marked placeholder until then).
  Free fallbacks: Playfair Display (already brand-approved as Heading 1b) and Instrument Sans.
- Design reference: `prototype/balizen-brand-wiki-prototype.html` — the approved look.
  Match it: white page background, `#F4F3F0` panels, airy spacing, teal system.

## Design tokens (do not drift)

```
--teal:      #3BA3AB   (Balizen Teal — primary)
--teal-dark: #2B7A80   (shade, for text/headings on light)
--teal-tint: #E9F4F5   (soft fills, highlights)
--panel:     #F4F3F0   (UI surface for cards/callouts/tables — NOT a brand color)
--cream:     #F5F1E8   (brand color; palette page only, not a UI surface)
--hugger:    #A8B569   (Tree Hugger — sparing accents)
--grey:      #485760   (Payne's Grey — body text, sparing)
```
Extended brand palette (Glow #F0C971, Blush #EFBFBF, Spice #D87B3D, Spice Accent #F26722)
appears ONLY as swatches on the Identity page — never as UI colors.
Layouts: light and airy, minimal borders, generous whitespace, sentence/title case only
(never all caps). No drop shadows heavier than whisper-level.

## Content law (highest priority)

1. **Provenance is mandatory.** Every page carries frontmatter:
   `source:` (e.g. `brand-book-v1 slides 7-8`, `vt-guide-v4`, `style-guide-pdf`) and
   `status: approved | draft-unapproved`. Pages in `draft/` are never published.
   A `draft-unapproved` page that must render shows a visible "Draft — not yet approved" badge.
2. **Verbatim seeding.** When adding content from a source document, transcribe it verbatim.
   Do not condense, regroup, embellish, or "improve" without an explicit instruction.
   If a source contains an open question (e.g. a heading ending in "?"), preserve it.
3. **Never invent details.** No invented sensory/atmospheric details, artisan anecdotes,
   statistics, dates, or product facts — ever. Rule applies to example copy too.
   Only observed/reported specifics from the source documents.
4. **Correct Terms Glossary is law** (see `data/glossary.json`, sourced from V&T V4):
   - "Fair Trade Federation **member**" — NEVER "certified" about products or goods.
   - "Hand silk-screened" — never plain "printed", never "batik" (we don't use batik).
   - "Eco-friendly seaweed-based dyes" — never vague "natural dyes" or "chemical-free".
   - "Reclaimed wood" not "recycled wood" · "Vetiver root" not straw/grass ·
     "Capiz shell" not mother of pearl · "Crochet" vs "knit" — never interchangeable.
   - "Our workshop" — never "factory" or "facility".
   - **Kawok is the cutter** (oversees cutting, not sewing). Never "sewer".
     Individual cutter names only if confirmed with Andrea.
5. **Banned words in customer-facing copy** (V&T V4 "Words We Avoid"):
   Luxury · Premium · Exclusive · Leverage · Utilize · Optimize · Synergy · Comprehensive ·
   Cutting-edge · Revolutionary · Empower · Curate · Artisanal (generic) · Capacity-building ·
   Stakeholder · Scalable. "Quiet Luxury" framing is explicitly rejected — never reintroduce it.
   Scope: customer-facing copy; internal strategy docs are exempt.
6. **Tagline hierarchy** (fixed, in order):
   1. "Balizen = Doing something positive for people & the planet." (Brand Promise — internal/storytelling)
   2. "From smile to smile." (core tagline, customer-facing — never paraphrased)
   3. "A bit of Bali to take home with you." (tourist journey contexts)
   4. "Proudly hugging trees since 1992. 🌿" (playful — social & light moments)
7. **Voice** when writing any new copy: follow V&T V4's 7 pillars
   (joy not guilt — humor welcome, never forced; invite don't sell; name the people;
   simple & sensory but own what's real; natural elegance — elegant ≠ humorless;
   teach the craft; plant roots not seeds). Understated beats enthusiastic. Partner, never savior.

## Glossary / tooltip system

- `data/glossary.json` drives a `<G term="...">` inline component: dotted teal underline,
  tooltip on hover (desktop) / tap (mobile), optional link to the term's page.
- A remark plugin auto-wraps the FIRST occurrence of each glossary term per page.
  Manual `<G>` always wins; auto-wrap never fires inside headings, quotes, or code.
- When the Correct Terms Glossary changes in Notion, `data/glossary.json` is updated to match —
  the JSON mirrors the tables, it never freelances.

## Workflow rules

- Small edits → direct commit to `main` with a descriptive message
  (`content: fix typo on voice page`). Structural changes → show Sid the diff/plan first.
- Every content change appends one line to `CHANGELOG.md` (date · page · what · source).
  This mirrors the V&T guide's own changelog convention.
- When Andrea approves a draft page: flip `status: approved`, move it from `draft/` into
  `src/content/docs/`, changelog it. One instruction from Sid is sufficient authority.
- Never edit files in `draft/` to "clean them up" unprompted — they are faithful transcriptions
  of whiteboards and raw sources.
- Do not add analytics, trackers, or third-party scripts without being asked.

## Pending decisions (do not resolve unilaterally)

- "Balizen — by Zen Zen Garden Home" lockup: seen in Brand Palette whiteboard draft;
  NOT yet in the approved style guide. Ask before adding to the Identity page.
- Slide 9's "A cohesive, clear and distinct design sensibility?" — the question mark is in the
  source. Keep it until Andrea settles it.
- Brand book slides 15–75 are unadapted Cisco boilerplate — never seed them as Balizen content.
- Access control (public vs password-gated) — Sid decides at deploy time.
