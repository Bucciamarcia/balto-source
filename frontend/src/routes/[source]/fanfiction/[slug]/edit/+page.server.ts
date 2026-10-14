import { error, fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';
import type { FanfictionsResponse } from '#lib/pocketbase-types.js';
import mammoth from 'mammoth';
import sanitize from 'sanitize-html';
import { getLocale } from '#lib/paraglide/runtime.js';
import { getSourceSlug } from '#lib/components/getSourceSlug.js';
import { canModerate } from '#lib/components/canModerate.js';

export const load: PageServerLoad = async ({ params, locals }) => {
	const id = params.slug;
	if (id == undefined) {
		error(404, "Fanfiction id doesn't exist");
	}
	const fanfiction = await locals.pb.collection('fanfictions').getOne<FanfictionsResponse>(id);
	const userId = locals.user?.id;
	if (userId == undefined) {
		error(401, 'Unauthorized');
	}
	if (fanfiction.author !== userId && !canModerate(locals.user)) {
		error(403, 'You do not have permission to edit this fanfiction');
	}
	return { fanfiction };
};

export const actions = {
	edit: async ({ params, request, locals }) => {
		const id = params.slug;
		if (id == undefined) {
			return fail(500, { error: "couldn't find fanfiction id" });
		}
		const data = await request.formData();
		const title = data.get('title') as string;
		const description = data.get('description') as string;
		const source = getSourceSlug(params.source);
		const fanfic = data.get('fanfiction') as File;
		const update = new FormData();
		update.set('title', title);
		update.set('description', description);
		if (fanfic.size !== 0) {
			const fanficArrayBuffer = await fanfic.arrayBuffer();
			const fanficHtml = await mammoth.convertToHtml({
				buffer: Buffer.from(fanficArrayBuffer)
			});
			update.set('content', sanitize(fanficHtml.value));
		}
		try {
			await locals.pb.collection('fanfictions').update(id, update);
		} catch (e) {
			return fail(400, { error: e instanceof Error ? e.message : 'Unknown error occurred' });
		}
		redirect(303, `/${getLocale()}/${source}/fanfiction/${id}`);
	},
	cancel: async ({ params }) => {
		const id = params.slug;
		const source = getSourceSlug(params.source);
		if (id == undefined) {
			redirect(303, `/${getLocale()}/${source}/fanfiction`);
		}
		redirect(303, `/${getLocale()}/${source}/fanfiction/${id}`);
	},
	remove: async ({ params }) => {
		const locale = getLocale();
		const source = getSourceSlug(params.source);
		const id = params.slug;
		if (id == undefined) {
			redirect(303, `/${locale}`);
		}
		redirect(303, `/${locale}/${source}/fanfiction/${id}/remove`);
	}
} satisfies Actions;
