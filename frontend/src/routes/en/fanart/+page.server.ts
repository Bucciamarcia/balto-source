import type { FanartFavoritesResponse, FanartsResponse, UsersResponse } from "$lib/pocketbase-types";
import Pocketbase from "pocketbase";
import { fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
export const load: PageServerLoad = async ({ locals }) => {
	const fanarts = await locals.pb.collection("fanarts").getFullList<FanartsResponse<{ author: UsersResponse }>>({ expand: "author", sort: "-created" });

	const favorites: FavoriteByFanart[] = await Promise.all(
		fanarts.map(async (fanart) => ({
			fanart: fanart.id,
			favorites: await getFavorites(fanart.id, locals.pb),
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
		const data = await request.formData()
		const filter = data.get("filter")
		if (filter == null) {
			return fail(500, { error: "couldn't find filter" })
		}
		let results = await locals.pb.collection("fanarts").getFullList<FanartsResponse<{ author: UsersResponse }>>({
			expand: "author", filter: `author ~ "${filter}" || title ~ "${filter}"`
		})
		const users = await findUsersByFilter(filter.toString(), locals.pb);
		for (const user of users) {
			let r = await locals.pb.collection("fanarts").getFullList<FanartsResponse<{ author: UsersResponse }>>({
				expand: "author",
				filter: `author ~ "${user.id}"`
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
		{ filter: `username ~ "${filter}"` }
	)
}

async function getFavorites(fanart: string, pb: Pocketbase): Promise<string[]> {
	const response = await pb.collection("fanart_favorites").getFullList<FanartFavoritesResponse>({
		filter: `target = "${fanart}"`,
		requestKey: null
	})
	return response.map((fa) => fa.id)
}
