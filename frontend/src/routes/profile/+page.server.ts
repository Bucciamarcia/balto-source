import { type CommentsResponse, type FanartsResponse, type UsersResponse } from "$lib/pocketbase-types";
import { error, fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { PUBLIC_POCKETBASE_URL } from "$lib/pocketbase/url";
import type Client from "pocketbase";
import sanitizeHtml from "sanitize-html";

export const load: PageServerLoad = async ({ locals, url }) => {
	let uid: string = ""
	const localsId = locals.auth?.id;
	const paramId = url.searchParams.get("id")
	const isLoggedIn = !!locals.pb.authStore.isValid;
	if (paramId != null) {
		uid = paramId
	}
	else if (localsId != null) {
		uid = localsId;
	}
	if (uid === "") {
		error(401, { message: "You are not logged in." });
	}
	const pb = locals.pb;
	let comments: CommentsResponse<{ author: UsersResponse }>[]
	let fanarts: FanartsResponse<{ author: UsersResponse }>[]
	try {
		comments = await pb.collection("comments").getFullList<CommentsResponse<{ author: UsersResponse }>>({
			filter: `type = "profile" && target_id = "${uid}"`, sort: '-created', expand: 'author'
		})
	} catch (e) {
		console.log(`Error in fetching comments: ${e}`)
		comments = [];
	}
	try {
		fanarts = await pb.collection("fanarts").getFullList<FanartsResponse<{ author: UsersResponse }>>(
			{
				filter: `author = "${uid}"`, sort: "-created", expand: "author"
			}
		);
	} catch (e) {
		console.log(`Error fetching fanarts: ${e}`)
		fanarts = [];
	}
	try {
		const user = await locals.pb.collection("users").getOne<UsersResponse>(uid)
		const isSelf = user.id === locals.auth?.id
		const isVerified = locals.user?.verified ?? false;
		return { status: 200, user, isSelf, isVerified, fanarts, comments, isLoggedIn }
	} catch (e) {
		error(404, { message: "Page not found" });
	}
}

export const actions: Actions = {
	changeUsername: async ({ locals, request }) => {
		const id = locals.auth?.id
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

	changeEmail: async ({ locals, request }) => {
		const id = locals.auth?.id
		if (id == null || id === undefined) {
			return fail(401, { error: "Not logged in" });
		}
		const data = await request.formData();
		const newEmailObj = data.get("email");
		let newEmail = newEmailObj?.valueOf();
		if (typeof newEmail !== "string") {
			return fail(400, { error: "this is not a string", newEmail })
		}
		newEmail = newEmail.trim()
		if (newEmail === "" || newEmail instanceof Object) {
			return fail(400, { error: "Email can't be empty", newEmail })
		}
		try {
			await changeEmail(newEmail, locals.pb)
		} catch (e) {
			if (e instanceof Error) {
				const err = e as Error
				const causeJson = err.cause as any

				const fieldErrors = causeJson?.data?.data
				let message = "Unknown error"

				if (fieldErrors) {
					const firstField = Object.keys(fieldErrors)[0]
					message = fieldErrors[firstField]?.message ?? causeJson?.data?.message ?? "Unknown error"
				} else if (causeJson?.data?.message) {
					message = causeJson.data.message
				}

				return fail(400, { error: message })
			}
			return fail(400, { error: "Unknown error" });
		}
	},

	changePassword: async ({ locals }) => {
		const user = locals.pb.authStore.record
		const email = user?.email
		try {
			await locals.pb.collection("users").requestPasswordReset(email)
		} catch (e) {
			if (e instanceof Error) {
				const err = e as Error
				const causeJson = err.cause as any

				const fieldErrors = causeJson?.data?.data
				let message = "Unknown error"

				if (fieldErrors) {
					const firstField = Object.keys(fieldErrors)[0]
					message = fieldErrors[firstField]?.message ?? causeJson?.data?.message ?? "Unknown error"
				} else if (causeJson?.data?.message) {
					message = causeJson.data.message
				}

				return fail(400, { error: message })
			}
			return fail(400, { error: "Unknown error" });
		}
	},

	changeAvatar: async ({ locals, request }) => {
		const user = locals.pb.authStore.record
		if (!user) {
			return fail(401, { error: "Not logged in" });
		}
		const data = await request.formData();
		const file = data.get("avatar") as File;
		if (file.size === 0) {
			return fail(400, { error: "You must first select a file" })
		}
		try {
			await locals.pb.collection("users").update(user.id, { "avatar": file })
		} catch (e) {
			return fail(400, { error: e instanceof Error ? e.message : "Unknown error" })
		}
	},

	updateBio: async ({ locals, request }) => {
		const user = locals.pb.authStore.record
		if (!user) {
			return fail(401, { error: "Not logged in" });
		}
		const data = await request.formData();
		const htmlBio = data.get("html") as string;
		const cleanHtml = sanitizeHtml(htmlBio);
		try {
			await locals.pb.collection("users").update(user.id, { "bio": cleanHtml })
		} catch (e) {
			return fail(400, { error: e instanceof Error ? e.message : "Unknown error" })
		}
	},

	addComment: async ({ locals, request }) => {
		const user = locals.pb.authStore.record
		if (!user) {
			return fail(401, { error: "Not logged in" });
		}
		const data = await request.formData();
		const comment = data.get("comment") as string;
		const targetId = data.get("targetId");
		const parent = data.get("parent");
		const clean = sanitizeHtml(comment);
		const r = { "target_id": targetId, "parent": parent, "content": clean, "type": "profile", "author": user.id }
		try {
			await locals.pb.collection("comments").create(r);
		} catch (e) {
			return fail(400, { error: e instanceof Error ? e.message : "Unknown error" })
		}
	}
}

async function changeUsername(username: string, id: string): Promise<void> {
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

async function changeEmail(email: string, pb: Client): Promise<void> {
	await pb.collection("users").requestEmailChange(email)
}
