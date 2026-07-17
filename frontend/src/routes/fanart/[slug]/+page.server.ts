import type { FanartFavoritesResponse, FanartsResponse, UsersResponse } from "$lib/pocketbase-types";
import { fail } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";

export const load: PageServerLoad = async ({ locals, params }) => {
	const id = params.slug;
	const fanart = await locals.pb.collection("fanarts").getOne<FanartsResponse<{ author: UsersResponse }>>(id, { expand: "author" });
	const favs = await locals.pb.collection("fanart_favorites").getFullList<FanartFavoritesResponse>({
		filter: `target="${id}"`
	})
	return { fanart, favs }
}

export const actions = {
	favorite: async (event) => {
		const user = event.locals.user;
		if (user == null) {
			return fail(400, { "error": "Not logged in" });
		}
	}
} satisfies Actions;
