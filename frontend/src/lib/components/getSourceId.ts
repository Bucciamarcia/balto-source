import { getLocale } from '#lib/paraglide/runtime.js';
import Pocketbase from 'pocketbase';
import type { Source } from './getSourceSlug';

export async function getSourceId(pb: Pocketbase, source: Source): Promise<string> {
	const locale = getLocale();
	const r = await pb
		.collection('sources')
		.getFirstListItem(
			pb.filter('name = {:name} && language = {:locale}', { name: source, locale: locale })
		);
	return r.id;
}
