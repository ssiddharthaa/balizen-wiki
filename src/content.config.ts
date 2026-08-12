import { defineCollection, z } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
	docs: defineCollection({
		loader: docsLoader(),
		// Provenance is mandatory (CLAUDE.md): every page carries source + status.
		schema: docsSchema({
			extend: z.object({
				section: z.string().optional(),
				source: z.string().optional(),
				status: z.enum(['approved', 'draft-unapproved']).optional(),
				updated: z.coerce.date().optional(),
			}),
		}),
	}),
};
