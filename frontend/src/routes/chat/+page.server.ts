import type { ChatMessagesResponse, UsersResponse } from "$lib/pocketbase-types";
import { fail } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
	const resultList = await locals.pb.collection("chat_messages")
		.getList<ChatMessagesResponse<{ author: UsersResponse }>>(1, 20, { expand: "author", sort: "created" });

	return { messages: resultList.items }
}

export const actions: Actions = {
	sendMessage: async ({ request, locals }) => {
		const data = await request.formData();
		const message = data.get("message")
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
