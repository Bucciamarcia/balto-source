import type { CharactersResponse } from '$lib/pocketbase-types';
import { error, fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getLocale } from '$lib/paraglide/runtime';

export const load: PageServerLoad = async ({ locals, params }) => {
	const slug = params.slug;
	const character = await locals.pb.collection('characters').getOne<CharactersResponse>(slug);
	if (character.owner !== locals.user?.id) {
		error(401, 'You cannot edit this character: you are not logged in or you are not the owner');
	}
	return { character };
};

export const actions = {
	cancel: async ({ params }) => {
		const slug = params.slug;
		if (slug == undefined) {
			redirect(303, `/${getLocale()}`);
		}
		const back = `/${getLocale()}/character/${slug}`;
		redirect(303, back);
	},
	remove: async ({ params }) => {
		const slug = params.slug;
		if (slug == undefined) {
			redirect(303, `/${getLocale()}`);
		}
		const remove = `/${getLocale()}/character/${slug}/remove`;
		redirect(303, remove);
	},
	edit: async ({ params, request, locals }) => {
		const slug = params.slug;
		if (slug == undefined) {
			redirect(303, `/${getLocale()}`);
		}
		const data = await request.formData();
		const sex = data.get('sex') as string;
		const avatar = data.get('avatar') as File;
		const ref = data.get('ref_sheet') as File;
		const bio = data.get('bio') as string;
		const update = new FormData();
		update.set('sex', sex);
		update.set('bio', bio);
		if (avatar.size !== 0) {
			update.set('profile_picture', avatar);
		}
		if (ref.size !== 0) {
			update.set('ref_sheet', ref);
		}
		try {
			await locals.pb.collection('characters').update(slug, update);
		} catch (e) {
			return fail(400, { error: e instanceof Error ? e.message : 'Unknown error occurred' });
		}
		redirect(303, `${getLocale()}/character/${slug}`);
	}
} satisfies Actions;
