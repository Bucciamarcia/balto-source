import type { ChatMessagesResponse, UsersResponse } from "$lib/pocketbase-types";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
	const resultList = await locals.pb.collection("chat_messages")
		.getList<ChatMessagesResponse<{ author: UsersResponse }>>(1, 20, { expand: "author" });

	return { messages: resultList.items }
}
