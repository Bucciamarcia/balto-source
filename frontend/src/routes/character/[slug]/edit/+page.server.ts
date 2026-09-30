import type { CharactersResponse } from '$lib/pocketbase-types';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const slug = params.slug;
	const character = await locals.pb.collection('characters').getOne<CharactersResponse>(slug);
	return { character };
};
