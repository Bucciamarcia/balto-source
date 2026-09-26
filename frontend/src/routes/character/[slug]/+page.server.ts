import type {
	CharacterFavoritesResponse,
	CharactersResponse,
	UsersResponse
} from '$lib/pocketbase-types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const id = params.slug;
	const character = await locals.pb
		.collection('characters')
		.getOne<CharactersResponse<{ owner: UsersResponse }>>(id, { expand: 'owner' });
	const favs = await locals.pb
		.collection('character_favorites')
		.getFullList<CharacterFavoritesResponse>({
			filter: locals.pb.filter('target = {:id}', { id })
		});
	return { character, favs };
};
