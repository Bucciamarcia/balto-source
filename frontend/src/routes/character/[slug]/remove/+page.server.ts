import type { CharactersResponse, UsersResponse } from '$lib/pocketbase-types';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const id = params.slug;
	const character = await locals.pb
		.collection('characters')
		.getOne<CharactersResponse<{ owner: UsersResponse }>>(id, { expand: 'owner' });
	return { character };
};

export const actions = {
	cancel: async ({ params }) => {
		const slug = params.slug;
		if (slug == undefined) {
			redirect(303, '/');
		}
		const back = `/character/${slug}`;
		redirect(303, back);
	},
	remove: async ({ params, locals }) => {
		const id = params.slug;
		if (id == undefined) {
			return fail(400, { error: 'There is no character to delete' });
		}
		try {
			await locals.pb.collection('characters').update(id, {
				visible: false
			});
		} catch (e) {
			return fail(500, { error: e instanceof Error ? e.message : 'Unknown error' });
		}
		redirect(303, `/character/${id}/remove/confirmed`);
	}
} satisfies Actions;
