import { getComments } from '#lib/components/getComments.js';
import { getSourceId } from '#lib/components/getSourceId.js';
import { getSourceSlug } from '#lib/components/getSourceSlug.js';
import type {
	CharacterFavoritesResponse,
	CharactersResponse,
	UsersResponse
} from '#lib/pocketbase-types.js';
import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const sourceName = getSourceSlug(params.source);
	const source = await getSourceId(locals.pb, sourceName);
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
	const comments: CommentsByCharacter[] = await Promise.all(
		characters.map(async (c) => ({
			character: c.id,
			comments: await getComments(c.id, locals.pb)
		}))
	);
	return { characters, favorites, comments };
};

export const actions = {
	searchByName: async ({ locals, request }) => {
		const data = await request.formData();
		const characterName = data.get('name') as string;
		let result: CharactersResponse<{ owner: UsersResponse }>[];
		try {
			result = await locals.pb
				.collection('characters')
				.getFullList<CharactersResponse<{ owner: UsersResponse }>>({
					filter: locals.pb.filter('name ~ {:name} && visible = true', { name: characterName }),
					expand: 'owner'
				});
		} catch (e) {
			return fail(400, { error: e instanceof Error ? e.message : 'Unknown error' });
		}
		return { characters: result };
	}
} satisfies Actions;

export type CommentsByCharacter = {
	character: string;
	comments: string[];
};
