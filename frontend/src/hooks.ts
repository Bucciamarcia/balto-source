import type { Reroute } from '@sveltejs/kit/hooks';
import { deLocalizeUrl } from '#lib/paraglide/runtime.js';

const aliases: Record<string, string> = {
	'/': '/balto'
};

export const reroute: Reroute = (request) => {
	const pathname = deLocalizeUrl(request.url).pathname;
	return aliases[pathname] ?? pathname;
};
