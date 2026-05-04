import { fail } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { UsersRoleOptions } from "$lib/pocketbase-types";

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
		await locals.pb.collection("users").create({
			email: email,
			username: username,
			password: password,
			passwordConfirm: passwordConfirm,
			role: UsersRoleOptions.user
		});

		return { success: true };
	}
}
