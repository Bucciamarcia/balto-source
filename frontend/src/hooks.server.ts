import PocketBase from 'pocketbase';
import type { Handle } from '@sveltejs/kit';
import { PUBLIC_POCKETBASE_URL } from '$lib/pocketbase/url';

function getLanguageStub(url: string): LanguageStub {
	if (url.startsWith("/en")) {
		return "en"
	} else if (url.startsWith("/fr")) {
		return "fr"
	} else {
		throw new Error(`Unsupported language stub: ${url}`);
	}
}

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.pb = new PocketBase(PUBLIC_POCKETBASE_URL);

	event.locals.pb.authStore.loadFromCookie(event.request.headers.get("cookie") || "");

	event.locals.auth = event.locals.pb.authStore.record;

	try {
		event.locals.language = getLanguageStub(event.url.pathname)
	} catch {
		return new Response("404: This language is not supported", { status: 404 })
	}



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

	const response = await resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%lang%', event.locals.language)
	});

	response.headers.append("set-cookie", event.locals.pb.authStore.exportToCookie({ httpOnly: true, secure: true }));

	return response;
};
