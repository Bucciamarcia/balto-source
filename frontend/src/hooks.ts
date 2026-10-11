import type { Reroute } from '@sveltejs/kit';
import { deLocalizeUrl } from '$lib/paraglide/runtime';

const aliases: Record<string, string> = {
	'/': '/hub'
};

export const reroute: Reroute = (request) => {
	const pathname = deLocalizeUrl(request.url).pathname;
	return aliases[pathname] ?? pathname;
};
