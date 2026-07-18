import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals }) => {
	const user = locals.user;
	const isLoggedIn = user != null;
	return { isLoggedIn }
}
