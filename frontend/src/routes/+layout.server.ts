import type { NotificationsResponse } from "$lib/pocketbase-types";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals }) => {
	const auth = locals.auth;
	const isLoggedIn = auth != null;
	const user = locals.user;
	const r = await locals.pb.collection("notifications").getList<NotificationsResponse>(0, 2, {
		filter: `for_user = "${auth?.id}"`
	});
	const latestNotifications = r.items;
	const newNotifications = latestNotifications.filter((n) => n.is_read === false)
	const newNotificationsCount = newNotifications.length
	return { user, isLoggedIn, newNotificationsCount, latestNotifications }
}
