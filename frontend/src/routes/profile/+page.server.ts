import type { UsersResponse } from "$lib/pocketbase-types";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, url }) => {
	let uid: string = ""
	const localsId = locals.user?.id;
	const paramId = url.searchParams.get("id")
	if (paramId != null) {
		uid = paramId
	}
	else if (localsId != null) {
		uid = localsId;
	}
	if (uid === "") {
		return { status: 400, error: "Empty uid" }
	} else {
		try {
			const user = await locals.pb.collection("users").getOne<UsersResponse>(uid)
			return { status: 200, user }
		} catch (e) {
			return { status: 404, error: "Not found" }
		}
	}
}
