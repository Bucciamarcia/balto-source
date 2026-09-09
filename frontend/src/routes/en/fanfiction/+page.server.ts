import type { FanfictionFavoritesResponse, FanfictionsResponse, UsersResponse } from "$lib/pocketbase-types";
import Pocketbase from "pocketbase";
import { fail, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";

export const load: PageServerLoad = async ({ locals }) => {
	const fanfictions = await locals.pb.collection("fanfictions").getFullList<FanfictionsResponse<{ author: UsersResponse }>>({ expand: "author", sort: "-created" });

	const favorites: FavoriteByFanfiction[] = await Promise.all(
		fanfictions.map(async (fanfic) => ({
			fanfiction: fanfic.id,
			favorites: await getFavorites(fanfic.id, locals.pb),
		}))
	);
	return { fanfictions, favorites }
}

export const actions = {
	filter: async ({ request, locals }) => {
		const data = await request.formData()
		const filter = data.get("filter")
		if (filter == null) {
			return fail(500, { error: "couldn't find filter" })
		}
		let results = await locals.pb.collection("fanfictions").getFullList<FanfictionsResponse<{ author: UsersResponse }>>({
			expand: "author", filter: `author ~ "${filter}" || title ~ "${filter}"`
		})
		const users = await findUsersByFilter(filter.toString(), locals.pb);
		for (const user of users) {
			let r = await locals.pb.collection("fanfictions").getFullList<FanfictionsResponse<{ author: UsersResponse }>>({
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
export type FavoriteByFanfiction = {
	fanfiction: string;
	favorites: string[];
};
async function getFavorites(fanart: string, pb: Pocketbase): Promise<string[]> {
	const response = await pb.collection("fanfiction_favorites").getFullList<FanfictionFavoritesResponse>({
		filter: `target = "${fanart}"`,
		requestKey: null
	})
	return response.map((fa) => fa.id)
}
