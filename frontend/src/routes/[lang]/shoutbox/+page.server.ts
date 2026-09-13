import type { ChatMessagesResponse, UsersResponse } from "$lib/pocketbase-types";
import { fail } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import { moderateText } from "$lib/components/moderateAi";

export const load: PageServerLoad = async ({ locals }) => {
	const lang = locals.language;
	const authenticated = locals.user != null
	const isVerified = locals.user?.verified ?? false
	const resultList = await locals.pb.collection("chat_messages")
		.getList<ChatMessagesResponse<{ author: UsersResponse }>>(1, 20, { expand: "author", sort: "-created", filter: `language = "${lang}"` });
	const items = resultList.items;

	return { messages: items.toReversed(), authenticated: authenticated, loggedUser: locals.auth?.id ?? null, isVerified }
}

export const actions: Actions = {
	sendMessage: async ({ request, locals }) => {
		const lang = locals.language;
		const data = await request.formData();
		const message = data.get("message")
		const uid = locals.auth?.id
		if (uid == null) {
			return fail(401, { error: "User not authenticated" });
		}
		if (message == null || message?.valueOf() === "") {
			return;
		}
		try {
			const moderation = await moderateText(message.toString());
			if (moderation === "remove") {
				return fail(400, { error: "The comment has not been approved" })
			}
			await locals.pb.collection("chat_messages").create({
				body: message, author: uid, language: lang
			})
		} catch (e) {
			const err = e as Error;
			console.error(err.message);
			return fail(500, { message: err.message });
		}
	}
}
