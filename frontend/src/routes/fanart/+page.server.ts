import type { FanartsResponse, UsersResponse } from "$lib/pocketbase-types";
import type { PageServerLoad } from "./$types";
export const load: PageServerLoad = async ({ locals }) => {
	const fanarts = locals.pb.collection("fanarts").getFullList<FanartsResponse<{ author: UsersResponse }>>();

	return { fanarts }
}
