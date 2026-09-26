import type {
	CharacterFavoritesResponse,
	CharactersResponse,
	UsersResponse
} from '$lib/pocketbase-types';
import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const id = params.slug;
	const userId = locals.user?.id;
	const character = await locals.pb
		.collection('characters')
		.getOne<CharactersResponse<{ owner: UsersResponse }>>(id, { expand: 'owner' });
	const favs = await locals.pb
		.collection('character_favorites')
		.getFullList<CharacterFavoritesResponse>({
			filter: locals.pb.filter('target = {:id}', { id })
		});
	const favIds = favs.map((f) => f.source);
	const alreadyFaved: boolean = favIds.includes(userId ?? 'noep');
	return { character, favs, alreadyFaved };
};

export const actions = {
	removeFromFavorites: async ({ locals, params }) => {
		const id = params.slug;
		if (id == null) {
			return fail(400, { error: "Couldn't identify character ID" });
		}
		const userId = locals.user?.id;
		if (userId == null) {
			return fail(401, { error: 'You must be logged in' });
		}
		const record = await locals.pb
			.collection('character_favorites')
			.getFirstListItem<CharacterFavoritesResponse>(
				locals.pb.filter('source = {:id}', { id: userId })
			);
		const recordId = record.id;
		await locals.pb.collection('character_favorites').delete(recordId);
	},
	addToFavorites: async ({ locals, params }) => {
		const id = params.slug;
		if (id == null) {
			return fail(400, { error: "Couldn't identify character ID" });
		}
		const userId = locals.user?.id;
		if (userId == null) {
			return fail(401, { error: 'You must be logged in' });
		}
		try {
			await locals.pb.collection('character_favorites').create({ source: userId, target: id });
		} catch (e) {
			return fail(400, { error: e instanceof Error ? e.message : 'Unknown error occurred' });
		}
	}
} satisfies Actions;
