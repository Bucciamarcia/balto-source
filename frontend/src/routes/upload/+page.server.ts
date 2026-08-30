import { error, fail, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import sanitizeHtml from "sanitize-html";
import mammoth from "mammoth";
import { moderateImageData, moderateText } from "$lib/components/moderateAi";

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
		const titleMod = await moderateText(title);
		if (titleMod === "remove") {
			return fail(400, { error: "This title is not allowed" })
		}
		const desMod = await moderateText(description);
		if (desMod === "remove") {
			return fail(400, { error: "This description is not allowed" })
		}
		const faMod = await moderateImageData(fanart);
		if (faMod === "remove") {
			return fail(400, { error: "This fanart is not allowed" })
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
	},

	previewFanfiction: async ({ request, locals }) => {
		const user = locals.user
		if (user == null) {
			return fail(500, { error: "You are not logged in" })
		}
		const data = await request.formData();
		const fanfic = data.get("fanfiction") as File;
		const title = data.get("title") as string;
		const titleMod = await moderateText(title);
		if (titleMod === "remove") {
			return fail(400, { error: "This title is not allowed" })
		}
		const description = data.get("description") as string;
		const clean = sanitizeHtml(description);
		const descriptionMod = await moderateText(clean);
		if (descriptionMod === "remove") {
			return fail(400, { error: "This description is now allowed" })
		}
		try {
			const fanficArrayBuffer = await fanfic.arrayBuffer()
			const r = await mammoth.convertToHtml({
				buffer: Buffer.from(fanficArrayBuffer)
			})
			const html = r.value;
			const fanficMod = await moderateText(html, "fanfiction")
			if (fanficMod === "remove") {
				return fail(400, { error: "The fanfiction didn't pass moderation. If you think this is a mistake, contact the staff." })
			}
			await locals.pb.collection("fanfictions").create({
				author: user.id, content: html, title: title, description: clean
			})
		} catch (e) {
			return fail(500, { error: e instanceof Error ? e.message : "Unknown error" })
		}
	}
} satisfies Actions;
