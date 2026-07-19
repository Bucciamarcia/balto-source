import type { FanartsResponse, UsersResponse } from "$lib/pocketbase-types";
import { fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
export const load: PageServerLoad = async ({ locals }) => {
	const fanarts = await locals.pb.collection("fanarts").getFullList<FanartsResponse<{ author: UsersResponse }>>({ expand: "author", srt: "-created" });

	return { fanarts }
}

export const actions = {
	filter: async ({ request }) => {
		const data = await request.formData()
		const filter = data.get("filter")
		if (filter == null) {
			return fail(500, { error: "couldn't find filter" })
		}
	}
} satisfies Actions;
