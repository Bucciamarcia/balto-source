<script lang="ts">
	import { buildAvatarUrl } from '$lib/components/buildAvatarUrl';
	import type { NotificationsResponse, UsersResponse } from '$lib/pocketbase-types';

	let {
		notifications
	}: { notifications: NotificationsResponse<{ source_user: UsersResponse }>[] } = $props();
</script>

{#each notifications as notification}
	<a href={notification.url}>
		<div class="card m-1 bg-neutral shadow-sm">
			<div class="card-body">
				<div class="flex">
					<img
						src={buildAvatarUrl(notification.expand.source_user)}
						alt="{notification.expand.source_user.username} avatar"
						height="40"
						width="40"
					/>
					<p class="ml-5 text-center text-left">{notification.content}</p>
				</div>
			</div>
		</div>
	</a>
{/each}
