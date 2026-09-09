import PocketBase from 'pocketbase';
import type { Handle } from '@sveltejs/kit';
import { PUBLIC_POCKETBASE_URL } from '$lib/pocketbase/url';

type LanguageStub = "en" | "fr";
function getLanguageStub(url: string): LanguageStub {
	if (url.startsWith("/en")) {
		return "en"
	} else {
		return "fr"
	}
}

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.pb = new PocketBase(PUBLIC_POCKETBASE_URL);

	event.locals.pb.authStore.loadFromCookie(event.request.headers.get("cookie") || "");

	event.locals.auth = event.locals.pb.authStore.record;
	event.locals.language = getLanguageStub(event.url.pathname)



	try {
		if (event.locals.pb.authStore.isValid) {
			await event.locals.pb.collection("users").authRefresh();
		}
	} catch {
		event.locals.pb.authStore.clear();
	}
	if (event.locals.auth != null) {
		try {
			event.locals.user = await event.locals.pb.collection("users").getOne(event.locals.auth.id);
			event.locals.isVerified = event.locals.user?.verified ?? false;
		} catch {
			event.locals.user = undefined;
		}
	}

	const response = await resolve(event);

	response.headers.append("set-cookie", event.locals.pb.authStore.exportToCookie({ httpOnly: true, secure: true }));

	return response;
};
