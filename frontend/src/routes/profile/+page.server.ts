import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, url }) => {
	let toReturn: string = ""
	const id = locals.user?.id;
	const uid = url.searchParams.get("id")
	if (uid != null) {
		toReturn = uid
		return { toReturn }
	}
	if (id != null) {
		toReturn = id;
		return { toReturn };
	}
	return { toReturn }
}
