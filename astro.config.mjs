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
			],
		}),
	],
});
