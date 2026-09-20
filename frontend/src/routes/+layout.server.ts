import type { NotificationsResponse, UsersResponse } from "$lib/pocketbase-types";
import type { ListResult } from "pocketbase";
import type { LayoutServerLoad } from "./$types";
import { getLocale } from "$lib/paraglide/runtime";

export const load: LayoutServerLoad = async ({ locals }) => {
	const auth = locals.auth;
	const isLoggedIn = auth != null;
	const user = locals.user;
	let r: ListResult<NotificationsResponse<{ source_user: UsersResponse }>>
	r = await locals.pb.collection("notifications").getList<NotificationsResponse<{ source_user: UsersResponse }>>(0, 10, {
		sort: "-created",
		filter: `for_user = "${auth?.id}"`,
		expand: "source_user"
	});
	const latestNotifications = r.items;
	const newNotifications = latestNotifications.filter((n) => n.is_read === false)
	const newNotificationsCount = newNotifications.length
	const language = getLocale()
	return { user, isLoggedIn, newNotificationsCount, latestNotifications, language }
}
