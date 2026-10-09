import { error } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';
import type { FanfictionsResponse } from '$lib/pocketbase-types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const id = params.slug;
	if (id == undefined) {
		error(404, "Fanfiction id doesn't exist");
	}
	const fanfiction = await locals.pb.collection('fanfictions').getOne<FanfictionsResponse>(id);
	return { fanfiction };
};
