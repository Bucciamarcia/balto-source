import type { CommentsResponse, HomepageNewsResponse, UsersResponse } from '$lib/pocketbase-types';
import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import sanitizeHtml from "sanitize-html";

export const load: PageServerLoad = async ({ locals, params }) => {
	const newsId = params.slug;
	const news = await locals.pb.collection("homepage_news").getOne<HomepageNewsResponse<{ author: UsersResponse }>>(newsId, { expand: "author" });
	const isLoggedIn = !!locals.pb.authStore.isValid;
	const comments = await locals.pb.collection("comments").getFullList<CommentsResponse<{ author: UsersResponse }>>(
		{
			filter: `type="news" && target_id="${newsId}"`,
			expand: "author"
		}
	)
	const isVerified = locals.isVerified;
	return { news, comments, isLoggedIn, isVerified }
};

export const actions: Actions = {
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
		const r = { "target_id": targetId, "parent": parent, "content": clean, "type": "news", "author": user.id }
		try {
			await locals.pb.collection("comments").create(r);
		} catch (e) {
			return fail(400, { error: e instanceof Error ? e.message : "Unknown error" })
		}
	}
}
