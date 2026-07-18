import { error, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user;
	if (user == null) {
		return error(401, { message: "You are not logged in." });
	}
}

export const actions = {
	uploadFanart: async ({ request }) => {
		const data = await request.formData();
		const fanart = data.get("fanart") as File;
		console.log(fanart.size);
	}
} satisfies Actions;
