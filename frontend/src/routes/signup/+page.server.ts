import { fail } from "@sveltejs/kit";
import type { Actions } from "./$types";
import Pocketbase from "pocketbase";
import { POCKETBASE_URL } from "$lib/pocketbase/url";
import { UsersRoleOptions } from "$lib/pocketbase-types";

export const actions: Actions = {
	createUser: async ({ request }) => {
		const pb = new Pocketbase(POCKETBASE_URL);
		const data = await request.formData();

		const username = data.get("username") as string;
		const password = data.get("password") as string;
		const passwordConfirm = data.get("passwordConfirm") as string;
		const email = data.get("email") as string;


		if (!username || !email || !password) {
			return fail(400, { error: "Some data is missing" });
		}

		// Write to the db
		const record = await pb.collection("users").create({
			email: email,
			username: username,
			password: password,
			passwordConfirm: passwordConfirm,
			role: UsersRoleOptions.user
		});

		return { success: true, record: record };
	}
}
