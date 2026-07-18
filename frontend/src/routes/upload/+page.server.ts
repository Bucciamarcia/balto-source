import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user;
	if (user == null) {
		return error(401, { message: "You are not logged in." });
	}
}
