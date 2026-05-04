import type { PageServerLoad } from "./$types";
import PocketBase from "pocketbase";
import {POCKETBASE_URL} from "$lib/pocketbase/url";

export const load: PageServerLoad = async () => {
	const pb = new PocketBase(POCKETBASE_URL);

	const resultList = await pb.collection("homepage_news").getFullList({ sort: "-created" });

	return { resultList }
}
