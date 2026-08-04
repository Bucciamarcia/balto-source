<script lang="ts">
	import type { NotificationsResponse } from '$lib/pocketbase-types';

	let { notifications }: { notifications: NotificationsResponse[] } = $props();
</script>

{#each notifications as notification}
	{notification.content}
{/each}
