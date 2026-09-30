import { getLocale } from '$lib/paraglide/runtime';
import Pocketbase from 'pocketbase';

export async function getSourceId(pb: Pocketbase): Promise<string> {
	const locale = getLocale();
	const r = await pb
		.collection('sources')
		.getFirstListItem(
			pb.filter('name = {:name} && language = {:locale}', { name: 'balto', locale: locale })
		);
	return r.id;
}
