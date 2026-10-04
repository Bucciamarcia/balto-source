import type {
	CommentsResponse,
	CharacterFavoritesResponse,
	CharactersResponse,
	UsersResponse
} from '$lib/pocketbase-types';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { moderateText } from '$lib/components/moderateAi';
import sanitizeHtml from 'sanitize-html';

export const load: PageServerLoad = async ({ locals, params }) => {
	const id = params.slug;
	const userId = locals.user?.id;
	const character = await locals.pb
		.collection('characters')
		.getOne<CharactersResponse<{ owner: UsersResponse }>>(id, { expand: 'owner' });
	if (!character.visible) {
		throw redirect(307, '/404');
	}
	const favs = await locals.pb
		.collection('character_favorites')
		.getFullList<CharacterFavoritesResponse>({
			filter: locals.pb.filter('target = {:id}', { id })
		});
	const favIds = favs.map((f) => f.source);
	const alreadyFaved: boolean = favIds.includes(userId ?? 'noep');
	const comments = await locals.pb
		.collection('comments')
		.getFullList<CommentsResponse<{ author: UsersResponse }>>({
			filter: locals.pb.filter('target_id = {:id}', { id }),
			expand: 'author'
		});
	return { character, favs, alreadyFaved, comments, id };
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
	},
	addComment: async ({ locals, request }) => {
		const user = locals.pb.authStore.record;
		if (!user) {
			return fail(401, { error: 'Not logged in' });
		}
		const data = await request.formData();
		const comment = data.get('comment');
		if (comment == null) {
			return fail(400, { error: 'Data invalid' });
		}
		const moderation = await moderateText(comment.toString());
		if (moderation === 'remove') {
			return fail(400, { error: 'This comment is not allowed' });
		}
		const targetId = data.get('targetId');
		const parent = data.get('parent');
		const clean = sanitizeHtml(comment.toString());
		const r = {
			target_id: targetId,
			parent: parent,
			content: clean,
			type: 'character',
			author: user.id
		};
		try {
			await locals.pb.collection('comments').create(r);
		} catch (e) {
			return fail(400, { error: e instanceof Error ? e.message : 'Unknown error' });
		}
	}
} satisfies Actions;
