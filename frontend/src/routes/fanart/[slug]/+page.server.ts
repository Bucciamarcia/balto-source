import type { CommentsResponse, FanartFavoritesResponse, FanartsResponse, UsersResponse } from "$lib/pocketbase-types";
import { fail } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import sanitizeHtml from "sanitize-html";

export const load: PageServerLoad = async ({ locals, params }) => {
	async function hasUserAlreadyFaved(userId: string, fanartId: string): Promise<boolean> {
		const result = await locals.pb.collection("fanart_favorites").getFullList({
			filter: `source = "${userId}" && target = "${fanartId}"`
		});
		if (result.length != 0) {
			return true;
		}
		return false;
	}
	const id = params.slug;
	const fanart = await locals.pb.collection("fanarts").getOne<FanartsResponse<{ author: UsersResponse }>>(id, { expand: "author" });
	const comments = await locals.pb.collection("comments").getFullList<CommentsResponse<{ author: UsersResponse }>>({
		expand: "author",
		filter: `target_id = "${fanart.id}" && type = "fanart"`
	})
	const favs = await locals.pb.collection("fanart_favorites").getFullList<FanartFavoritesResponse>({
		filter: `target="${id}"`
	})
	const user = locals.user;
	const alreadyFaved = user == null ? false : await hasUserAlreadyFaved(user.id, fanart.id);
	return { fanart, favs, user, alreadyFaved, comments }
}

export const actions = {
	favorite: async (event) => {
		const user = event.locals.user;
		if (user == null) {
			return fail(400, { error: "Not logged in" });
		}
		const fanartId = event.params.slug;
		try {
			await event.locals.pb.collection("fanart_favorites").create({
				source: user.id, target: fanartId
			});
		} catch (e) {
			return fail(400, { error: e instanceof Error ? e.message : "Unknown error" })
		}
	},

	removeFavorite: async (event) => {
		const user = event.locals.user;
		if (user == null) {
			return fail(44, { error: "Not logged in" })
		}
		const id = event.params.slug;
		try {
			const response = await event.locals.pb.collection("fanart_favorites").getFullList<FanartFavoritesResponse>({
				filter: `target="${id}" && source="${user.id}"`
			});
			const favId: string = response[0].id;
			await event.locals.pb.collection("fanart_favorites").delete(favId);
		} catch (e) {
			return fail(400, { error: e instanceof Error ? e.message : "Unknown error" })
		}
	},

	addComment: async ({ locals, request }) => {
		const user = locals.pb.authStore.record
		if (!user) {
			return fail(401, { error: "Not logged in" });
		}
		const data = await request.formData();
		const comment = data.get("comment") as string;
		const targetId = data.get("targetId");
		const parent = data.get("parent");
		const clean = sanitizeHtml(comment);
		const r = { "target_id": targetId, "parent": parent, "content": clean, "type": "fanart", "author": user.id }
		try {
			await locals.pb.collection("comments").create(r);
		} catch (e) {
			return fail(400, { error: e instanceof Error ? e.message : "Unknown error" })
		}
	}
} satisfies Actions;
