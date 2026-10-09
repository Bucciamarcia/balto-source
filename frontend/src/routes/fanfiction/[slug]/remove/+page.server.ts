import { error, fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { FanfictionsResponse } from '$lib/pocketbase-types';
import { getLocale } from '$lib/paraglide/runtime';

export const load: PageServerLoad = async ({ locals, params }) => {
	const id = params.slug;
	if (id == undefined) {
		throw error(404, 'Not found');
	}
	const fanfic = await locals.pb.collection('fanfictions').getOne<FanfictionsResponse>(id);
	const user = locals.user;
	if (user == undefined) {
		error(401, 'Not logged in');
	}
	if (fanfic.author !== user.id) {
		error(401, 'You are not authorized to edit this');
	}
	return { fanfic };
};

export const actions = {
	cancel: async ({ params }) => {
		const id = params.slug;
		const locale = getLocale();
		if (id == undefined) {
			redirect(303, `/${locale}`);
		}
		redirect(303, `/${locale}/fanfiction/${id}`);
	},
	remove: async ({ params, locals }) => {
		const id = params.slug;
		const locale = getLocale();
		if (id == undefined) {
			return fail(400, { error: 'There is no fanfiction to remove' });
		}
		try {
			await locals.pb.collection('fanfictions').update(id, { visible: false });
		} catch (e) {
			return fail(400, { error: e instanceof Error ? e.message : 'Failed to remove fanfiction' });
		}
		redirect(303, `/${locale}/fanfiction/${id}/remove/confirmed`);
	}
} satisfies Actions;
