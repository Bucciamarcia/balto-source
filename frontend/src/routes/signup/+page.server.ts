import { fail } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions: Actions = {
	createUser: async ({ request }) => {
		const data = await request.formData();

		const username = data.get("username") as string;
		const password = data.get("password") as string;
		const email = data.get("email") as string;


		if (!username || !email || !password) {
			return fail(400, { error: "Some data is missing" });
		}

		// TODO: write to the db
		console.log("From server: ", { username, password, email });

		return { success: true };
	}
}
