import type { PageServerLoad } from "./$types";
import PocketBase from "pocketbase";
import { POCKETBASE_URL } from "$lib/server/pocketbase/url";
import type { HomepageNewsResponse, UsersResponse } from "$lib/pocketbase-types";

export const load: PageServerLoad = async () => {
	const pb = new PocketBase(POCKETBASE_URL);

	const resultList = await pb.collection("homepage_news").getFullList<HomepageNewsResponse<{ author: UsersResponse }>>({ sort: "-created", expand: "author" });

	return { resultList }
}
