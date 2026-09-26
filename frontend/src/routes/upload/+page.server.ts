import { error, fail, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import sanitizeHtml from "sanitize-html";
import mammoth from "mammoth";
import { moderateImageData, moderateText } from "$lib/components/moderateAi";
import { FANART_TOO_LARGE_MESSAGE, MAX_FANART_BYTES } from "$lib/limits";
import { getLocale } from "$lib/paraglide/runtime";
import { m } from "$lib/paraglide/messages";

export type CharacterSex = 'male' | 'female' | 'other';

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.auth;
	if (user == null) {
		error(401, { message: "You are not logged in." });
	}
}

export const actions = {
	createCharacter: async ({ request, locals }) => {
		let data: FormData;
		if (locals.auth == null) {
			return fail(401, { error: "Not logged in" })

		}
		try {
			data = await request.formData();
		} catch (e) {
			return fail(400, { error: e instanceof Error ? e.message : "Unknown error occurred" })
		}
		let name = data.get("name") as string;
		const avatar = data.get("avatar") as File | null | undefined;
		const ref = data.get("ref") as File | undefined | null;
		const sex = data.get("sex") as CharacterSex;
		let bio = data.get("bio") as string;
		if (name === "") {
			return fail(400, { error: m.name_ch_req() })
		}
		if (avatar == null || avatar.size === 0) {
			return fail(400, { error: m.ava_ch_req() })
		}
		const [r1, r2, r3, r4] = await Promise.all([
			moderateText(name),
			moderateText(bio),
			moderateImageData(avatar),
			moderateImageData(ref)
		])
		if (r1 === "remove") {
			return fail(400, { error: m.pretty_bird() })
		}
		if (r2 === "remove") {
			return fail(400, { error: m.pretty_seal() })
		}
		if (r3 === "remove") {
			return fail(400, { error: m.pretty_panda() })
		}
		if (r4 === "remove") {
			return fail(400, { error: m.pretty_sloth() })
		}
		name = sanitizeHtml(name)
		bio = sanitizeHtml(bio)
		try {
			locals.pb.collection("characters").create({
				name: name,
				profile_picture: avatar,
				ref_sheet: ref,
				bio: bio,
				owner: locals.auth!.id,
				official: false,
				sex: sex,
				language: getLocale()
			})
		} catch (e) {
			return fail(400, { error: e instanceof Error ? e.message : "Unknown error occurred" })
		}
	},
	uploadFanart: async ({ request, locals }) => {
		let data: FormData;
		try {
			data = await request.formData();
		} catch {
			// adapter-node aborts the body stream when it exceeds BODY_SIZE_LIMIT,
			// and the resulting error would otherwise surface as a bare 500.
			return fail(413, { error: FANART_TOO_LARGE_MESSAGE });
		}
		const fanart = data.get("fanart") as File;
		const title = data.get("title") as string;
		const description = data.get("description") as string;
		const clean = sanitizeHtml(description);
		const user = locals.auth;
		const language = getLocale();
		if (fanart.size === 0) {
			return fail(400, { error: "You must upload an image" })
		}
		if (fanart.size > MAX_FANART_BYTES) {
			return fail(413, { error: FANART_TOO_LARGE_MESSAGE });
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
		try {
			const faMod = await moderateImageData(fanart);
			if (faMod === "remove") {
				return fail(400, { error: "This fanart is not allowed" })
			}
		} catch (e) {
			return fail(500, { error: e instanceof Error ? e.message : "Unknown error" })
		}
		try {
			await locals.pb.collection("fanarts").create({
				author: user.id, image: fanart, title: title, description: clean, language: language
			})
		} catch (e) {
			return fail(500, { error: e instanceof Error ? e.message : "Unknown error" });
		}
	},

	uploadFanfiction: async ({ request, locals }) => {
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
				author: user.id, content: html, title: title, description: clean, language: getLocale()
			})
		} catch (e) {
			return fail(500, { error: e instanceof Error ? e.message : "Unknown error" })
		}
	}
} satisfies Actions;
