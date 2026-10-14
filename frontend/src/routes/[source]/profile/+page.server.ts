import {
	type CommentsResponse,
	type FanartsResponse,
	type NotificationsResponse,
	type UsersResponse
} from '#lib/pocketbase-types.js';
import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { PUBLIC_POCKETBASE_URL } from '#lib/pocketbase/url.js';
import type Client from 'pocketbase';
import sanitizeHtml from 'sanitize-html';
import { moderateImageData, moderateText } from '#lib/components/moderateAi.js';
import type { FavoriteByFanart } from '../fanart/+page.server';
import { getFanartFavorites } from '#lib/components/getFanartFavorites.js';
import { getLocale } from '#lib/paraglide/runtime.js';
import { canModerate } from '#lib/components/canModerate.js';

export const load: PageServerLoad = async ({ locals, url }) => {
	let uid: string = '';
	const localsId = locals.auth?.id;
	const paramId = url.searchParams.get('id');
	const isLoggedIn = !!locals.pb.authStore.isValid;
	if (paramId != null) {
		uid = paramId;
	} else if (localsId != null) {
		uid = localsId;
	}
	if (uid === '') {
		error(401, { message: 'You are not logged in.' });
	}
	const pb = locals.pb;
	let comments: CommentsResponse<{ author: UsersResponse }>[];
	let fanarts: FanartsResponse<{ author: UsersResponse }>[];
	try {
		comments = await pb
			.collection('comments')
			.getFullList<CommentsResponse<{ author: UsersResponse }>>({
				filter: `type = "profile" && target_id = "${uid}"`,
				sort: '-created',
				expand: 'author'
			});
	} catch (e) {
		console.log(`Error in fetching comments: ${e}`);
		comments = [];
	}
	try {
		fanarts = await pb
			.collection('fanarts')
			.getFullList<FanartsResponse<{ author: UsersResponse }>>({
				filter: `author = "${uid}" && visible = true`,
				sort: '-created',
				expand: 'author'
			});
	} catch (e) {
		console.log(`Error fetching fanarts: ${e}`);
		fanarts = [];
	}
	const fanartFavorites: FavoriteByFanart[] = await Promise.all(
		fanarts.map(async (fanart) => ({
			fanart: fanart.id,
			favorites: await getFanartFavorites(fanart.id, locals.pb)
		}))
	);
	try {
		const user = await locals.pb.collection('users').getOne<UsersResponse>(uid);
		const isSelf = user.id === locals.auth?.id;
		const isVerified = locals.user?.verified ?? false;
		return {
			status: 200,
			user,
			isSelf,
			isVerified,
			fanarts,
			comments,
			isLoggedIn,
			fanartFavorites,
			language: getLocale(),
			myself: locals.user
		};
	} catch (e) {
		error(404, { message: 'Page not found' });
	}
};

