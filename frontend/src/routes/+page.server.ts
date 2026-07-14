import type { Actions, PageServerLoad } from "./$types";
import type { CommentsResponse, HomepageNewsResponse, UsersResponse } from "$lib/pocketbase-types";

export const load: PageServerLoad = async ({ locals, cookies }) => {
	const flash = cookies.get("flash");
	if (flash) cookies.delete("flash", { path: "/" });
	const resultList = await locals.pb.collection("homepage_news").getFullList<HomepageNewsResponse<{ author: UsersResponse }>>({ sort: "-created", expand: "author" });

	let loadedComments: Map<string, CommentsResponse[]> = new Map()

	for (let n of resultList) {
		const comments = await locals.pb.collection("comments").getFullList<CommentsResponse>({
			filter: `type="news" && target_id="${n.id}"`
		});
		loadedComments.set(n.id, comments);
	}
	return { resultList, flash, loadedComments }
}

export const actions: Actions = {
	logout: async ({ locals }) => {
		locals.pb.authStore.clear();
	},
}
