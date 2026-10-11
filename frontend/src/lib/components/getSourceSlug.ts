const SOURCES = ['hub', 'balto'] as const;
export type Source = (typeof SOURCES)[number];

export function getSourceSlug(source: string | undefined): Source {
	if (source == undefined) return 'balto';
	const normalized = source.toLowerCase();
	if (SOURCES.includes(normalized as Source)) {
		return normalized as Source;
	}
	return 'balto';
}
