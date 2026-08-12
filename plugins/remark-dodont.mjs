/**
 * remark-dodont — tags the Correct Terms Glossary's ✅/❌ tables so CSS can apply
 * the prototype's do/don't styling (teal top-border for "Use ✅", muted clay for
 * "Don't Use ❌"). Any table whose header row contains ✅ or ❌ is tagged; the
 * matching column classes are applied to every cell in that column.
 */

const cellText = (node) => {
	if (node.type === 'text' || node.type === 'inlineCode') return node.value;
	return (node.children ?? []).map(cellText).join('');
};

export default function remarkDoDont() {
	return function transformer(tree) {
		const walk = (node) => {
			if (node.type === 'table') {
				tagTable(node);
				return;
			}
			(node.children ?? []).forEach(walk);
		};

		const tagTable = (table) => {
			const [header] = table.children;
			if (!header) return;
			const columns = header.children.map((cell) => {
				const text = cellText(cell);
				if (text.includes('✅')) return 'col-do';
				if (text.includes('❌')) return 'col-dont';
				return null;
			});
			if (!columns.some(Boolean)) return;

			table.data ??= {};
			table.data.hProperties = { ...table.data.hProperties, class: 'dodont' };
			for (const row of table.children) {
				row.children.forEach((cell, i) => {
					if (!columns[i]) return;
					cell.data ??= {};
					cell.data.hProperties = { ...cell.data.hProperties, class: columns[i] };
				});
			}
		};

		walk(tree);
	};
}
