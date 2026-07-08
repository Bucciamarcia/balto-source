import type { UsersResponse } from "$lib/pocketbase-types";
import { fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { PUBLIC_POCKETBASE_URL } from "$lib/pocketbase/url";

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
	changeUsername: async ({ locals, request }) => {
		const id = locals.user?.id
		if (id == null || id === undefined) {
			return fail(401, { error: "Not logged in" });
		}
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
		try {
			await changeUsername(t, id)
		} catch (e) {
			return fail(400, { error: e instanceof Error ? e.message : "Unknown error" })
		}
	},
}

async function changeUsername(username: string, id: string) {
	const response = await fetch(`${PUBLIC_POCKETBASE_URL}/change_user`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			"id": id,
			"username": username
		})
	})
	if (!response.ok) {
		throw new Error(await response.text());
	}
}
