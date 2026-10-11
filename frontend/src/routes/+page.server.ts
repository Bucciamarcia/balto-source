import { type Actions, fail } from '@sveltejs/kit';

export const actions: Actions = {
	resendVerificationEmail: async ({ locals, request }) => {
		const data = await request.formData();
		const email = data.get('email') as string;
		try {
			locals.pb.collection('users').requestVerification(email);
		} catch (e) {
			return fail(500, { error: e instanceof Error ? e.message : 'Unknown error' });
		}
	}
};
