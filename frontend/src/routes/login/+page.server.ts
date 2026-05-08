import type { Actions, PageServerLoad } from "./$types";

export const actions: Actions = {
	login: async ({ request, locals }) => {
		const data = await request.formData();
		const email = data.get("email");
		const password = data.get("password");
		if (email == null || password == null) {
			throw "Email or password not filled";
		}
		await locals.pb.collection("users").authWithPassword(email.toString(), password.toString());
	}
}

export const load: PageServerLoad = async ({ locals }) => {
	return {
		loggedUser: locals.user?.id ?? "noep"
	}
}
