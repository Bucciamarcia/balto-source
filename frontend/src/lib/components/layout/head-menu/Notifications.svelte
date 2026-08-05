<script lang="ts">
	import type { NotificationsResponse, UsersResponse } from '$lib/pocketbase-types';

	let {
		notifications
	}: { notifications: NotificationsResponse<{ source_user: UsersResponse }>[] } = $props();
</script>

{#each notifications as notification}
	{notification.content}
{/each}
