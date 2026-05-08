import type { Actions, PageServerLoad } from "./$types";
import type { HomepageNewsResponse, UsersResponse } from "$lib/pocketbase-types";

export const load: PageServerLoad = async ({ locals }) => {
	const resultList = await locals.pb.collection("homepage_news").getFullList<HomepageNewsResponse<{ author: UsersResponse }>>({ sort: "-created", expand: "author" });

	return { resultList }
}

export const actions: Actions = {
	logout: async ({ locals }) => {
		locals.pb.authStore.clear();
	}
}
