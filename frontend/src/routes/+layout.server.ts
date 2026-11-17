import type {
	SourceBannerResponse,
	NotificationsResponse,
	UsersResponse,
	SourceBgResponse
} from '#lib/pocketbase-types.js';
import type { ListResult } from 'pocketbase';
import type { LayoutServerLoad } from './$types';
import { getLocale } from '#lib/paraglide/runtime.js';
import { getSourceSlug } from '#lib/components/getSourceSlug.js';
import { getSourceId } from '#lib/components/getSourceId.ts';
import { POCKETBASE_INTERNAL_URL } from '#lib/server/pocketbaseUrl.ts';

export const load: LayoutServerLoad = async ({ locals, params, cookies }) => {
	const auth = locals.auth;
	const isLoggedIn = auth != null;
	const user = locals.user;
	let r: ListResult<NotificationsResponse<{ source_user: UsersResponse }>>;
	r = await locals.pb
		.collection('notifications')
		.getList<NotificationsResponse<{ source_user: UsersResponse }>>(0, 10, {
			sort: '-created',
			filter: `for_user = "${auth?.id}"`,
			expand: 'source_user'
		});
	const latestNotifications = r.items;
	const newNotifications = latestNotifications.filter((n) => n.is_read === false);
	const newNotificationsCount = newNotifications.length;
	const language = getLocale();
	const source = getSourceSlug(params.source);
	// Snow is on by default; only an explicit non-'true' cookie value turns it off.
	const snow = cookies.get('snow');
	const snowCookie = snow === undefined || snow === 'true';

	// Get the main banner.
	const sourceId = await getSourceId(locals.pb, source);
	const bannerId = await locals.pb
		.collection('source_banner')
		.getFirstListItem<SourceBannerResponse>(locals.pb.filter('source = {:sourceId}', { sourceId }));
	const bannerUrl = `${POCKETBASE_INTERNAL_URL}/api/files/source_banner/${bannerId.id}/${bannerId.file}?thumb=1440x426`;

	// Get the bg image.
	const bgId = await locals.pb
		.collection('source_bg')
		.getFirstListItem<SourceBgResponse>(locals.pb.filter('source = {:sourceId}', { sourceId }));
	const bgUrl = `${POCKETBASE_INTERNAL_URL}/api/files/source_bg/${bgId.id}/${bgId.file}`;
	return {
		user,
		isLoggedIn,
		newNotificationsCount,
		latestNotifications,
		language,
		source,
		snowCookie,
		bannerUrl,
		bgUrl
	};
};
