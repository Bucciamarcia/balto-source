import type { Actions, PageServerLoad } from "./$types";
import type { HomepageNewsResponse, UsersResponse } from "$lib/pocketbase-types";

export const load: PageServerLoad = async ({ locals, cookies }) => {
	const flash = cookies.get("flash");
	if (flash) cookies.delete("flash", { path: "/" });
	const resultList = await locals.pb.collection("homepage_news").getFullList<HomepageNewsResponse<{ author: UsersResponse }>>({ sort: "-created", expand: "author" });

	return { resultList, flash }
}

export const actions: Actions = {
	logout: async ({ locals }) => {
		locals.pb.authStore.clear();
	}
}
