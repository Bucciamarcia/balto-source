import { redirect, type Actions } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = () => {
	redirect(301, '/en');
};

export const actions: Actions = {
	logout: async ({ locals }) => {
		locals.pb.authStore.clear();
	},
}
