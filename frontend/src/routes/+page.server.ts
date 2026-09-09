import type { Actions, PageServerLoad } from "./$types";
import type { NotificationsResponse, CommentsResponse, HomepageNewsResponse, UsersResponse } from "$lib/pocketbase-types";
import { fail, redirect } from "@sveltejs/kit";
import PocketBase from "pocketbase";
import { PUBLIC_POCKETBASE_URL } from "$lib/pocketbase/url";

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
	const user = locals.user
	return { resultList, flash, loadedComments, user }
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
	singleNotificationRead: async ({ locals, request }) => {
		const data = await request.formData();
		const nid = data.get("id") as string;
		const url = data.get("url") as string;
		try {
			await locals.pb.collection("notifications").update(nid, {
				"is_read": true
			})
		} catch (e) {
			return fail(500, { error: e instanceof Error ? e.message : "Unknown error" })
		}
		throw redirect(303, url)
	},
	resendVerificationEmail: async ({ locals, request }) => {
		const data = await request.formData();
		const email = data.get("email") as string;
		try {
			locals.pb.collection("users").requestVerification(email)
		} catch (e) {
			return fail(500, { error: e instanceof Error ? e.message : "Unknown error" })
		}
	},
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
