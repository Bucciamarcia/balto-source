import type { UsersResponse } from '#lib/pocketbase-types.js';

export function canModerate(user: UsersResponse | undefined) {
	return user?.role === 'admin' || user?.role === 'moderator';
}
