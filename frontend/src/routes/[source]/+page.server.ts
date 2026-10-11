import { type Actions } from '@sveltejs/kit';
import type { CommentsResponse, HomepageNewsResponse, UsersResponse } from '$lib/pocketbase-types';
import { PUBLIC_POCKETBASE_URL } from '$lib/pocketbase/url';
import PocketBase from 'pocketbase';
import { getLocale } from '$lib/paraglide/runtime';
import type { PageServerLoad } from './$types';
import { getSourceId } from '$lib/components/getSourceId';
import { getSourceSlug } from '$lib/components/getSourceSlug';

export const load: PageServerLoad = async ({ locals, cookies, params }) => {
	const sourceName = getSourceSlug(params.source);
	const flash = cookies.get('flash');
	if (flash) cookies.delete('flash', { path: '/' });
	const source = await getSourceId(locals.pb, sourceName);
	const language = getLocale();
	const resultList = await locals.pb
		.collection('homepage_news')
		.getFullList<HomepageNewsResponse<{ author: UsersResponse }>>({
			sort: '-created',
			expand: 'author',
			filter: locals.pb.filter('source = {:source}', { source: source })
		});

	let loadedComments: Map<string, CommentsResponse[]> = new Map();

	for (let n of resultList) {
		const comments = await locals.pb.collection('comments').getFullList<CommentsResponse>({
			filter: `type="news" && target_id="${n.id}"`
		});
		loadedComments.set(n.id, comments);
	}
	const user = locals.user;
	return { resultList, flash, loadedComments, user, language };
};

export const actions: Actions = {
	impersonateUser: async ({ locals, request }) => {
		const data = await request.formData();
		const email = data.get('email') as string;
		const password = data.get('password') as string;
		const uid = data.get('uid') as string;
		const pb = new PocketBase(PUBLIC_POCKETBASE_URL);
		await pb.collection('_superusers').authWithPassword(email, password);
		const impersonateClient = await pb.collection('users').impersonate(uid, 3600);
		locals.pb.authStore.save(impersonateClient.authStore.token, impersonateClient.authStore.record);
	},
	logout: async ({ locals }) => {
		locals.pb.authStore.clear();
	}
};
