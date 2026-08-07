<script lang="ts">
	import { buildAvatarUrl } from '$lib/components/buildAvatarUrl';
	import type { NotificationsResponse, UsersResponse } from '$lib/pocketbase-types';

	let {
		notifications
	}: { notifications: NotificationsResponse<{ source_user: UsersResponse }>[] } = $props();

	function unreadNotifications(): boolean {
		for (const n of notifications) {
			if (n.is_read === false) {
				return true;
			}
		}
		return false;
	}
</script>

{#each notifications as notification}
	<a href={notification.url}>
		<div class="card m-1 bg-neutral{notification.is_read ? '-300' : ''} shadow-sm">
			<div class="card-body">
				<div class="flex">
					<img
						src={buildAvatarUrl(notification.expand.source_user)}
						alt="{notification.expand.source_user.username} avatar"
						height="40"
						width="40"
					/>
					<p class="ml-5 text-center {notification.is_read ? 'text-black' : ''} text-left">
						{notification.content}
					</p>
				</div>
			</div>
		</div>
	</a>
{/each}
{#if unreadNotifications()}
	<form method="POST" action="?/markNotificationsAsRead">
		<button type="submit" class="cursor-pointer text-center text-black underline"
			>Mark all as read</button
		>
	</form>
{/if}
