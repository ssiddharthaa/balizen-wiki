// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { unified } from '@astrojs/markdown-remark';
import { readFileSync } from 'node:fs';

import remarkGlossary from './plugins/remark-glossary.mjs';
import remarkDoDont from './plugins/remark-dodont.mjs';

const glossary = JSON.parse(readFileSync(new URL('./data/glossary.json', import.meta.url), 'utf8'));

// https://astro.build/config
export default defineConfig({
	// Set once the domain is chosen (e.g. 'https://brand.balizenhome.com') — this is
	// what enables the sitemap; until then the build logs a skip warning.
	// site: 'https://brand.balizenhome.com',

	// Lets astro:assets rasterize our own SVG artwork (the Symbols page's PNG
	// downloads). "dangerously" refers to untrusted SVG input — these are the
	// brand's own files, checked into src/assets.
	image: { dangerouslyProcessSVG: true },

	redirects: {
		// Identity Essentials split into the Identity System section (Aug 2026).
		'/identity-essentials/': '/identity-system/',
	},
	markdown: {
		processor: unified({
			remarkPlugins: [[remarkGlossary, { terms: glossary.terms }], remarkDoDont],
		}),
	},
	integrations: [
		starlight({
			title: 'Balizen Brand Wiki',
			customCss: ['./src/styles/custom.css'],
			components: {
				Head: './src/components/Head.astro',
				SiteTitle: './src/components/SiteTitle.astro',
				PageTitle: './src/components/PageTitle.astro',
				// Light-only site, per the approved prototype.
				ThemeProvider: './src/components/ThemeProvider.astro',
				ThemeSelect: './src/components/ThemeSelect.astro',
			},
			// One axis, two halves (Sid's IA decision, 15 Aug 2026): everything up to and
			// including the Identity System DESCRIBES the brand (definitive); everything
			// after it APPLIES the brand (practical). Approval state never appears in the
			// nav — it lives in frontmatter and on the page as the draft badge. custom.css
			// draws the definitive/practical hinge as a divider before "Design Guides";
			// that rule is positional, so keep the group order here in sync with it.
			sidebar: [
				{
					label: 'Start here',
					items: [{ label: 'Home', link: '/' }],
				},
				{
					label: 'The Brand',
					items: [
						{ label: 'The Balizen Brand', slug: 'the-balizen-brand' },
						{ label: 'Brand Story', slug: 'brand-story' },
						{ label: 'Brand Experience', slug: 'brand-experience' },
						{ label: 'Who We Speak To', slug: 'who-we-speak-to' },
					],
				},
				{
					label: 'Voice',
					items: [
						{ label: 'Voice & Tone', slug: 'voice-and-tone' },
						{ label: 'Correct Terms Glossary', slug: 'correct-terms-glossary' },
					],
				},
				{
					// The last definitive section — the hinge. Split from the old
					// Identity Essentials page (Aug 2026); its URL redirects here.
					label: 'Identity System',
					items: [
						{ label: 'Identity System', slug: 'identity-system' },
						{ label: 'Logo', slug: 'logo' },
						{ label: 'Color', slug: 'color' },
						{ label: 'Typography', slug: 'typography' },
						{ label: 'Symbols', slug: 'symbols' },
					],
				},
				{
					// From here down, pages apply the brand. Ex-"Drafts" pages live here
					// by subject now; each keeps `status: draft-unapproved` and its badge
					// until Andrea approves it.
					label: 'Design Guides',
					items: [
						{ label: 'Product Design Guide', slug: 'product-design-guide' },
						{ label: 'Store Design Guide', slug: 'store-design-guide' },
						{ label: 'Website Guide', slug: 'website-guide' },
						{ label: 'Photography for Website', slug: 'photography-guide' },
						{ label: 'Email Communication Guide', slug: 'email-communication-guide' },
					],
				},
				{
					label: 'Social Media',
					items: [
						{ label: 'Social Media', slug: 'social-media' },
						{ label: 'Formats', slug: 'social-media-formats' },
						{ label: 'Grid & Sequencing', slug: 'social-media-grid' },
						{ label: 'Storytelling', slug: 'social-media-storytelling' },
						{ label: 'Hashtag Glossary & Guidance', slug: 'hashtag-glossary' },
					],
				},
				{
					label: 'Reference',
					items: [{ label: 'Glossary', slug: 'glossary' }],
				},
			],
		}),
	],
});
