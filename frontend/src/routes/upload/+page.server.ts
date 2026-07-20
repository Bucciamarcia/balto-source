import { error, fail, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import sanitizeHtml from "sanitize-html";
import { moderateImageData } from "$lib/components/moderateAi";

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.auth;
	if (user == null) {
		error(401, { message: "You are not logged in." });
	}
}

export const actions = {
	uploadFanart: async ({ request, locals }) => {
		const data = await request.formData();
		const fanart = data.get("fanart") as File;
		const title = data.get("title") as string;
		const description = data.get("description") as string;
		const clean = sanitizeHtml(description);
		const user = locals.auth;
		if (fanart.size === 0) {
			return fail(400, { error: "You must upload an image" })
		}
		if (user == null) {
			return fail(401, { error: "You are not logged in." });
		}
		if (title === "") {
			return fail(400, { error: "You must provide a title" });
		}
		if (description === "") {
			return fail(400, { error: "You must provide a description" });
		}
		try {
			const moderation = await moderateImageData(fanart)
			console.log(moderation)
		} catch (e) {
			return fail(500, { error: e instanceof Error ? e.message : "Unknown error" })
		}
		try {
			await locals.pb.collection("fanarts").create({
				author: user.id, image: fanart, title: title, description: clean
			})
		} catch (e) {
			return fail(500, { error: e instanceof Error ? e.message : "Unknown error" });
		}
	}
} satisfies Actions;
