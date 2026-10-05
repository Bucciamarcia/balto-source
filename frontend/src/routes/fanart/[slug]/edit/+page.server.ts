import type { FanartsResponse, UsersResponse } from '$lib/pocketbase-types';
import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';
import { getLocale } from '$lib/paraglide/runtime';

export const load: PageServerLoad = async ({ locals, params }) => {
	const id = params.slug;
	const fanart = await locals.pb
		.collection('fanarts')
		.getOne<FanartsResponse<{ author: UsersResponse }>>(id);
	return { fanart };
};

export const actions = {
	cancel: async ({ params }) => {
		const locale = getLocale();
		const id = params.slug;
		if (id == undefined) {
			redirect(303, `/${locale}`);
		}
		redirect(303, `/${locale}/fanart/${id}`);
	}
} satisfies Actions;
