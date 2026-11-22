import type {
	SourceBannerResponse,
	NotificationsResponse,
	UsersResponse,
	SourceBgResponse,
	SourceCssResponse
} from '#lib/pocketbase-types.js';
import type { ListResult } from 'pocketbase';
import type { LayoutServerLoad } from './$types';
import { getLocale } from '#lib/paraglide/runtime.js';
import { getSourceSlug } from '#lib/components/getSourceSlug.js';
import { getSourceId } from '#lib/components/getSourceId.ts';
import { PUBLIC_POCKETBASE_URL } from '#lib/pocketbase/url.ts';

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
	const bannerUrl = `${PUBLIC_POCKETBASE_URL}/api/files/source_banner/${bannerId.id}/${bannerId.file}?thumb=1440x426`;

	// Get the bg image.
	const bgId = await locals.pb
		.collection('source_bg')
		.getFirstListItem<SourceBgResponse>(locals.pb.filter('source = {:sourceId}', { sourceId }));
	const bgUrl = `${PUBLIC_POCKETBASE_URL}/api/files/source_bg/${bgId.id}/${bgId.file}`;

	// Get the theme css.
	let theme: SourceCssResponse | null = null;
	try {
		theme = await locals.pb
			.collection('source_css')
			.getFirstListItem<SourceCssResponse>(locals.pb.filter('source = {:sourceId}', { sourceId }));
	} catch {}
	const themeCss = buildThemeCss(theme);
	return {
		user,
		isLoggedIn,
		newNotificationsCount,
		latestNotifications,
		language,
		source,
		snowCookie,
		bannerUrl,
		bgUrl,
		themeCss
	};
};

const THEME_COLOR_FIELDS = [
	'base_100',
	'base_200',
	'base_300',
	'base_content',
	'primary',
	'primary_content',
	'secondary',
	'secondary_content',
	'accent',
	'accent_content',
	'neutral',
	'neutral_content',
	'info',
	'info_content',
	'success',
	'success_content',
	'warning',
	'warning_content',
	'error',
	'error_content',
	'menu_left',
	'menu_right'
] as const;

// e.g. oklch(45% 0.13 235) or oklch(45% 0.13 235 / 0.5)
const OKLCH_REGEX = /^oklch\(\s*[\d.]+%?\s+[\d.]+\s+[\d.]+(deg)?(\s*\/\s*[\d.]+%?)?\s*\)$/i;

function buildThemeCss(theme: SourceCssResponse | null): string | null {
	if (theme == null) {
		return null;
	}
	const declarations: string[] = [];
	for (const field of THEME_COLOR_FIELDS) {
		const value = theme[field]?.trim();
		if (value && OKLCH_REGEX.test(value)) {
			declarations.push(`--color-${field.replaceAll('_', '-')}: ${value};`);
		}
	}
	return declarations.length > 0 ? declarations.join('') : null;
}
