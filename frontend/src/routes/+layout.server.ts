import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals }) => {
	const auth = locals.auth;
	const isLoggedIn = auth != null;
	const user = locals.user;
	return { user, isLoggedIn }
}
