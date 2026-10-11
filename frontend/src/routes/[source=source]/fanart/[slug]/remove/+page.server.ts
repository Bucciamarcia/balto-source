import { error, fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { FanartsResponse } from '$lib/pocketbase-types';
import { getLocale } from '$lib/paraglide/runtime';

export const load: PageServerLoad = async ({ locals, params }) => {
	const id = params.slug;
	if (id == undefined) {
		throw error(404, 'Not found');
	}
	const fanart = await locals.pb.collection('fanarts').getOne<FanartsResponse>(id);
	const user = locals.user;
	if (user == undefined) {
		throw error(401, 'Not logged in');
	}
	if (fanart.author !== user.id) {
		throw error(401, 'You are not authorized to edit this');
	}
	return { fanart };
};

export const actions = {
	cancel: async ({ params }) => {
		const id = params.slug;
		const locale = getLocale();
		if (id == undefined) {
			redirect(303, `/${locale}`);
		}
		redirect(303, `/${locale}/fanart/${id}`);
	},
	remove: async ({ params, locals }) => {
		const id = params.slug;
		const locale = getLocale();
		if (id == undefined) {
			return fail(400, { error: 'There is no fanart to remove' });
		}
		try {
			await locals.pb.collection('fanarts').update(id, { visible: false });
		} catch (e) {
			return fail(400, { error: e instanceof Error ? e.message : 'Failed to remove fanart' });
		}
		redirect(303, `/${locale}/fanart/${id}/remove/confirmed`);
	}
} satisfies Actions;
