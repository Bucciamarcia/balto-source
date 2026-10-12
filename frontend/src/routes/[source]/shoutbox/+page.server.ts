import type { ChatMessagesResponse, UsersResponse } from '$lib/pocketbase-types';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { moderateText } from '$lib/components/moderateAi';
import { getLocale } from '$lib/paraglide/runtime';
import { getSourceId } from '$lib/components/getSourceId';
import { getSourceSlug } from '$lib/components/getSourceSlug';

export const load: PageServerLoad = async ({ locals, params }) => {
	const lang = getLocale();
	const sourceName = getSourceSlug(params.source);
	const source = await getSourceId(locals.pb, sourceName);
	const authenticated = locals.user != null;
	const isVerified = locals.user?.verified ?? false;
	const resultList = await locals.pb
		.collection('chat_messages')
		.getList<
			ChatMessagesResponse<{ author: UsersResponse }>
		>(1, 20, { expand: 'author', sort: '-created', filter: `source = "${source}"` });
	const items = resultList.items;

	return {
		messages: items.toReversed(),
		authenticated: authenticated,
		loggedUser: locals.auth?.id ?? null,
		isVerified,
		language: lang
	};
};

export const actions: Actions = {
	sendMessage: async ({ request, locals, params }) => {
		const data = await request.formData();
		const message = data.get('message');
		const uid = locals.auth?.id;
		const sourceName = getSourceSlug(params.source);
		if (uid == null) {
			return fail(401, { error: 'User not authenticated' });
		}
		if (message == null || message?.valueOf() === '') {
			return;
		}
		try {
			const moderation = await moderateText(message.toString());
			if (moderation === 'remove') {
				return fail(400, { error: 'The comment has not been approved' });
			}
			await locals.pb.collection('chat_messages').create({
				body: message,
				author: uid,
				source: await getSourceId(locals.pb, sourceName)
			});
		} catch (e) {
			const err = e as Error;
			console.error(err.message);
			return fail(500, { message: err.message });
		}
	}
};
