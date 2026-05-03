import type { PageServerLoad } from "./$types";
import PocketBase from "pocketbase";

export const load: PageServerLoad = async () => {
	const pb = new PocketBase("http://127.0.0.1:8090");

	const resultList = await pb.collection("homepage_news").getFullList({ sort: "-created" });

	return { resultList }
}
