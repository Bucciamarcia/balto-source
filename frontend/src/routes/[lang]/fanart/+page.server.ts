import type { FanartsResponse, UsersResponse } from "$lib/pocketbase-types";
import Pocketbase from "pocketbase";
import { fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { getFanartFavorites } from "$lib/components/getFanartFavorites";
export const load: PageServerLoad = async ({ locals }) => {
	const language = locals.language;
	const fanarts = await locals.pb.collection("fanarts")
		.getFullList<FanartsResponse<{ author: UsersResponse }>>({
			expand: "author",
			sort: "-created",
			filter: locals.pb.filter(`language = {:language}`, { language })
		});

	const favorites: FavoriteByFanart[] = await Promise.all(
		fanarts.map(async (fanart) => ({
			fanart: fanart.id,
			favorites: await getFanartFavorites(fanart.id, locals.pb),
		}))
	);
	return { fanarts, favorites }
}

export type FavoriteByFanart = {
	fanart: string;
	favorites: string[];
};

export const actions = {
	filter: async ({ request, locals }) => {
		const language = locals.language;
		const data = await request.formData()
		const filter = data.get("filter")
		if (filter == null) {
			return fail(500, { error: "couldn't find filter" })
		}
		let results = await locals.pb.collection("fanarts").getFullList<FanartsResponse<{ author: UsersResponse }>>({
			expand: "author", filter: locals.pb.filter(`language = {:language} && (author ~ {:filter} || title ~ {:filter})`, { language, filter })
		})
		const users = await findUsersByFilter(filter.toString(), locals.pb);
		for (const user of users) {
			let r = await locals.pb.collection("fanarts").getFullList<FanartsResponse<{ author: UsersResponse }>>({
				expand: "author",
				filter: locals.pb.filter(`author ~ {:uid} && language = {:language}`, { uid: user.id, language })
			});
			results = [...results, ...r];
		}
		return { result: results }
	},

	clear: async ({ }) => {
		return { result: undefined }
	}
} satisfies Actions;

async function findUsersByFilter(filter: string, pb: Pocketbase): Promise<UsersResponse[]> {
	return await pb.collection("users").getFullList<UsersResponse>(
		{ filter: pb.filter(`username ~ {:filter}`, { filter }) }
	)
}
