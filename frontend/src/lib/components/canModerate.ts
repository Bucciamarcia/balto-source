import type { UsersResponse } from '$lib/pocketbase-types';

export function canModerate(user: UsersResponse | undefined) {
	return user?.role === 'admin' || user?.role === 'moderator';
}
