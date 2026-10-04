import type { CharactersResponse } from '$lib/pocketbase-types';
import { error, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

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
			redirect(303, '/');
		}
		const back = `/character/${slug}`;
		redirect(303, back);
	},
	remove: async ({ params }) => {
		const slug = params.slug;
		if (slug == undefined) {
			redirect(303, '/');
		}
		const remove = `/character/${slug}/remove`;
		redirect(303, remove);
	},
	edit: async ({ params, request }) => {
		const slug = params.slug;
		if (slug == undefined) {
			redirect(303, '/');
		}
		const data = await request.formData();
		const sex = data.get('sex') as string;
		const avatar = data.get('avatar') as File;
		const ref = data.get('ref_sheet') as File;
		const bio = data.get('bio') as string;
		console.log(sex);
		console.log(avatar);
		console.log(ref);
		console.log(bio);
	}
} satisfies Actions;
