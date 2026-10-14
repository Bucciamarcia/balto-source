import type { FanartsResponse, UsersResponse } from '$lib/pocketbase-types';
import { error, fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getLocale } from '$lib/paraglide/runtime';
import { getSourceSlug } from '$lib/components/getSourceSlug';
import { canModerate } from '$lib/components/canModerate';

export const load: PageServerLoad = async ({ locals, params }) => {
	const id = params.slug;
	if (id == undefined) {
		error(404, "Fanfiction id doesn't exist");
	}
	const fanart = await locals.pb
		.collection('fanarts')
		.getOne<FanartsResponse<{ author: UsersResponse }>>(id);
	const userId = locals.user?.id;
	if (userId !== fanart.author && !canModerate(locals.user)) {
		error(403, 'You are not authorized to view this page');
	}
	return { fanart };
};

export const actions = {
	cancel: async ({ params }) => {
		const locale = getLocale();
		const source = getSourceSlug(params.source);
		const id = params.slug;
		if (id == undefined) {
			redirect(303, `/${locale}/${source}/`);
		}
		redirect(303, `/${locale}/${source}/fanart/${id}`);
	},
	remove: async ({ params }) => {
		const locale = getLocale();
		const source = getSourceSlug(params.source);
		const id = params.slug;
		if (id == undefined) {
			redirect(303, `/${locale}/${source}/`);
		}
		redirect(303, `/${locale}/${source}/fanart/${id}/remove`);
	},
	edit: async ({ params, request, locals }) => {
		const locale = getLocale();
		const source = getSourceSlug(params.source);
		const data = await request.formData();
		const title = data.get('title') as string;
		const description = data.get('description') as string;
		const id = params.slug;
		if (id == undefined) {
			redirect(303, `/${locale}/${source}/`);
		}
		try {
			await locals.pb.collection('fanarts').update(id, {
				title: title,
				description: description
			});
		} catch (e) {
			return fail(400, { error: e instanceof Error ? e.message : 'Unknown error' });
		}
		redirect(303, `/${locale}/${source}/fanart/${id}`);
	}
} satisfies Actions;
