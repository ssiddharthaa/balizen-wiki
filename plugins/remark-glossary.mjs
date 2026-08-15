/**
 * remark-glossary — auto-wraps the FIRST occurrence of each glossary term per page
 * with the tooltip markup from the prototype (`.g` span + `.tip` bubble).
 *
 * Rules (CLAUDE.md):
 *  - first occurrence per term per page only
 *  - never fires inside headings, blockquotes, code, or tables. Tables are skipped
 *    wholesale: the do/don't tables set correct and incorrect phrasings side by side,
 *    and a tooltip in either column reads as a comment on the wrong one.
 *  - never fires on the page a term's own `link` points to — a tooltip offering
 *    "See page →" to the page you are already reading is noise
 *  - terms flagged "matchCase": true match case-sensitively, so proper nouns
 *    (Kawok, Brand Promise) don't fire on incidental lowercase prose
 *  - manual <G term="..."> always wins: a term used manually anywhere on a page
 *    is excluded from auto-wrapping on that page
 *
 * Terms come from data/glossary.json (passed in via astro.config.mjs) — the JSON
 * mirrors the Notion tables, it never freelances.
 */

// Never descend into these node types.
// headings/blockquotes/code/tables per the content law; links to avoid nested <a>;
// html/jsx to avoid touching raw markup (including our own inserted spans).
const SKIP = new Set([
	'heading',
	'blockquote',
	'code',
	'inlineCode',
	'table',
	'tableRow',
	'tableCell',
	'html',
	'link',
	'linkReference',
	'definition',
	'mdxJsxTextElement',
	'mdxJsxFlowElement',
	'mdxFlowExpression',
	'mdxTextExpression',
	'mdxjsEsm',
	'yaml',
]);

const escapeHtml = (s) =>
	s
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');

const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Raw-HTML wrap node for .md pages. */
function htmlWrapNode(matchText, entry) {
	const link = entry.link
		? `<a href="${escapeHtml(entry.link)}">See page&nbsp;→</a>`
		: '';
	return {
		type: 'html',
		value:
			`<span class="g" tabindex="0">${escapeHtml(matchText)}` +
			`<span class="tip" role="tooltip"><b>Glossary</b>${escapeHtml(entry.tip)}${link}</span></span>`,
	};
}

/** mdxJsxTextElement wrap node for .mdx pages (raw `html` nodes are ignored by MDX). */
function mdxWrapNode(matchText, entry) {
	const attr = (name, value) => ({ type: 'mdxJsxAttribute', name, value });
	const el = (name, attributes, children) => ({
		type: 'mdxJsxTextElement',
		name,
		attributes,
		children,
	});
	const text = (value) => ({ type: 'text', value });

	const tipChildren = [el('b', [], [text('Glossary')]), text(entry.tip)];
	if (entry.link) {
		tipChildren.push(el('a', [attr('href', entry.link)], [text('See page →')]));
	}
	return el(
		'span',
		[attr('class', 'g'), attr('tabindex', '0')],
		[text(matchText), el('span', [attr('class', 'tip'), attr('role', 'tooltip')], tipChildren)]
	);
}

export default function remarkGlossary(options = {}) {
	const terms = (options.terms ?? []).map((entry) => ({
		...entry,
		// Word-boundary. Terms may contain spaces. Proper nouns opt into
		// case-sensitivity with "matchCase": true so that e.g. "Kawok" fires but
		// an unrelated lowercase use does not.
		re: new RegExp(
			`(?<![A-Za-z0-9])${escapeRegExp(entry.term)}(?![A-Za-z0-9])`,
			entry.matchCase ? '' : 'i'
		),
	}));

	/** '/who-we-speak-to/' -> 'who-we-speak-to'; tolerates anchors and missing slashes. */
	const linkToSlug = (link) =>
		String(link).split('#')[0].split('?')[0].replace(/^\/+|\/+$/g, '').toLowerCase();

	return function transformer(tree, file) {
		if (terms.length === 0) return;
		const filePath = String(file.path ?? '').replace(/\\/g, '/');
		const isMdx = /\.mdx$/i.test(filePath);
		const makeWrap = isMdx ? mdxWrapNode : htmlWrapNode;

		// Slug of the page being built, so a term never links to the page it is on.
		const pageMatch = filePath.match(/src\/content\/docs\/(.+)$/);
		const pageSlug = pageMatch
			? pageMatch[1].replace(/\.mdx?$/i, '').replace(/\/index$/i, '').toLowerCase()
			: null;

		// Drop self-referential terms up front: on /brand-story/, "Brand Promise"
		// stays plain text rather than offering a "See page →" to this same page.
		const active = pageSlug
			? terms.filter((entry) => !entry.link || linkToSlug(entry.link) !== pageSlug)
			: terms;
		if (active.length === 0) return;

		// Manual <G term="..."> wins: exclude those terms from auto-wrap on this page.
		const source = String(file.value ?? '');
		const done = new Set();
		for (const m of source.matchAll(/<G\s+[^>]*?term=["']([^"']+)["']/g)) {
			done.add(m[1].toLowerCase());
		}

		const walk = (node) => {
			if (!node.children) return;
			for (let i = 0; i < node.children.length; i++) {
				const child = node.children[i];
				if (SKIP.has(child.type)) continue;
				if (child.type !== 'text') {
					walk(child);
					continue;
				}
				// Find the earliest match among not-yet-wrapped terms in this text node.
				let best = null;
				for (const entry of active) {
					if (done.has(entry.term.toLowerCase())) continue;
					const m = child.value.match(entry.re);
					if (m && (best === null || m.index < best.index)) {
						best = { index: m.index, matchText: m[0], entry };
					}
				}
				if (!best) continue;
				done.add(best.entry.term.toLowerCase());
				const before = child.value.slice(0, best.index);
				const after = child.value.slice(best.index + best.matchText.length);
				const replacement = [];
				if (before) replacement.push({ type: 'text', value: before });
				replacement.push(makeWrap(best.matchText, best.entry));
				if (after) replacement.push({ type: 'text', value: after });
				node.children.splice(i, 1, ...replacement);
				// Continue scanning the remainder of this text node for other terms.
				i += replacement.length - (after ? 2 : 1);
			}
		};

		walk(tree);
	};
}
