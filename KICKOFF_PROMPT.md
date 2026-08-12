# Kickoff prompt for Claude Code (paste as first message)

Read CLAUDE.md fully before doing anything — it is the law for this project.

Build the Balizen Brand Wiki as an Astro Starlight site in this repo:

1. Scaffold Astro Starlight (latest). Site title "Balizen Brand Wiki".
2. Theme it to match `prototype/balizen-brand-wiki-prototype.html` exactly in spirit:
   white page, #F4F3F0 panels, Balizen Teal system, thin serif headings, airy spacing.
   Use `data/tokens.json` as the single source for all colors. Google Fonts
   Playfair Display + Instrument Sans now; leave a clearly marked placeholder
   for the Adobe Fonts embed (Scotch Display Light, Area Inktrap) that I'll supply.
3. Move the 7 files from `content/` into Starlight's docs collection, preserving
   frontmatter. Sidebar order & grouping:
   - The Brand: The Balizen Brand · Brand Story · Brand Experience · Who We Speak To
   - Voice: Voice & Tone · Correct Terms Glossary
   - Identity System: Identity Essentials
4. Build the glossary tooltip system from `data/glossary.json`:
   an inline `<G>` component (dotted teal underline, tooltip on hover, tap on mobile,
   optional link) plus a remark plugin that auto-wraps the first occurrence of each
   term per page (never inside headings, quotes, or code). Manual use wins.
5. Render the Correct Terms Glossary page's ✅/❌ tables with the do/don't styling
   from the prototype (teal top-border for Use, muted clay for Don't Use).
6. On the Identity Essentials page, render color swatches as live styled elements
   from tokens.json (not images), and type specimens per the prototype.
7. Add a small "Draft — not yet approved" badge component that renders whenever
   frontmatter has `status: draft-unapproved` (nothing in draft/ is published yet,
   but the badge must exist for future graduations).
8. Create `CHANGELOG.md` with today's seed entry, per the convention in CLAUDE.md.
9. Verify the build (`astro build`), check mobile at ~380px width, then show me
   the plan for the GitHub + Vercel handoff. Don't publish anything.

Do NOT touch anything in `draft/`. Do NOT add content beyond what's in `content/`.
Where the prototype and Starlight defaults conflict, the prototype wins.
