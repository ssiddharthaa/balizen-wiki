# Balizen Brand Wiki

The published source of truth for the Balizen brand (Zen Zen Garden & Home · fair trade
lifestyle brand, Bali, since 1992). Astro Starlight → GitHub → Vercel.

## What's in here

| Path | What it is |
|---|---|
| `CLAUDE.md` | Project memory — Claude Code reads this every session. Brand law lives here. |
| `src/content/docs/` | The 7 approved pages, seeded **verbatim** from Brand Book slides 1–14, V&T Guide V4, and the Style Guide. Frontmatter carries provenance (`source:` + `status:`). |
| `src/components/` | `G` (glossary tooltip), `Swatches`, `TypeSpec`, `DraftBadge`, and the Starlight overrides (`Head`, `SiteTitle`, `PageTitle`, theme). |
| `src/styles/custom.css` | The theme. Matches `prototype/`. |
| `plugins/` | `remark-glossary` (auto-wraps glossary terms) · `remark-dodont` (tags ✅/❌ tables). |
| `data/glossary.json` | Tooltip glossary — drives the hover/tap definitions site-wide. Mirrors the Notion Correct Terms Glossary. |
| `data/tokens.json` | Design tokens — the single source for all colors. UI surfaces vs brand palette, deliberately separate. |
| `draft/` | Unpublished sources: whiteboard transcriptions, held-out hashtag glossary, pending decisions. Never rendered. |
| `prototype/` | The approved HTML design reference. Match its look. |
| `CHANGELOG.md` | One line per content change (date · page · what · source). |

## Running it locally

```bash
npm install
npm run dev
```

Then open http://localhost:4321. `npm run build` produces the static site in `dist/`.

## The loop after launch

Edit → commit → live in ~1 minute:
- **From anywhere:** tell Claude Code what to change ("fix the typo on the Voice page",
  "Andrea approved the photography guide — graduate it").
- **By hand:** edit the markdown on github.com in a browser, commit. Vercel rebuilds automatically.

## Adding a glossary term

Add it to `data/glossary.json` (`term`, `tip`, optional `link`). The first occurrence on each
page is auto-wrapped with a tooltip — never inside headings, quotes, code, or a "Don't Use ❌"
table column. To place one deliberately, use `<G term="…">` in an `.mdx` page; manual use wins.

## Still to do

- Paste the Adobe Fonts embed line (Scotch Display Light + Area Inktrap) where marked in
  `src/components/Head.astro`. Until then the site runs on the brand-approved free fallbacks,
  Playfair Display and Instrument Sans.
- Set `site:` in `astro.config.mjs` once the domain is chosen (enables the sitemap).
- Decide access control: public or password-gated (Vercel Deployment Protection).