export const actions: Actions = {
	resendVerificationEmail: async ({ locals, request }) => {
		const data = await request.formData();
		const email = data.get('email') as string;
		try {
			await locals.pb.collection('users').requestVerification(email);
		} catch (e) {
			return fail(500, { error: e instanceof Error ? e.message : 'Unknown error' });
		}
	},
	logout: async ({ locals }) => {
		locals.pb.authStore.clear();
	},
	singleNotificationRead: async ({ locals, request }) => {
		const data = await request.formData();
		const nid = data.get('id') as string;
		const url = data.get('url') as string;
		try {
			await locals.pb.collection('notifications').update(nid, {
				is_read: true
			});
		} catch (e) {
			return fail(500, { error: e instanceof Error ? e.message : 'Unknown error' });
		}
		throw redirect(303, url);
	},
	markNotificationsAsRead: async ({ locals }) => {
		const user = locals.user;
		if (user == null) {
			return fail(401, { error: 'Not logged in' });
		}
		let notifications: NotificationsResponse[] = [];
		try {
			notifications = await locals.pb
				.collection('notifications')
				.getFullList<NotificationsResponse>({
					filter: `for_user="${user.id}" && is_read=false`
				});
		} catch (e) {
			return fail(500, { error: e instanceof Error ? e.message : 'Unknown error' });
		}

		for (const n of notifications) {
			try {
				await locals.pb.collection('notifications').update(n.id, {
					is_read: true
				});
			} catch (e) {
				return fail(500, { error: e instanceof Error ? e.message : 'Unknown error' });
			}
		}
	},
	changeUsername: async ({ locals, request }) => {
		const id = locals.auth?.id;
		if (id == null || id === undefined) {
			return fail(401, { error: 'Not logged in' });
		}
		const data = await request.formData();
		const newUsername = data.get('newUsername');
		if (newUsername == null) {
			return fail(400, { error: 'This is not a valid input', newUsername });
		}
		const moderation = await moderateText(newUsername.toString());
		if (moderation === 'remove') {
			return fail(400, { error: 'This username is not allowed' });
		}
		const v = newUsername?.valueOf();
		if (typeof v !== 'string') {
			return fail(400, { error: 'this is not a string', newUsername });
		}
		const t = v.trim();
		if (t === '') {
			return fail(400, { error: "username can't be empty", newUsername });
		}
		try {
			await changeUsername(t, id, locals.pb.authStore.token);
		} catch (e) {
			return fail(400, { error: e instanceof Error ? e.message : 'Unknown error' });
		}
	},

	changeEmail: async ({ locals, request }) => {
		const id = locals.auth?.id;
		if (id == null || id === undefined) {
			return fail(401, { error: 'Not logged in' });
		}
		const data = await request.formData();
		const newEmailObj = data.get('email');
		let newEmail = newEmailObj?.valueOf();
		if (typeof newEmail !== 'string') {
			return fail(400, { error: 'this is not a string', newEmail });
		}
		newEmail = newEmail.trim();
		if (newEmail === '' || newEmail instanceof Object) {
			return fail(400, { error: "Email can't be empty", newEmail });
		}
		try {
			await changeEmail(newEmail, locals.pb);
		} catch (e) {
			if (e instanceof Error) {
				const err = e as Error;
				const causeJson = err.cause as any;

				const fieldErrors = causeJson?.data?.data;
				let message = 'Unknown error';

				if (fieldErrors) {
					const firstField = Object.keys(fieldErrors)[0];
					message = fieldErrors[firstField]?.message ?? causeJson?.data?.message ?? 'Unknown error';
				} else if (causeJson?.data?.message) {
					message = causeJson.data.message;
				}

				return fail(400, { error: message });
			}
			return fail(400, { error: 'Unknown error' });
		}
	},

	changePassword: async ({ locals }) => {
		const user = locals.pb.authStore.record;
		const email = user?.email;
		try {
			await locals.pb.collection('users').requestPasswordReset(email);
		} catch (e) {
			if (e instanceof Error) {
				const err = e as Error;
				const causeJson = err.cause as any;

				const fieldErrors = causeJson?.data?.data;
				let message = 'Unknown error';

				if (fieldErrors) {
					const firstField = Object.keys(fieldErrors)[0];
					message = fieldErrors[firstField]?.message ?? causeJson?.data?.message ?? 'Unknown error';
				} else if (causeJson?.data?.message) {
					message = causeJson.data.message;
				}

				return fail(400, { error: message });
			}
			return fail(400, { error: 'Unknown error' });
		}
	},

	changeAvatar: async ({ locals, request }) => {
		const user = locals.pb.authStore.record;
		if (!user) {
			return fail(401, { error: 'Not logged in' });
		}
		const data = await request.formData();
		const file = data.get('avatar') as File;
		const moderation = await moderateImageData(file);
		if (moderation === 'remove') {
			return fail(400, { error: 'This avatar is not allowed' });
		}
		if (file.size === 0) {
			return fail(400, { error: 'You must first select a file' });
		}
		try {
			await locals.pb.collection('users').update(user.id, { avatar: file });
		} catch (e) {
			return fail(400, { error: e instanceof Error ? e.message : 'Unknown error' });
		}
	},

	updateBio: async ({ locals, request }) => {
		const user = locals.pb.authStore.record;
		if (!user) {
			return fail(401, { error: 'Not logged in' });
		}
		const data = await request.formData();
		const htmlBio = data.get('html') as string;
		const cleanHtml = sanitizeHtml(htmlBio);
		const moderation = await moderateText(cleanHtml);
		if (moderation === 'remove') {
			return fail(400, { error: 'This content is not allowed' });
		}
		try {
			await locals.pb.collection('users').update(user.id, { bio: cleanHtml });
		} catch (e) {
			return fail(400, { error: e instanceof Error ? e.message : 'Unknown error' });
		}
	},

	addComment: async ({ locals, request }) => {
		const user = locals.pb.authStore.record;
		if (!user) {
			return fail(401, { error: 'Not logged in' });
		}
		const data = await request.formData();
		const comment = data.get('comment') as string;
		const targetId = data.get('targetId');
		const parent = data.get('parent');
		const clean = sanitizeHtml(comment);
		const moderation = await moderateText(clean);
		if (moderation === 'remove') {
			return fail(400, { error: 'This content is not allowed' });
		}
		const r = {
			target_id: targetId,
			parent: parent,
			content: clean,
			type: 'profile',
			author: user.id
		};
		try {
			await locals.pb.collection('comments').create(r);
		} catch (e) {
			return fail(400, { error: e instanceof Error ? e.message : 'Unknown error' });
		}
	},
	banUser: async ({ locals, request }) => {
		const data = await request.formData();
		const user = data.get('user') as string;
		if (!canModerate(locals.user)) {
			fail(403, { error: 'Forbidden: you cannot ban this user' });
		}
		if (user === locals.user?.id) {
			fail(403, { error: 'AchalaException: you cannot ban yourself' });
		}
		await locals.pb.collection('users').update(user, { role: 'banned' });
	},
	unbanUser: async ({ locals, request }) => {
		const data = await request.formData();
		const user = data.get('user') as string;
		if (!canModerate(locals.user)) {
			fail(403, { error: 'Forbidden: you cannot ban this user' });
		}
		if (user === locals.user?.id) {
			fail(403, { error: 'AchalaException: you cannot ban yourself' });
		}
		await locals.pb.collection('users').update(user, { role: 'user' });
	}
};

async function changeUsername(username: string, id: string, token: string): Promise<void> {
	const response = await fetch(`${PUBLIC_POCKETBASE_URL}/change_user`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
		body: JSON.stringify({
			id: id,
			username: username
		})
	});
	if (!response.ok) {
		throw new Error(await response.text());
	}
}

async function changeEmail(email: string, pb: Client): Promise<void> {
	await pb.collection('users').requestEmailChange(email);
}
