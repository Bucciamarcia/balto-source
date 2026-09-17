import type { CommentsResponse, FanfictionFavoritesResponse, FanfictionsResponse, UsersResponse } from "$lib/pocketbase-types";
import { fail } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import sanitizeHtml from "sanitize-html";
import { moderateText } from "$lib/components/moderateAi";

export const load: PageServerLoad = async ({ locals, params }) => {
	async function hasUserAlreadyFaved(userId: string, fanfictionId: string): Promise<boolean> {
		const result = await locals.pb.collection("fanfiction_favorites").getFullList({
			filter: `source = "${userId}" && target = "${fanfictionId}"`
		});
		if (result.length != 0) {
			return true;
		}
		return false;
	}
	const id = params.slug;
	const fanfiction = await locals.pb.collection("fanfictions").getOne<FanfictionsResponse<{ author: UsersResponse }>>(id, { expand: "author" });
	const comments = await locals.pb.collection("comments").getFullList<CommentsResponse<{ author: UsersResponse }>>({
		expand: "author",
		filter: `target_id = "${fanfiction.id}" && type = "fanfiction"`
	})
	const favs = await locals.pb.collection("fanfiction_favorites").getFullList<FanfictionFavoritesResponse>({
		filter: `target="${id}"`
	})
	const user = locals.auth;
	const alreadyFaved = user == null ? false : await hasUserAlreadyFaved(user.id, fanfiction.id);
	const isVerified = locals.isVerified;
	return { fanfiction, favs, user, alreadyFaved, comments, isVerified }
}

export const actions = {
	favorite: async (event) => {
		const user = event.locals.auth;
		if (user == null) {
			return fail(400, { error: "Not logged in" });
		}
		const fanfictionId = event.params.slug;
		try {
			await event.locals.pb.collection("fanfiction_favorites").create({
				source: user.id, target: fanfictionId
			});
		} catch (e) {
			return fail(400, { error: e instanceof Error ? e.message : "Unknown error" })
		}
	},

	removeFavorite: async (event) => {
		const user = event.locals.auth;
		if (user == null) {
			return fail(44, { error: "Not logged in" })
		}
		const id = event.params.slug;
		try {
			const response = await event.locals.pb.collection("fanfiction_favorites").getFullList<FanfictionFavoritesResponse>({
				filter: `target="${id}" && source="${user.id}"`
			});
			const favId: string = response[0].id;
			await event.locals.pb.collection("fanfiction_favorites").delete(favId);
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
		const comment = data.get("comment");
		if (comment == null) {
			return fail(400, { error: "Data invalid" })
		}
		const moderation = await moderateText(comment.toString())
		if (moderation === "remove") {
			return fail(400, { error: "This comment is not allowed" })
		}
		const targetId = data.get("targetId");
		const parent = data.get("parent");
		const clean = sanitizeHtml(comment.toString());
		const r = { "target_id": targetId, "parent": parent, "content": clean, "type": "fanfiction", "author": user.id }
		try {
			await locals.pb.collection("comments").create(r);
		} catch (e) {
			return fail(400, { error: e instanceof Error ? e.message : "Unknown error" })
		}
	}
} satisfies Actions;
