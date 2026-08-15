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

	// The wiki has no landing page of its own — the first approved page is the front door.
	redirects: { '/': '/the-balizen-brand/' },
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
			sidebar: [
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
					label: 'Identity System',
					items: [{ label: 'Identity Essentials', slug: 'identity-essentials' }],
				},
				{
					// The social section, per Sid's handoff (15 Aug 2026). Every page here
					// is still `status: draft-unapproved` and carries the badge — the group
					// gives the section its shape, the badge carries the approval state.
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
					// Unapproved whiteboard transcriptions, published on Sid's instruction
					// (15 Aug 2026). Kept in their own group, and badged on the page
					// itself, so they are never mistaken for approved brand law.
					// Each stays `status: draft-unapproved` until Andrea approves it.
					//
					// Deliberately NOT `collapsed: true`: custom.css follows the prototype's
					// flat, always-open nav (summary is pointer-events:none and the caret is
					// hidden), so a collapsed group can never be reopened — the pages would
					// be unreachable from every other page.
					label: 'Drafts — not yet approved',
					items: [
						{ label: 'Photography for Website', slug: 'photography-guide' },
						{ label: 'Product Design Guide', slug: 'product-design-guide' },
						{ label: 'Store Design Guide', slug: 'store-design-guide' },
						{ label: 'Email Communication Guide', slug: 'email-communication-guide' },
					],
				},
			],
		}),
	],
});
