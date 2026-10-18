import type { FanartsResponse, UsersResponse } from '#lib/pocketbase-types.js';
import Pocketbase from 'pocketbase';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getFanartFavorites } from '#lib/components/getFanartFavorites.js';
import { getSourceId } from '#lib/components/getSourceId.js';
import { getSourceSlug } from '#lib/components/getSourceSlug.js';
import { getComments } from '#lib/components/getComments.js';
export const load: PageServerLoad = async ({ locals, params }) => {
	const sourceName = getSourceSlug(params.source);
	const source = await getSourceId(locals.pb, sourceName);
	const fanarts = await locals.pb
		.collection('fanarts')
		.getFullList<FanartsResponse<{ author: UsersResponse }>>({
			expand: 'author',
			sort: '-created',
			filter: locals.pb.filter(`source = {:source} && visible = {:visible}`, {
				source,
				visible: true
			})
		});

	const favorites: FavoriteByFanart[] = await Promise.all(
		fanarts.map(async (fanart) => ({
			fanart: fanart.id,
			favorites: await getFanartFavorites(fanart.id, locals.pb)
		}))
	);
	const comments: CommentsByFanart[] = await Promise.all(
		fanarts.map(async (fanart) => ({
			fanart: fanart.id,
			comments: await getComments(fanart.id, locals.pb)
		}))
	);
	return { fanarts, favorites, comments };
};

export type FavoriteByFanart = {
	fanart: string;
	favorites: string[];
};

export type CommentsByFanart = {
	fanart: string;
	comments: string[];
};

export const actions = {
	filter: async ({ request, locals, params }) => {
		const sourceName = getSourceSlug(params.source);
		const source = await getSourceId(locals.pb, sourceName);
		const data = await request.formData();
		const filter = data.get('filter');
		if (filter == null) {
			return fail(500, { error: "couldn't find filter" });
		}
		let results = await locals.pb
			.collection('fanarts')
			.getFullList<FanartsResponse<{ author: UsersResponse }>>({
				expand: 'author',
				filter: locals.pb.filter(
					`visible = {:visible} && source = {:source} && (author ~ {:filter} || title ~ {:filter})`,
					{ visible: true, source, filter }
				)
			});
		const users = await findUsersByFilter(filter.toString(), locals.pb);
		for (const user of users) {
			let r = await locals.pb
				.collection('fanarts')
				.getFullList<FanartsResponse<{ author: UsersResponse }>>({
					expand: 'author',
					filter: locals.pb.filter(
						`visible = {:visible} && author ~ {:uid} && source = {:source}`,
						{
							visible: true,
							uid: user.id,
							source
						}
					)
				});
			results = [...results, ...r];
		}
		return { result: results };
	},

	clear: async ({}) => {
		return { result: undefined };
	}
} satisfies Actions;

async function findUsersByFilter(filter: string, pb: Pocketbase): Promise<UsersResponse[]> {
	return await pb
		.collection('users')
		.getFullList<UsersResponse>({ filter: pb.filter(`username ~ {:filter}`, { filter }) });
}
