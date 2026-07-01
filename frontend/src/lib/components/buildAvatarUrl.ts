import type { UsersResponse } from "$lib/pocketbase-types";
import { PUBLIC_POCKETBASE_URL } from "$lib/pocketbase/url";

export function buildAvatarUrl(user: UsersResponse): string {
	return `${PUBLIC_POCKETBASE_URL}/api/files/users/${user.id}/${user.avatar}?thumb=40x40`;
}
