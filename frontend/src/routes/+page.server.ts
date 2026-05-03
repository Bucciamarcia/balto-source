import type { PageServerLoad } from "./$types";
import { error } from "@sveltejs/kit";
import PocketBase from "pocketbase";

export const load: PageServerLoad = async ({ fetch }) => {
	const pb = new PocketBase("http://127.0.0.1:8090");
	const [health, res] = await Promise.all([
		pb.health.check(),
		fetch("http://127.0.0.1:8090/helloworld")
	])
	if (!res.ok) {
		throw error(res.status, "Failed to fetch helloworld");
	}
	const hello = await res.json();
	return { health, hello }
}
