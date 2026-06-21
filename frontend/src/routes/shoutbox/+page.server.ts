import type { ChatMessagesResponse, UsersResponse } from "$lib/pocketbase-types";
import { fail } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import { isAuthenticated } from "$lib/server/pocketbase/auth";

export const load: PageServerLoad = async ({ locals }) => {
	const authenticated = isAuthenticated(locals.pb);
	const resultList = await locals.pb.collection("chat_messages")
		.getList<ChatMessagesResponse<{ author: UsersResponse }>>(1, 20, { expand: "author", sort: "-created" });
	const items = resultList.items;

	return { messages: items.toReversed(), authenticated: authenticated }
}

export const actions: Actions = {
	sendMessage: async ({ request, locals }) => {
		const data = await request.formData();
		const message = data.get("message")
		if (message?.valueOf() === "") {
			return;
		}
		try {
			await locals.pb.send("/add_chat_message", {
				method: "POST", body: { "message": message }
			})
		} catch (e) {
			const err = e as Error;
			console.error(err.message);
			return fail(500, { message: err.message });
		}
	}
}
