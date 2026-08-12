/**
 * remark-glossary — auto-wraps the FIRST occurrence of each glossary term per page
 * with the tooltip markup from the prototype (`.g` span + `.tip` bubble).
 *
 * Rules (CLAUDE.md):
 *  - first occurrence per term per page only
 *  - never fires inside headings, blockquotes, or code
 *  - never fires inside a "Don't Use ❌" table column: a glossary tooltip on a
 *    phrase we tell people not to use would read as an endorsement
 *  - manual <G term="..."> always wins: a term used manually anywhere on a page
 *    is excluded from auto-wrapping on that page
 *
 * Terms come from data/glossary.json (passed in via astro.config.mjs) — the JSON
 * mirrors the Notion tables, it never freelances.
 */

// Never descend into these node types.
// headings/blockquotes/code per the content law; links to avoid nested <a>;
// html/jsx to avoid touching raw markup (including our own inserted spans).
const SKIP = new Set([
	'heading',
	'blockquote',
	'code',
	'inlineCode',
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
		// Word-boundary, case-insensitive. Terms may contain spaces.
		re: new RegExp(`(?<![A-Za-z0-9])${escapeRegExp(entry.term)}(?![A-Za-z0-9])`, 'i'),
	}));

	return function transformer(tree, file) {
		if (terms.length === 0) return;
		const isMdx = /\.mdx$/i.test(String(file.path ?? ''));
		const makeWrap = isMdx ? mdxWrapNode : htmlWrapNode;

		// Manual <G term="..."> wins: exclude those terms from auto-wrap on this page.
		const source = String(file.value ?? '');
		const done = new Set();
		for (const m of source.matchAll(/<G\s+[^>]*?term=["']([^"']+)["']/g)) {
			done.add(m[1].toLowerCase());
		}

		/** Column indices of a table's "Don't Use ❌" columns. */
		const dontColumns = (table) => {
			const [header] = table.children ?? [];
			if (!header) return new Set();
			const text = (n) =>
				n.type === 'text' || n.type === 'inlineCode'
					? n.value
					: (n.children ?? []).map(text).join('');
			return new Set(
				header.children.flatMap((cell, i) => (text(cell).includes('❌') ? [i] : []))
			);
		};

		const walk = (node) => {
			if (!node.children) return;
			if (node.type === 'table') {
				const skipCols = dontColumns(node);
				for (const row of node.children) {
					row.children.forEach((cell, i) => {
						if (!skipCols.has(i)) walk(cell);
					});
				}
				return;
			}
			for (let i = 0; i < node.children.length; i++) {
				const child = node.children[i];
				if (SKIP.has(child.type)) continue;
				if (child.type !== 'text') {
					walk(child);
					continue;
				}
				// Find the earliest match among not-yet-wrapped terms in this text node.
				let best = null;
				for (const entry of terms) {
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
