import type { Actions, PageServerLoad } from "./$types";
import type { NotificationsResponse, CommentsResponse, HomepageNewsResponse, UsersResponse } from "$lib/pocketbase-types";
import { fail } from "@sveltejs/kit";

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
	markNotificationsAsRead: async ({ locals }) => {
		const user = locals.user;
		if (user == null) {
			return fail(401, { error: "Not logged in" });
		}
		let notifications: NotificationsResponse[] = [];
		try {
			notifications = await locals.pb.collection("notifications").getFullList<NotificationsResponse>(

				{
					filter: `for_user="${user.id}" && is_read=false`
				}
			)
		} catch (e) {
			return fail(500, { error: e instanceof Error ? e.message : "Unknown error" })
		}

		for (const n of notifications) {
			try {
				await locals.pb.collection("notifications").update(n.id, {
					is_read: true
				})
			} catch (e) {
				return fail(500, { error: e instanceof Error ? e.message : "Unknown error" })
			}
		}
	},
}
