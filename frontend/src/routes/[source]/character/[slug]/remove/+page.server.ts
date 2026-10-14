import type { CharactersResponse, UsersResponse } from '#lib/pocketbase-types.js';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getLocale } from '#lib/paraglide/runtime.js';
import { getSourceSlug } from '#lib/components/getSourceSlug.js';

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
		const source = getSourceSlug(params.source);
		if (slug == undefined) {
			redirect(303, `/${getLocale()}/${source}`);
		}
		const back = `/${getLocale()}/${source}/character/${slug}`;
		redirect(303, back);
	},
	remove: async ({ params, locals }) => {
		const id = params.slug;
		const source = getSourceSlug(params.source);
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
		redirect(303, `/${getLocale()}/${source}/character/${id}/remove/confirmed`);
	}
} satisfies Actions;
