import { getSourceId } from '$lib/components/getSourceId';
import type {
	CharacterFavoritesResponse,
	CharactersResponse,
	UsersResponse
} from '$lib/pocketbase-types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const source = await getSourceId(locals.pb);
	const characters = await locals.pb
		.collection('characters')
		.getFullList<CharactersResponse<{ owner: UsersResponse }>>({
			expand: 'owner',
			filter: locals.pb.filter('source = {:source} && visible = {:visible}', {
				source,
				visible: true
			}),
			sort: '-created'
		});
	const allFavs = await locals.pb
		.collection('character_favorites')
		.getFullList<CharacterFavoritesResponse>();
	const favorites: Map<string, string[]> = new Map();
	for (const c of characters) {
		const cFavs = allFavs.filter((f) => f.target === c.id);
		favorites.set(
			c.id,
			cFavs.map((cf) => cf.id)
		);
	}
	return { characters, favorites };
};
