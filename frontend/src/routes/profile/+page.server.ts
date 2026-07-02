import type { UsersResponse } from "$lib/pocketbase-types";
import { fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, url }) => {
	let uid: string = ""
	const localsId = locals.user?.id;
	const paramId = url.searchParams.get("id")
	if (paramId != null) {
		uid = paramId
	}
	else if (localsId != null) {
		uid = localsId;
	}
	if (uid === "") {
		return { status: 400, error: "Empty uid" }
	} else {
		try {
			const user = await locals.pb.collection("users").getOne<UsersResponse>(uid)
			const isSelf = user.id === locals.user?.id
			return { status: 200, user, isSelf }
		} catch (e) {
			return { status: 404, error: "Not found" }
		}
	}
}

export const actions: Actions = {
	changeUsername: async ({ request, locals }) => {
		const data = await request.formData();
		const newUsername = data.get("newUsername");
		const v = newUsername?.valueOf()
		if (typeof v !== "string") {
			return fail(400, { error: "this is not a string", newUsername })
		}
		const t = v.trim()
		if (t === "") {
			return fail(400, { error: "username can't be empty", newUsername })
		}
	}
}
