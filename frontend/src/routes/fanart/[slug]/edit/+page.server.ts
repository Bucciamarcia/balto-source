import type { FanartsResponse, UsersResponse } from '$lib/pocketbase-types';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
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
	},
	remove: async ({ params }) => {
		const locale = getLocale();
		const id = params.slug;
		if (id == undefined) {
			redirect(303, `/${locale}`);
		}
		redirect(303, `/${locale}/fanart/${id}/remove`);
	},
	edit: async ({ params, request, locals }) => {
		const locale = getLocale();
		const data = await request.formData();
		const title = data.get('title') as string;
		const description = data.get('description') as string;
		const id = params.slug;
		if (id == undefined) {
			redirect(303, `/${locale}`);
		}
		try {
			await locals.pb.collection('fanarts').update(id, {
				title: title,
				description: description
			});
		} catch (e) {
			return fail(400, { error: e instanceof Error ? e.message : 'Unknown error' });
		}
		redirect(303, `/${locale}/fanart/${id}`);
	}
} satisfies Actions;
