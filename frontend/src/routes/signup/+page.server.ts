import { fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { ClientResponseError } from "pocketbase";
import { PUBLIC_POCKETBASE_URL } from "$lib/pocketbase/url";

export const actions: Actions = {
	createUser: async ({ request, locals }) => {
		const data = await request.formData();

		const username = data.get("username") as string;
		const password = data.get("password") as string;
		const passwordConfirm = data.get("passwordConfirm") as string;
		const email = data.get("email") as string;


		if (!username || !email || !password) {
			return fail(400, { error: "Some data is missing" });
		}

		if (locals.user != null) {
			throw "You are already logged in";
		}

		// Write to the db
		try {
			const response = await fetch(`${PUBLIC_POCKETBASE_URL}/create_user`, {
				method: "POST",
				headers: {}, body: JSON.stringify({
					"username": username, "password": password, "passwordConfirm": passwordConfirm, "email": email,
				}),
			})
			if (!response.ok) {
				const data = await response.json().catch(() => ({}));
				throw new ClientResponseError({ status: response.status, response: data, url: response.url });
			}
		} catch (e) {
			if (e instanceof ClientResponseError) {
				const firstError = Object.values(e.data.data as Record<string, { message: string }>)[0]?.message;
				return fail(400, { message: firstError ?? e.data.message });
			}
			return fail(400, { message: "An unexpected error has occurred" });
		}
	}
}
export const load: PageServerLoad = async ({ locals }) => {
	return {
		loggedUser: locals.user?.id ?? null
	}
}
