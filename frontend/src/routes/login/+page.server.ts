import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const actions: Actions = {
	login: async ({ request, locals, cookies }) => {
		const data = await request.formData();
		const email = data.get("email");
		const password = data.get("password");
		if (email == null || password == null) {
			return fail(400, "Email or password empty");
		}
		try {
			await locals.pb.collection("users").authWithPassword(email.toString(), password.toString());
		} catch (e) {
			return fail(400, { message: "Username or password is wrong" });
		}
		cookies.set("flash", "Logged in successfully!", { path: "/", maxAge: 5 });
		throw redirect(303, "/");
	}
}

export const load: PageServerLoad = async ({ locals }) => {
	return {
		loggedUser: locals.user?.id ?? null
	}
}
