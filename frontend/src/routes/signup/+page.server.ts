import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { ClientResponseError } from 'pocketbase';
import { PUBLIC_POCKETBASE_URL } from '$lib/pocketbase/url';

type PocketBaseErrorResponse = {
	message?: unknown;
	data?: unknown;
};

function firstPocketBaseErrorMessage(data: unknown): string | undefined {
	if (!data || typeof data !== 'object') {
		return undefined;
	}

	for (const value of Object.values(data as Record<string, unknown>)) {
		if (!value || typeof value !== 'object') {
			continue;
		}

		const message = (value as { message?: unknown }).message;
		if (typeof message === 'string' && message.length > 0) {
			return message;
		}

		const nestedMessage = firstPocketBaseErrorMessage(value);
		if (nestedMessage) {
			return nestedMessage;
		}
	}
}

function pocketBaseErrorMessage(data: unknown): string {
	const response = data as PocketBaseErrorResponse;

	return (
		firstPocketBaseErrorMessage(response.data) ??
		(typeof response.message === 'string' && response.message.length > 0
			? response.message
			: 'An unexpected error has occurred')
	);
}

export const actions: Actions = {
	createUser: async ({ request, locals }) => {
		const data = await request.formData();

		const username = data.get('username') as string;
		const password = data.get('password') as string;
		const passwordConfirm = data.get('passwordConfirm') as string;
		const email = data.get('email') as string;

		if (!username || !email || !password) {
			return fail(400, { error: 'Some data is missing' });
		}

		if (locals.user != null) {
			throw 'You are already logged in';
		}

		// Write to the db
		try {
			const response = await fetch(`${PUBLIC_POCKETBASE_URL}/create_user`, {
				method: 'POST',
				headers: {},
				body: JSON.stringify({
					username: username,
					password: password,
					passwordConfirm: passwordConfirm,
					email: email
				})
			});
			if (!response.ok) {
				const data = await response.json().catch(() => ({}));
				throw new ClientResponseError({
					status: response.status,
					response: data,
					url: response.url
				});
			}
		} catch (e) {
			if (e instanceof ClientResponseError) {
				return fail(400, { message: pocketBaseErrorMessage(e.data) });
			}
			return fail(400, { message: 'An unexpected error has occurred' });
		}
		return { success: true }
	}
};
export const load: PageServerLoad = async ({ locals }) => {
	return {
		loggedUser: locals.user?.id ?? null
	};
};
