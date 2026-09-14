import type { Actions, PageServerLoad } from "./$types";
import type { NotificationsResponse, CommentsResponse, HomepageNewsResponse, UsersResponse } from "$lib/pocketbase-types";
import { fail, redirect } from "@sveltejs/kit";
import PocketBase from "pocketbase";
import { PUBLIC_POCKETBASE_URL } from "$lib/pocketbase/url";

export const load: PageServerLoad = async ({ locals, cookies }) => {
	const flash = cookies.get("flash");
	if (flash) cookies.delete("flash", { path: "/" });
	const language = locals.language
	const resultList = await locals.pb.collection("homepage_news")
		.getFullList<HomepageNewsResponse<{ author: UsersResponse }>>({
			sort: "-created",
			expand: "author",
			filter: `language = "${language}"`
		});

	let loadedComments: Map<string, CommentsResponse[]> = new Map()

	for (let n of resultList) {
		const comments = await locals.pb.collection("comments").getFullList<CommentsResponse>({
			filter: `type="news" && target_id="${n.id}"`
		});
		loadedComments.set(n.id, comments);
	}
	const user = locals.user
	return { resultList, flash, loadedComments, user, language }
}

export const actions: Actions = {
	impersonateUser: async ({ locals, request }) => {
		const data = await request.formData();
		const email = data.get("email") as string;
		const password = data.get("password") as string;
		const uid = data.get("uid") as string;
		const pb = new PocketBase(PUBLIC_POCKETBASE_URL);
		await pb.collection("_superusers").authWithPassword(email, password)
		const impersonateClient = await pb.collection("users").impersonate(uid, 3600)
		locals.pb.authStore.save(impersonateClient.authStore.token, impersonateClient.authStore.record);
	}
}
