import { error } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user;

	if (user?.role === 'banned') {
		error(403, 'Forbidden: you are banned');
	}
};
