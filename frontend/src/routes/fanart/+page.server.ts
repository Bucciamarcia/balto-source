import type { FanartsResponse, UsersResponse } from "$lib/pocketbase-types";
import type { PageServerLoad } from "./$types";
export const load: PageServerLoad = async ({ locals }) => {
	const fanarts = await locals.pb.collection("fanarts").getFullList<FanartsResponse<{ author: UsersResponse }>>({ expand: "author" });

	return { fanarts }
}
